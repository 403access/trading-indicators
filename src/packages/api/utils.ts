/**
 * API Handler Types and Utilities
 *
 * Common types and utilities for API route handlers
 */

export interface ApiResponse<T = unknown> {
	error: string[];
	result: T | null;
}

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
}

/**
 * Create a standardized API success response
 */
export function createSuccessResponse<T>(data: T): Response {
	const response: ApiResponse<T> = {
		error: [],
		result: data,
	};

	return Response.json(response);
}

/**
 * Create a standardized API error response
 */
export function createErrorResponse(
	error: string | Error | ApiError,
	status: number = 500,
): Response {
	let message: string;
	let statusCode = status;

	if (error instanceof Error) {
		message = error.message;
	} else if (typeof error === "object" && "message" in error) {
		message = error.message;
		statusCode = error.status || status;
	} else {
		message = String(error);
	}

	const response: ApiResponse<null> = {
		error: [message],
		result: null,
	};

	return Response.json(response, { status: statusCode });
}

/**
 * Wrap an async handler with error handling
 */
export function withErrorHandling<T extends unknown[]>(
	handler: (...args: T) => Promise<Response>,
) {
	return async (...args: T): Promise<Response> => {
		try {
			return await handler(...args);
		} catch (error) {
			console.error("API Handler Error:", error);
			return createErrorResponse(error as Error);
		}
	};
}

/**
 * Authentication middleware
 */
export function requireAuth(
	apiKey?: string,
	apiPrivateKey?: string,
): Response | null {
	if (!apiKey || !apiPrivateKey) {
		return createErrorResponse("API credentials not configured", 401);
	}
	return null;
}

/**
 * Parse query parameters with type safety
 */
export function parseQueryParams(url: URL) {
	return {
		offset: Number(url.searchParams.get("offset")) || 0,
		limit: Number(url.searchParams.get("limit")) || 50,
		pair: url.searchParams.get("pair") || undefined,
		type: url.searchParams.get("type") || undefined,
		forceRefresh: url.searchParams.get("refresh") === "true",
	};
}

/**
 * Request handler type
 */
export type ApiHandler = {
	GET?: (req: Request) => Promise<Response>;
	POST?: (req: Request) => Promise<Response>;
	PUT?: (req: Request) => Promise<Response>;
	DELETE?: (req: Request) => Promise<Response>;
};
