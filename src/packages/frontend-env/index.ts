/**
 * Frontend Environment Configuration
 *
 * Client-side environment variables and configuration.
 * Only variables prefixed with BUN_PUBLIC_ are available in the browser.
 */

// Re-export public environment variables for frontend use
export const PUBLIC_ENV = {
	// App Configuration
	APP_NAME: process.env.BUN_PUBLIC_APP_NAME || "Trading Indicators",
	APP_VERSION: process.env.BUN_PUBLIC_APP_VERSION || "1.0.0",

	// Feature flags
	ENABLE_DEBUG: process.env.BUN_PUBLIC_ENABLE_DEBUG === "true",
	ENABLE_ANALYTICS: process.env.BUN_PUBLIC_ENABLE_ANALYTICS === "true",
} as const;

/**
 * API Client Configuration
 */
export const API_CONFIG = {
	endpoints: {
		trades: "/api/trades",
		tradesSync: "/api/trades/sync",
		tradesInfo: "/api/trades/info",
		tradesResync: "/api/trades/resync",
		users: "/api/users",
	},
} as const;

/**
 * Create a full API URL
 */
export function createApiUrl(
	endpoint: string,
	params?: URLSearchParams,
): string {
	const url = new URL(endpoint, "/");
	if (params) {
		url.search = params.toString();
	}
	return url.toString();
}

/**
 * Get app configuration for frontend
 */
export function getAppConfig() {
	return {
		name: PUBLIC_ENV.APP_NAME,
		version: PUBLIC_ENV.APP_VERSION,
		debug: PUBLIC_ENV.ENABLE_DEBUG,
		analytics: PUBLIC_ENV.ENABLE_ANALYTICS,
		api: API_CONFIG,
	};
}

/**
 * Type-safe public environment variable access
 */
export type PublicEnvKey = keyof typeof PUBLIC_ENV;

export function getPublicEnv<T extends PublicEnvKey>(
	key: T,
): (typeof PUBLIC_ENV)[T] {
	return PUBLIC_ENV[key];
}
