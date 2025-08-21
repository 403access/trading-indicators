/**
 * Trades API Handlers
 *
 * Handles all trade-related API endpoints
 */

import { ENV } from "#/packages/env";
import {
	fullResyncTrades,
	getTradesServiceInfo,
	getTradesWithSync,
	syncTradesFromAPI,
} from "#/packages/trades-service";
import {
	type ApiHandler,
	createSuccessResponse,
	parseQueryParams,
	requireAuth,
	withErrorHandling,
} from "../utils";

/**
 * GET /api/trades
 * Retrieve trades with optional filtering and automatic sync
 */
const getTradesHandler = withErrorHandling(
	async (req: Request): Promise<Response> => {
		// Check authentication
		const authError = requireAuth(ENV.API_KEY, ENV.API_PRIVATE_KEY);
		if (authError) return authError;

		// Parse query parameters
		const url = new URL(req.url);
		const params = parseQueryParams(url);

		// Get trades from database with API sync
		const trades = await getTradesWithSync(params);

		return createSuccessResponse(trades);
	},
);

/**
 * POST /api/trades/sync
 * Trigger incremental sync from Kraken API
 */
const syncTradesHandler = withErrorHandling(
	async (_req: Request): Promise<Response> => {
		// Check authentication
		const authError = requireAuth(ENV.API_KEY, ENV.API_PRIVATE_KEY);
		if (authError) return authError;

		// Perform incremental sync
		const result = await syncTradesFromAPI();

		return createSuccessResponse(result);
	},
);

/**
 * GET /api/trades/info
 * Get information about the trades service
 */
const getTradesInfoHandler = withErrorHandling(
	async (_req: Request): Promise<Response> => {
		const info = getTradesServiceInfo();
		return createSuccessResponse(info);
	},
);

/**
 * POST /api/trades/resync
 * Trigger full resync from Kraken API
 */
const resyncTradesHandler = withErrorHandling(
	async (_req: Request): Promise<Response> => {
		// Check authentication
		const authError = requireAuth(ENV.API_KEY, ENV.API_PRIVATE_KEY);
		if (authError) return authError;

		// Perform full resync
		const result = await fullResyncTrades();

		return createSuccessResponse(result);
	},
);

/**
 * Export all trades API handlers
 */
export const tradesHandlers: Record<string, ApiHandler> = {
	"/api/trades": {
		GET: getTradesHandler,
	},
	"/api/trades/sync": {
		POST: syncTradesHandler,
	},
	"/api/trades/info": {
		GET: getTradesInfoHandler,
	},
	"/api/trades/resync": {
		POST: resyncTradesHandler,
	},
};
