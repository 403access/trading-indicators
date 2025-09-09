import type { Liability } from "#/apps/frontend/types/performance";
import {
	type ApiHandler,
	createSuccessResponse,
	withErrorHandling,
} from "#/packages/api/utils";
import { upsertLiability, upsertLiabilityWithoutId } from "#/packages/database";

/**
 * POST /api/liabilities
 * Add a new liability
 */
const postLiabilityHandler = withErrorHandling(
	async (req: Request): Promise<Response> => {
		const body = await req.json();
		// Basic validation
		// const requiredFields: (keyof Liability)[] = [
		// 	// "id",
		// 	"name",
		// 	"type",
		// 	"amount",
		// 	"apr",
		// 	"installmentEur",
		// 	"termMonths",
		// 	"startDate",
		// 	"currentPrincipalEur",
		// ];
		// for (const field of requiredFields) {
		// 	if (
		// 		body[field] === undefined ||
		// 		body[field] === null ||
		// 		body[field] === ""
		// 	) {
		// 		return new Response(
		// 			JSON.stringify({ error: `Missing required field: ${field}` }),
		// 			{ status: 400, headers: { "Content-Type": "application/json" } },
		// 		);
		// 	}
		// }
		// Persist to DB
		upsertLiabilityWithoutId(body as Liability);
		return createSuccessResponse({ added: body });
	},
);

/**
 * Export all liabilities API handlers
 */
export const liabilitiesHandlers: Record<string, ApiHandler> = {
	"/api/liabilities": {
		POST: postLiabilityHandler,
	},
};
