/**
 * Environment Variables Management
 *
 * Centralized configuration for both backend and frontend environments.
 * Frontend variables must be prefixed with BUN_PUBLIC_ to be accessible in the browser.
 */

// Helper function to get environment variable with default
export function getEnvVar(key: string, defaultValue: string = ""): string {
	return process.env[key] || defaultValue;
}

// Helper function to get boolean environment variable
export function getEnvBool(
	key: string,
	defaultValue: boolean = false,
): boolean {
	const value = process.env[key];
	if (value === undefined) return defaultValue;
	return value.toLowerCase() === "true";
}

// Helper function to get numeric environment variable
export function getEnvNumber(key: string, defaultValue: number): number {
	const value = process.env[key];
	if (value === undefined) return defaultValue;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? defaultValue : parsed;
}

// Backend Environment Variables
export const ENV = {
	// Server Configuration
	SERVER_HOST: getEnvVar("SERVER_HOST", "localhost"),
	SERVER_PORT: getEnvVar("SERVER_PORT", "3000"),
	NODE_ENV: getEnvVar("NODE_ENV", "development"),

	// Kraken API Configuration
	API_KEY: getEnvVar("API_KEY"),
	API_PRIVATE_KEY: getEnvVar("API_PRIVATE_KEY"),

	// Database Configuration
	DATABASE_PATH: getEnvVar("DATABASE_PATH", "./data/trades.db"),

	// Development flags
	DEVELOPMENT: getEnvVar("NODE_ENV") !== "production",

	// Numeric configurations (examples for future use)
	REQUEST_TIMEOUT: getEnvNumber("REQUEST_TIMEOUT", 10000),
	MAX_RETRIES: getEnvNumber("MAX_RETRIES", 3),
} as const;

// Frontend Environment Variables (must be prefixed with BUN_PUBLIC_)
export const PUBLIC_ENV = {
	// App Configuration
	APP_NAME: getEnvVar("BUN_PUBLIC_APP_NAME", "Trading Indicators"),
	APP_VERSION: getEnvVar("BUN_PUBLIC_APP_VERSION", "1.0.0"),

	// Feature flags
	ENABLE_DEBUG: getEnvBool("BUN_PUBLIC_ENABLE_DEBUG"),
	ENABLE_ANALYTICS: getEnvBool("BUN_PUBLIC_ENABLE_ANALYTICS"),
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
	const requiredKeys = ["API_KEY", "API_PRIVATE_KEY"] as const;
	const missing = requiredKeys.filter((key) => !getEnvVar(key));

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}`,
		);
	}
}

/**
 * Helper to check if an environment variable is set
 */
export function hasEnvVar(key: string): boolean {
	return !!process.env[key];
}

/**
 * Get environment info for debugging
 */
export function getEnvInfo() {
	return {
		nodeEnv: ENV.NODE_ENV,
		isDevelopment: ENV.DEVELOPMENT,
		server: {
			host: ENV.SERVER_HOST,
			port: ENV.SERVER_PORT,
		},
		hasApiCredentials: !!(ENV.API_KEY && ENV.API_PRIVATE_KEY),
		databasePath: ENV.DATABASE_PATH,
	};
}

/**
 * Type-safe environment variable access
 */
export type EnvKey = keyof typeof ENV;
export type PublicEnvKey = keyof typeof PUBLIC_ENV;

export function getEnv<T extends EnvKey>(key: T): (typeof ENV)[T] {
	return ENV[key];
}

export function getPublicEnv<T extends PublicEnvKey>(
	key: T,
): (typeof PUBLIC_ENV)[T] {
	return PUBLIC_ENV[key];
}
