import { serve } from "bun";
import homepage from "#/apps/frontend/index.html";

const server = serve({
	routes: {
		// ** HTML imports **
		// Bundle & route index.html to "/". This uses HTMLRewriter to scan the HTML for `<script>` and `<link>` tags, run's Bun's JavaScript & CSS bundler on them, transpiles any TypeScript, JSX, and TSX, downlevels CSS with Bun's CSS parser and serves the result.
		"/": homepage,

		// ** API endpoints ** (Bun v1.2.3+ required)
		"/api/users": {
			async GET(req) {
				return Response.json({ users: [] });
			},
		},
	},

	// Enable development mode for:
	// - Detailed error messages
	// - Hot reloading (Bun v1.2.3+ required)
	development: true,

	// Prior to v1.2.3, the `fetch` option was used to handle all API requests. It is now optional.
	async fetch(req) {
		// Return 404 for unmatched routes
		return new Response("Not Found", { status: 404 });
	},
});

console.log(`Listening on ${server.url}`);
