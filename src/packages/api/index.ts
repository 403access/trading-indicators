/**
 * API Handlers Index
 *
 * Exports all API handlers for easy import
 */

import { performanceHandlers } from "./handlers/performance";
import { tradesHandlers } from "./handlers/trades";
import { usersHandlers } from "./handlers/users";
import type { ApiHandler } from "./utils";

// Combine all handlers
export const apiHandlers: Record<string, ApiHandler> = {
	...tradesHandlers,
	...usersHandlers,
	...performanceHandlers,
};

export * from "./handlers/performance";
export * from "./handlers/trades";
export * from "./handlers/users";
// Re-export utilities
export * from "./utils";
