import { serve } from "bun";
import { tlsOptions as tls } from "#/apps/backend/ssl/ssl-files";
import homepage from "#/apps/frontend/index.html";
import { apiHandlers } from "#/packages/api";
import { ENV, validateEnv } from "#/packages/env";

// Validate environment variables on startup
validateEnv();

const server = serve({
	hostname: ENV.SERVER_HOST,
	port: ENV.SERVER_PORT,
	routes: {
		// ** HTML imports **
		// Bundle & route index.html to "/".
		// This uses HTMLRewriter to scan the HTML for `<script>` and `<link>` tags,
		// run's Bun's JavaScript & CSS bundler on them, transpiles
		// any TypeScript, JSX, and TSX, downlevels CSS with
		// Bun's CSS parser and serves the result.
		"/": homepage,

		// ** API endpoints ** (Bun v1.2.3+ required)
		...apiHandlers,
	},

	tls,

	// Enable development mode for:
	// - Detailed error messages
	// - Hot reloading (Bun v1.2.3+ required)
	development: ENV.DEVELOPMENT,

	// Prior to v1.2.3, the `fetch` option was used to handle all API requests. It is now optional.
	async fetch(_req) {
		// Return 404 for unmatched routes
		return new Response("Not Found", { status: 404 });
	},
});

console.log(`🚀 Server listening on ${server.hostname}:${server.port}`);
console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
console.log(`🔒 TLS: ${tls ? "enabled" : "disabled"}`);
console.log(
	`📊 API endpoints available at http${tls ? "s" : ""}://${server.hostname}:${server.port}/api/`,
);
