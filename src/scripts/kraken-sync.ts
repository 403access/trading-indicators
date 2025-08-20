/**
 * Kraken Full Trade History Sync Script
 *
 * This script fetches the complete trade history from Kraken API using pagination
 * and stores it in the local SQLite database. It bypasses the web API and calls
 * Kraken directly for maximum efficiency.
 */

import {
	getDatabaseStats,
	getSyncState,
	initializeDatabase,
	updateSyncState,
	updateTradesCount,
	upsertTrades,
} from "#/packages/database";
import {
	type GetTradesHistoryRequest,
	getTradesHistory,
	type Trade,
} from "#/packages/kraken";

// Kraken API Rate Limits Configuration
// Based on: https://docs.kraken.com/rest/#section/Rate-Limits
interface KrakenRateLimits {
	maxCounter: number;
	decreasePerSecond: number;
	accountLevel: "Starter" | "Intermediate" | "Pro";
}

// Account verification levels and their limits
const RATE_LIMITS: Record<string, KrakenRateLimits> = {
	Starter: { maxCounter: 15, decreasePerSecond: 0.33, accountLevel: "Starter" },
	Intermediate: {
		maxCounter: 20,
		decreasePerSecond: 0.5,
		accountLevel: "Intermediate",
	},
	Pro: { maxCounter: 20, decreasePerSecond: 1.0, accountLevel: "Pro" },
};

// TradesHistory endpoint increases counter by +2 per request
const TRADES_HISTORY_COST = 2;

// Configuration
const BATCH_SIZE = 50; // Kraken returns max 50 trades per request
const MAX_RETRIES = 5;

// Assume Pro account level by default (most conservative approach)
const ACCOUNT_LEVEL: KrakenRateLimits = RATE_LIMITS["Pro"];

/**
 * Rate limiter class to manage Kraken API calls
 */
class KrakenRateLimiter {
	private counter: number = 0;
	private lastCallTime: number = Date.now();
	private readonly limits: KrakenRateLimits;

	constructor(accountLevel: KrakenRateLimits = ACCOUNT_LEVEL) {
		this.limits = accountLevel;
	}

	/**
	 * Update counter based on time elapsed since last call
	 */
	private updateCounter(): void {
		const now = Date.now();
		const secondsElapsed = (now - this.lastCallTime) / 1000;
		const decrease = secondsElapsed * this.limits.decreasePerSecond;

		this.counter = Math.max(0, this.counter - decrease);
		this.lastCallTime = now;
	}

	/**
	 * Check if we can make a call and calculate required delay
	 */
	async waitForRateLimit(cost: number = TRADES_HISTORY_COST): Promise<void> {
		this.updateCounter();

		// If adding this call would exceed the limit, calculate delay needed
		if (this.counter + cost > this.limits.maxCounter) {
			const excessCost = this.counter + cost - this.limits.maxCounter;
			const delaySeconds = excessCost / this.limits.decreasePerSecond;
			const delayMs = Math.ceil(delaySeconds * 1000);

			console.log(
				`⏳ Rate limit protection: waiting ${delayMs}ms (counter: ${this.counter.toFixed(2)}/${this.limits.maxCounter})`,
			);

			await this.delay(delayMs);
			this.updateCounter(); // Update counter after delay
		}

		// Add the cost of this call
		this.counter += cost;
		console.log(
			`📊 Rate limiter: counter at ${this.counter.toFixed(2)}/${this.limits.maxCounter} (${this.limits.accountLevel} level)`,
		);
	}

	/**
	 * Handle rate limit errors from API
	 */
	async handleRateLimitError(): Promise<void> {
		// If we got rate limited, our counter estimation was wrong
		// Reset to max and wait for it to decrease
		this.counter = this.limits.maxCounter;
		const delaySeconds = this.limits.maxCounter / this.limits.decreasePerSecond;
		const delayMs = Math.ceil(delaySeconds * 1000);

		console.log(
			`🚨 Rate limit hit! Resetting counter and waiting ${delayMs}ms for full recovery`,
		);
		await this.delay(delayMs);
		this.counter = 0; // Reset after full recovery
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Get current status for debugging
	 */
	getStatus(): { counter: number; maxCounter: number; accountLevel: string } {
		this.updateCounter();
		return {
			counter: Math.round(this.counter * 100) / 100,
			maxCounter: this.limits.maxCounter,
			accountLevel: this.limits.accountLevel,
		};
	}
}

// Global rate limiter instance
const rateLimiter = new KrakenRateLimiter();

interface SyncProgress {
	totalProcessed: number;
	totalInDatabase: number;
	batchesProcessed: number;
	startTime: number;
	lastTimestamp?: number;
	errors: string[];
}

/**
 * Delay function to respect rate limits
 */
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a single batch of trades with retry logic and proper rate limiting
 */
async function fetchTradesBatch(
	params: GetTradesHistoryRequest,
	retryCount = 0,
): Promise<{ trades: { [key: string]: Trade }; count: number } | null> {
	try {
		// Wait for rate limit before making the call
		await rateLimiter.waitForRateLimit(TRADES_HISTORY_COST);

		console.log(`Fetching batch with offset ${params.ofs || 0}...`);

		const response = await getTradesHistory(params);

		if (response.error && response.error.length > 0) {
			const errorMessage = response.error.join(", ");

			// Check for rate limit errors from API
			if (errorMessage.toLowerCase().includes("rate limit")) {
				console.log(`🚨 API returned rate limit error: ${errorMessage}`);
				await rateLimiter.handleRateLimitError();

				// Retry immediately after handling rate limit
				if (retryCount < MAX_RETRIES) {
					return fetchTradesBatch(params, retryCount + 1);
				}
			}

			// Check for nonce errors
			if (
				errorMessage.includes("nonce") ||
				errorMessage.includes("Invalid nonce")
			) {
				console.log(`🕐 Nonce error detected: ${errorMessage}`);
				// For nonce errors, wait a bit and retry
				await delay(1000);
			}

			throw new Error(`Kraken API error: ${errorMessage}`);
		}

		if (!response.result) {
			throw new Error("No result data from Kraken API");
		}

		// Handle the complex response type
		const resultData = response.result as unknown as {
			trades: { [key: string]: Trade };
			count: number;
		};

		return {
			trades: resultData.trades || {},
			count: resultData.count || 0,
		};
	} catch (error) {
		console.error(
			`Error fetching batch (attempt ${retryCount + 1}/${MAX_RETRIES}):`,
			error,
		);

		if (retryCount < MAX_RETRIES) {
			// Progressive delay for retries (exponential backoff)
			const retryDelay = Math.min(1000 * 2 ** retryCount, 10000);
			console.log(`Retrying in ${retryDelay}ms...`);
			await delay(retryDelay);
			return fetchTradesBatch(params, retryCount + 1);
		}

		console.error(`❌ Failed to fetch batch after ${MAX_RETRIES} attempts`);
		return null;
	}
}

/**
 * Display sync progress
 */
function displayProgress(progress: SyncProgress) {
	const elapsed = Date.now() - progress.startTime;
	const rate = progress.totalProcessed / (elapsed / 1000);

	console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SYNC PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Batches Processed: ${progress.batchesProcessed}
📦 Trades Processed: ${progress.totalProcessed}
💾 Trades in Database: ${progress.totalInDatabase}
⏱️  Elapsed Time: ${Math.round(elapsed / 1000)}s
📈 Processing Rate: ${rate.toFixed(2)} trades/sec
${progress.lastTimestamp ? `🕐 Last Trade Time: ${new Date(progress.lastTimestamp * 1000).toISOString()}` : ""}
${progress.errors.length > 0 ? `❌ Errors: ${progress.errors.length}` : "✅ No Errors"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

/**
 * Sync all trades from Kraken API
 */
async function syncFullTradeHistory(): Promise<SyncProgress> {
	console.log("🚀 Starting full trade history sync from Kraken API...");

	// Display rate limiting configuration
	const rateLimitStatus = rateLimiter.getStatus();
	console.log(`
📊 RATE LIMITING CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️  Account Level: ${rateLimitStatus.accountLevel}
🔢 Max Counter: ${rateLimitStatus.maxCounter}
⬇️  Counter Decrease: ${ACCOUNT_LEVEL.decreasePerSecond}/sec
💸 TradesHistory Cost: ${TRADES_HISTORY_COST} per request
🔄 Estimated Max Rate: ${(ACCOUNT_LEVEL.decreasePerSecond / TRADES_HISTORY_COST).toFixed(2)} requests/sec
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
	`);

	// Initialize database
	initializeDatabase();

	const progress: SyncProgress = {
		totalProcessed: 0,
		totalInDatabase: 0,
		batchesProcessed: 0,
		startTime: Date.now(),
		errors: [],
	};

	let offset = 0;
	let hasMoreData = true;
	let totalAvailable = 0;

	try {
		while (hasMoreData) {
			// Prepare request parameters
			const params: GetTradesHistoryRequest = {
				nonce: Date.now(),
				type: "all",
				trades: false,
				consolidate_taker: true,
				ofs: offset,
			};

			// Fetch batch with retry logic
			const batch = await fetchTradesBatch(params);

			if (!batch) {
				progress.errors.push(
					`Failed to fetch batch at offset ${offset} after ${MAX_RETRIES} retries`,
				);
				break;
			}

			const { trades, count } = batch;
			const tradesArray = Object.keys(trades);

			// Update total available count
			if (totalAvailable === 0) {
				totalAvailable = count;
				console.log(`📊 Total trades available from Kraken: ${totalAvailable}`);
			}

			// Check if we have data
			if (tradesArray.length === 0) {
				console.log("✅ No more trades to fetch");
				hasMoreData = false;
				break;
			}

			// Store trades in database
			const insertedCount = upsertTrades(trades);
			progress.totalProcessed += tradesArray.length;
			progress.batchesProcessed++;

			// Track the timestamp of the latest trade in this batch
			const timestamps = Object.values(trades).map((t: Trade) => t.time);
			if (timestamps.length > 0) {
				progress.lastTimestamp = Math.max(...timestamps);
			}

			console.log(
				`✅ Batch ${progress.batchesProcessed}: Processed ${tradesArray.length} trades, inserted/updated ${insertedCount}`,
			);

			// Update offset for next batch
			offset += BATCH_SIZE;

			// Check if we've reached the end
			if (offset >= totalAvailable || tradesArray.length < BATCH_SIZE) {
				hasMoreData = false;
			}

			// Update progress every 5 batches or at the end
			if (progress.batchesProcessed % 5 === 0 || !hasMoreData) {
				// Get current database stats
				const stats = getDatabaseStats();
				progress.totalInDatabase = stats.totalTrades;
				displayProgress(progress);

				// Show rate limiter status
				const rateLimitStatus = rateLimiter.getStatus();
				console.log(
					`📊 Rate Limiter Status: ${rateLimitStatus.counter}/${rateLimitStatus.maxCounter} (${rateLimitStatus.accountLevel})`,
				);
			}

			// Note: Rate limiting is now handled automatically by the rateLimiter in fetchTradesBatch
		}

		// Final database update
		updateTradesCount();
		updateSyncState(Date.now());

		// Final stats
		const finalStats = getDatabaseStats();
		progress.totalInDatabase = finalStats.totalTrades;

		console.log(`
🎉 SYNC COMPLETED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FINAL STATISTICS:
• Total trades processed: ${progress.totalProcessed}
• Total trades in database: ${progress.totalInDatabase}
• Batches processed: ${progress.batchesProcessed}
• Total time: ${Math.round((Date.now() - progress.startTime) / 1000)}s
• Average rate: ${(progress.totalProcessed / ((Date.now() - progress.startTime) / 1000)).toFixed(2)} trades/sec
• Errors encountered: ${progress.errors.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

		if (progress.errors.length > 0) {
			console.log("❌ Errors encountered:");
			progress.errors.forEach((error, index) => {
				console.log(`  ${index + 1}. ${error}`);
			});
		}
	} catch (error) {
		console.error("💥 Fatal error during sync:", error);
		progress.errors.push(
			`Fatal error: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}

	return progress;
}

/**
 * Sync only new trades (incremental sync)
 */
async function syncIncrementalTradeHistory(): Promise<SyncProgress> {
	console.log("🔄 Starting incremental trade history sync...");

	initializeDatabase();

	const syncState = getSyncState();
	const dbStats = getDatabaseStats();

	console.log(`Current database state:
• Total trades: ${dbStats.totalTrades}
• Last sync: ${syncState ? new Date(syncState.lastSyncTimestamp).toISOString() : "Never"}
• Newest trade: ${dbStats.newestTradeTime ? new Date(dbStats.newestTradeTime * 1000).toISOString() : "None"}
  `);

	const progress: SyncProgress = {
		totalProcessed: 0,
		totalInDatabase: dbStats.totalTrades,
		batchesProcessed: 0,
		startTime: Date.now(),
		errors: [],
	};

	try {
		// Use the newest trade timestamp as the starting point
		const startTimestamp = dbStats.newestTradeTime || 0;

		const params: GetTradesHistoryRequest = {
			nonce: Date.now(),
			type: "all",
			trades: false,
			consolidate_taker: true,
			start: startTimestamp,
		};

		console.log(
			`Fetching trades newer than ${new Date(startTimestamp * 1000).toISOString()}...`,
		);

		const batch = await fetchTradesBatch(params);

		if (!batch) {
			progress.errors.push("Failed to fetch incremental trades");
			return progress;
		}

		const { trades } = batch;
		const tradesArray = Object.keys(trades);

		if (tradesArray.length === 0) {
			console.log("✅ No new trades found");
		} else {
			const insertedCount = upsertTrades(trades);
			progress.totalProcessed = tradesArray.length;
			progress.batchesProcessed = 1;

			console.log(
				`✅ Processed ${tradesArray.length} new trades, inserted/updated ${insertedCount}`,
			);

			updateTradesCount();
			updateSyncState(Date.now());

			const finalStats = getDatabaseStats();
			progress.totalInDatabase = finalStats.totalTrades;
		}

		console.log("✅ Incremental sync completed successfully!");
	} catch (error) {
		console.error("💥 Error during incremental sync:", error);
		progress.errors.push(
			`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}

	return progress;
}

/**
 * Main function - handles command line arguments
 */
async function main() {
	const args = process.argv.slice(2);
	const command = args[0] || "full";

	console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 KRAKEN TRADE HISTORY SYNC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Started at: ${new Date().toISOString()}
Mode: ${command}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

	let progress: SyncProgress;

	switch (command) {
		case "full":
			progress = await syncFullTradeHistory();
			break;
		case "incremental":
		case "inc":
			progress = await syncIncrementalTradeHistory();
			break;
		default:
			console.log(`
Usage: bun run src/scripts/kraken-sync.ts [command]

Commands:
  full          Sync all trade history (default)
  incremental   Sync only new trades since last sync
  inc           Alias for incremental

Examples:
  bun run src/scripts/kraken-sync.ts
  bun run src/scripts/kraken-sync.ts full
  bun run src/scripts/kraken-sync.ts incremental
      `);
			process.exit(1);
	}

	// Exit with appropriate code
	const hasErrors = progress.errors.length > 0;
	console.log(
		`\n🏁 Script completed ${hasErrors ? "with errors" : "successfully"}!`,
	);
	process.exit(hasErrors ? 1 : 0);
}

// Run the script
if (import.meta.main) {
	main().catch((error) => {
		console.error("💥 Unhandled error:", error);
		process.exit(1);
	});
}

export { syncFullTradeHistory, syncIncrementalTradeHistory };
