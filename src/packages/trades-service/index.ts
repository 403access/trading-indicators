/**
 * Trades service that manages fetching from Kraken API and storing in database
 */

import {
	getDatabaseStats,
	getLatestTradeTimestamp,
	getSyncState,
	getTrades,
	initializeDatabase,
	updateSyncState,
	updateTradesCount,
	upsertTrades,
} from "#/packages/database";
import type {
	GetTradesHistoryRequest,
	Trade,
	TradeHistory,
} from "#/packages/kraken";
import { getTradesHistory } from "#/packages/kraken";

// Initialize database on module load
initializeDatabase();

/**
 * Fetch trades with automatic database caching and API synchronization
 */
export async function getTradesWithSync(
	options: {
		offset?: number;
		limit?: number;
		pair?: string;
		type?: string;
		startTime?: number;
		endTime?: number;
		forceRefresh?: boolean;
	} = {},
): Promise<TradeHistory> {
	const { forceRefresh = false, ...dbOptions } = options;

	try {
		// Get existing data from database
		const dbResult = getTrades(dbOptions);

		// Determine if we need to fetch new data from API
		const syncState = getSyncState();
		const now = Date.now();
		const lastSync = syncState?.lastSyncTimestamp || 0;
		const syncInterval = 5 * 60 * 1000; // 5 minutes

		const shouldFetchFromAPI =
			forceRefresh || now - lastSync > syncInterval || dbResult.count === 0;

		if (shouldFetchFromAPI) {
			console.log("Fetching fresh data from Kraken API...");
			await syncTradesFromAPI();

			// Get updated data from database after sync
			const updatedResult = getTrades(dbOptions);
			return {
				count: updatedResult.count,
				trades: updatedResult.trades,
			};
		}

		console.log(
			`Returning ${Object.keys(dbResult.trades).length} trades from database cache`,
		);
		return {
			count: dbResult.count,
			trades: dbResult.trades,
		};
	} catch (error) {
		console.error("Error in getTradesWithSync:", error);

		// Fallback to database data if API fails
		const dbResult = getTrades(dbOptions);
		return {
			count: dbResult.count,
			trades: dbResult.trades,
		};
	}
}

/**
 * Sync trades from Kraken API to database
 */
export async function syncTradesFromAPI(): Promise<{
	newTrades: number;
	totalTrades: number;
	error?: string;
}> {
	try {
		console.log("Starting sync from Kraken API...");

		// Get the latest trade timestamp from database
		const latestTimestamp = getLatestTradeTimestamp();

		// Prepare API request parameters
		const apiParams: GetTradesHistoryRequest = {
			nonce: Date.now(),
			type: "all",
			trades: false,
			consolidate_taker: true,
		};

		// If we have existing data, only fetch newer trades
		if (latestTimestamp > 0) {
			apiParams.start = latestTimestamp + 1; // Exclusive start
		}

		console.log("Fetching trades from API with params:", apiParams);

		// Fetch from Kraken API
		const apiResponse = await getTradesHistory(apiParams);

		if (apiResponse.error && apiResponse.error.length > 0) {
			throw new Error(`Kraken API error: ${apiResponse.error.join(", ")}`);
		}

		if (!apiResponse.result) {
			throw new Error("No result data from Kraken API");
		}

		// Type assertion to work around complex Kraken response types
		const resultData = apiResponse.result as unknown as {
			trades: { [key: string]: Trade };
			count: number;
		};
		const trades = resultData.trades || {};
		const count = resultData.count || 0;

		console.log(
			`API returned ${Object.keys(trades).length} trades (total available: ${count})`,
		);

		// Store in database
		const insertedCount = upsertTrades(trades);

		// Update sync state
		if (Object.keys(trades).length > 0) {
			const tradeTimestamps = Object.values(trades).map((t: Trade) => t.time);
			const newLatestTimestamp = Math.max(...tradeTimestamps, latestTimestamp);
			console.log(`Latest trade timestamp: ${newLatestTimestamp}`);
		}

		updateSyncState(Date.now());
		updateTradesCount();

		console.log(`Sync completed: ${insertedCount} trades processed`);

		return {
			newTrades: insertedCount,
			totalTrades: count,
		};
	} catch (error) {
		console.error("Error syncing trades from API:", error);
		return {
			newTrades: 0,
			totalTrades: 0,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get database statistics and health info
 */
export function getTradesServiceInfo() {
	const stats = getDatabaseStats();
	const syncState = getSyncState();

	return {
		database: stats,
		lastSync: syncState
			? {
					timestamp: syncState.lastSyncTimestamp,
					formattedTime: new Date(syncState.lastSyncTimestamp).toISOString(),
					lastTradeId: syncState.lastTradeId,
				}
			: null,
		health: {
			dbConnected: true,
			hasData: stats.totalTrades > 0,
			oldestTrade: stats.oldestTradeTime
				? new Date(stats.oldestTradeTime * 1000).toISOString()
				: null,
			newestTrade: stats.newestTradeTime
				? new Date(stats.newestTradeTime * 1000).toISOString()
				: null,
		},
	};
}

/**
 * Force a full resync of all trades (useful for initial setup or data recovery)
 */
export async function fullResyncTrades(): Promise<{
	success: boolean;
	totalTrades: number;
	error?: string;
}> {
	try {
		console.log("Starting full resync of all trades...");

		// Clear sync state to fetch all data
		updateSyncState(0);

		const result = await syncTradesFromAPI();

		return {
			success: !result.error,
			totalTrades: result.totalTrades,
			error: result.error,
		};
	} catch (error) {
		console.error("Error in full resync:", error);
		return {
			success: false,
			totalTrades: 0,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
