/**
 * Frontend API Client
 *
 * Provides a typed interface for making API requests from the frontend
 */

import type { PerformanceData } from "#/apps/frontend/types/performance";
import type { TradeHistory } from "#/packages/kraken";

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	timestamp: number;
}

/**
 * API client configuration
 */
const API_CONFIG = {
	baseUrl: "", // Use relative URLs for same-origin requests
	headers: {
		"Content-Type": "application/json",
	},
};

/**
 * Generic API request function
 */
async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> {
	try {
		const url = `${API_CONFIG.baseUrl}${endpoint}`;
		const response = await fetch(url, {
			...options,
			headers: {
				...API_CONFIG.headers,
				...options.headers,
			},
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.error || `HTTP ${response.status}: ${response.statusText}`,
				timestamp: Date.now(),
			};
		}

		// Handle Kraken-style API responses: {error: [], result: T}
		if (
			typeof data === "object" &&
			data !== null &&
			"error" in data &&
			"result" in data
		) {
			if (Array.isArray(data.error) && data.error.length > 0) {
				return {
					success: false,
					error: data.error.join(", "),
					timestamp: Date.now(),
				};
			}

			return {
				success: true,
				data: data.result,
				timestamp: Date.now(),
			};
		}

		// Handle direct data responses
		return {
			success: true,
			data,
			timestamp: Date.now(),
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			timestamp: Date.now(),
		};
	}
}

/**
 * Trades API client
 */
export const tradesApi = {
	/**
	 * Get trades with optional filtering
	 */
	list: async (
		params: {
			limit?: number;
			offset?: number;
			pair?: string;
			type?: string;
			refresh?: boolean;
		} = {},
	): Promise<ApiResponse<TradeHistory>> => {
		const searchParams = new URLSearchParams();

		if (params.limit) searchParams.set("limit", params.limit.toString());
		if (params.offset) searchParams.set("offset", params.offset.toString());
		if (params.pair) searchParams.set("pair", params.pair);
		if (params.type) searchParams.set("type", params.type);
		if (params.refresh) searchParams.set("refresh", "true");

		const endpoint = `/api/trades${searchParams.toString() ? `?${searchParams}` : ""}`;
		return apiRequest<TradeHistory>(endpoint);
	},

	/**
	 * Trigger incremental sync
	 */
	sync: async (): Promise<
		ApiResponse<{ newTrades: number; totalTrades: number }>
	> => {
		return apiRequest("/api/trades/sync", { method: "POST" });
	},

	/**
	 * Get trades service information
	 */
	info: async (): Promise<ApiResponse<unknown>> => {
		return apiRequest("/api/trades/info");
	},

	/**
	 * Trigger full resync
	 */
	resync: async (): Promise<
		ApiResponse<{ success: boolean; totalTrades: number }>
	> => {
		return apiRequest("/api/trades/resync", { method: "POST" });
	},
};

/**
 * Performance API client
 */
export const performanceApi = {
	/**
	 * Get complete performance data
	 */
	getData: async (): Promise<ApiResponse<PerformanceData>> => {
		return apiRequest<PerformanceData>("/api/performance");
	},

	/**
	 * Get performance service information
	 */
	info: async (): Promise<ApiResponse<unknown>> => {
		return apiRequest("/api/performance/info");
	},
};

/**
 * Main API client object
 */
export const apiClient = {
	trades: tradesApi,
	performance: performanceApi,

	// Generic methods for custom requests
	get: <T>(endpoint: string): Promise<ApiResponse<T>> => {
		return apiRequest<T>(endpoint);
	},

	post: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
		return apiRequest<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	put: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
		return apiRequest<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	delete: <T>(endpoint: string): Promise<ApiResponse<T>> => {
		return apiRequest<T>(endpoint, { method: "DELETE" });
	},
};

/**
 * Helper function to handle API responses
 */
export function handleApiResponse<T>(response: ApiResponse<T>): T {
	if (!response.success) {
		throw new Error(response.error || "API request failed");
	}

	if (!response.data) {
		throw new Error("No data received from API");
	}

	return response.data;
}

/**
 * Default export
 */
export default apiClient;
