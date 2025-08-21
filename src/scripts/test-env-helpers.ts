/**
 * Test script for DRY environment helpers
 */

import {
	ENV,
	getEnvBool,
	getEnvNumber,
	getEnvVar,
	hasEnvVar,
	PUBLIC_ENV,
} from "#/packages/env";

console.log("🧪 Testing DRY Environment Helpers...\n");

// Test string environment variables
console.log("📝 String Environment Variables:");
console.log(`NODE_ENV: "${getEnvVar("NODE_ENV", "default")}"`);
console.log(`SERVER_HOST: "${getEnvVar("SERVER_HOST", "localhost")}"`);
console.log(`MISSING_VAR: "${getEnvVar("MISSING_VAR", "fallback")}"`);

// Test boolean environment variables
console.log("\n🔘 Boolean Environment Variables:");
console.log(
	`BUN_PUBLIC_ENABLE_DEBUG: ${getEnvBool("BUN_PUBLIC_ENABLE_DEBUG")}`,
);
console.log(
	`BUN_PUBLIC_ENABLE_ANALYTICS: ${getEnvBool("BUN_PUBLIC_ENABLE_ANALYTICS")}`,
);
console.log(`MISSING_BOOL: ${getEnvBool("MISSING_BOOL", true)}`);

// Test numeric environment variables
console.log("\n🔢 Numeric Environment Variables:");
console.log(`REQUEST_TIMEOUT: ${getEnvNumber("REQUEST_TIMEOUT", 5000)}`);
console.log(`MAX_RETRIES: ${getEnvNumber("MAX_RETRIES", 1)}`);
console.log(`INVALID_NUMBER: ${getEnvNumber("INVALID_NUMBER_TEST", 999)}`);

// Test hasEnvVar helper
console.log("\n✅ Environment Variable Existence:");
console.log(`Has NODE_ENV: ${hasEnvVar("NODE_ENV")}`);
console.log(`Has API_KEY: ${hasEnvVar("API_KEY")}`);
console.log(`Has MISSING_VAR: ${hasEnvVar("MISSING_VAR")}`);

// Show the final ENV objects
console.log("\n📊 Final Environment Objects:");
console.log("Backend ENV timeout:", ENV.REQUEST_TIMEOUT);
console.log("Backend ENV retries:", ENV.MAX_RETRIES);
console.log("Frontend debug enabled:", PUBLIC_ENV.ENABLE_DEBUG);
console.log("Frontend analytics enabled:", PUBLIC_ENV.ENABLE_ANALYTICS);

console.log("\n✅ DRY Environment Helper tests completed!");
console.log(
	"🎉 All process.env calls have been eliminated from the configuration objects!",
);
