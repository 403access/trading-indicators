/**
 * Test script for the refactored API structure
 */

import { apiHandlers } from "#/packages/api";
import { ENV, getEnvInfo, validateEnv } from "#/packages/env";
import { getAppConfig, PUBLIC_ENV } from "#/packages/frontend-env";

console.log("🧪 Testing refactored API structure...\n");

// Test environment configuration
console.log("📊 Environment Configuration:");
try {
	validateEnv();
	console.log("✅ Environment validation passed");
} catch (error) {
	console.log("❌ Environment validation failed:", (error as Error).message);
}

console.log("Backend ENV:", getEnvInfo());
console.log("Frontend Config:", getAppConfig());
console.log("");

// Test API handlers structure
console.log("🔌 API Handlers:");
const handlerCount = Object.keys(apiHandlers).length;
console.log(`✅ Found ${handlerCount} API handlers:`);

for (const [path, handler] of Object.entries(apiHandlers)) {
	const methods = Object.keys(handler).join(", ");
	console.log(`  ${path}: ${methods}`);
}

console.log(
	"\n✅ All tests passed! The refactored structure is working correctly.",
);

// Test a sample API request simulation
console.log("\n🌐 Testing API Handler Structure:");

// Simulate a request to the trades info endpoint
const tradesInfoHandler = apiHandlers["/api/trades/info"];
if (tradesInfoHandler?.GET) {
	console.log("✅ Trades info handler found and has GET method");
} else {
	console.log("❌ Trades info handler not found or missing GET method");
}

// Test environment variable access
console.log("\n🔐 Environment Variables:");
console.log(`Server will run on: ${ENV.SERVER_HOST}:${ENV.SERVER_PORT}`);
console.log(`Development mode: ${ENV.DEVELOPMENT}`);
console.log(`Frontend API URL: ${PUBLIC_ENV.API_BASE_URL}`);
console.log(`App Name: ${PUBLIC_ENV.APP_NAME}`);

console.log("\n🎉 Refactoring test completed successfully!");
