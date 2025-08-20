import { serve } from "bun";
import { tlsOptions as tls } from "#/apps/backend/ssl/ssl-files";
import homepage from "#/apps/frontend/index.html";
import {
	fullResyncTrades,
	getTradesServiceInfo,
	getTradesWithSync,
	syncTradesFromAPI,
} from "#/packages/trades-service";

const server = serve({
	routes: {
		// ** HTML imports **
		// Bundle & route index.html to "/". This uses HTMLRewriter to scan the HTML for `<script>` and `<link>` tags, run's Bun's JavaScript & CSS bundler on them, transpiles any TypeScript, JSX, and TSX, downlevels CSS with Bun's CSS parser and serves the result.
		"/": homepage,

		// ** API endpoints ** (Bun v1.2.3+ required)
		"/api/users": {
			async GET(_req) {
				return Response.json({ users: [] });
			},
		},
		"/api/trades": {
			async GET(req) {
				const apiKey = process.env.API_KEY;
				const apiPrivateKey = process.env.API_PRIVATE_KEY;

				if (!apiKey || !apiPrivateKey) {
					return new Response("Unauthorized", { status: 401 });
				}

				try {
					// Parse query parameters for filtering
					const url = new URL(req.url);
					const offset = Number(url.searchParams.get("offset")) || 0;
					const limit = Number(url.searchParams.get("limit")) || 50;
					const pair = url.searchParams.get("pair") || undefined;
					const type = url.searchParams.get("type") || undefined;
					const forceRefresh = url.searchParams.get("refresh") === "true";

					// Get trades from database with API sync
					const trades = await getTradesWithSync({
						offset,
						limit,
						pair,
						type,
						forceRefresh,
					});

					return Response.json({
						error: [],
						result: trades,
					});
				} catch (error) {
					console.error("Error in /api/trades:", error);
					return Response.json(
						{
							error: [error instanceof Error ? error.message : "Unknown error"],
							result: null,
						},
						{ status: 500 },
					);
				}
			},
		},
		"/api/trades/sync": {
			async POST(_req) {
				const apiKey = process.env.API_KEY;
				const apiPrivateKey = process.env.API_PRIVATE_KEY;

				if (!apiKey || !apiPrivateKey) {
					return new Response("Unauthorized", { status: 401 });
				}

				try {
					const result = await syncTradesFromAPI();
					return Response.json({
						error: [],
						result,
					});
				} catch (error) {
					console.error("Error in /api/trades/sync:", error);
					return Response.json(
						{
							error: [error instanceof Error ? error.message : "Unknown error"],
							result: null,
						},
						{ status: 500 },
					);
				}
			},
		},
		"/api/trades/info": {
			async GET(_req) {
				try {
					const info = getTradesServiceInfo();
					return Response.json({
						error: [],
						result: info,
					});
				} catch (error) {
					console.error("Error in /api/trades/info:", error);
					return Response.json(
						{
							error: [error instanceof Error ? error.message : "Unknown error"],
							result: null,
						},
						{ status: 500 },
					);
				}
			},
		},
		"/api/trades/resync": {
			async POST(_req) {
				const apiKey = process.env.API_KEY;
				const apiPrivateKey = process.env.API_PRIVATE_KEY;

				if (!apiKey || !apiPrivateKey) {
					return new Response("Unauthorized", { status: 401 });
				}

				try {
					const result = await fullResyncTrades();
					return Response.json({
						error: [],
						result,
					});
				} catch (error) {
					console.error("Error in /api/trades/resync:", error);
					return Response.json(
						{
							error: [error instanceof Error ? error.message : "Unknown error"],
							result: null,
						},
						{ status: 500 },
					);
				}
			},
		},
	},

	tls,

	// Enable development mode for:
	// - Detailed error messages
	// - Hot reloading (Bun v1.2.3+ required)
	development: true,

	// Prior to v1.2.3, the `fetch` option was used to handle all API requests. It is now optional.
	async fetch(_req) {
		// Return 404 for unmatched routes
		return new Response("Not Found", { status: 404 });
	},
});

console.log(`Listening on ${server.url}`);
