/**
 * Performance API Handlers
 *
 * Handles all performance-related API endpoints
 */

import {
	type ApiHandler,
	createSuccessResponse,
	withErrorHandling,
} from "#/packages/api/utils";
import {
	getPerformanceData,
	getPerformanceServiceInfo,
} from "#/packages/performance-service";

/**
 * GET /api/performance
 * Retrieve complete performance data
 */
const getPerformanceHandler = withErrorHandling(
	async (_req: Request): Promise<Response> => {
		// Note: Authentication temporarily disabled for frontend access
		// TODO: Implement proper frontend authentication or session-based auth
		// const authError = requireAuth(ENV.API_KEY, ENV.API_PRIVATE_KEY);
		// if (authError) return authError;

		// Get performance data
		const performanceData = await getPerformanceData();

		return createSuccessResponse(performanceData);
	},
);

/**
 * GET /api/performance/info
 * Get information about the performance service
 */
const getPerformanceInfoHandler = withErrorHandling(
	async (_req: Request): Promise<Response> => {
		const info = getPerformanceServiceInfo();
		return createSuccessResponse(info);
	},
);

/**
 * Export all performance API handlers
 */
export const performanceHandlers: Record<string, ApiHandler> = {
	"/api/performance": {
		GET: getPerformanceHandler,
	},
	"/api/performance/info": {
		GET: getPerformanceInfoHandler,
	},
};
