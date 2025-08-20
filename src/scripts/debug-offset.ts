/**
 * Debug script to test fetching from specific offset
 */

import {
	type GetTradesHistoryRequest,
	getTradesHistory,
	type Trade,
} from "#/packages/kraken";

async function testSpecificOffset() {
	console.log("🔍 Testing fetch from offset 600...");

	try {
		const params: GetTradesHistoryRequest = {
			nonce: Date.now(),
			type: "all",
			trades: false,
			consolidate_taker: true,
			ofs: 600,
		};

		console.log("Request params:", params);

		const response = await getTradesHistory(params);

		if (response.error && response.error.length > 0) {
			console.error("❌ Kraken API error:", response.error);
			return;
		}

		if (!response.result) {
			console.error("❌ No result data");
			return;
		}

		const resultData = response.result as unknown as {
			trades: { [key: string]: Trade };
			count: number;
		};
		const trades = resultData.trades || {};
		const count = resultData.count || 0;

		console.log(`✅ Response received:
• Total available: ${count}
• Trades in this batch: ${Object.keys(trades).length}
• Trade IDs: ${Object.keys(trades).slice(0, 5).join(", ")}${Object.keys(trades).length > 5 ? "..." : ""}
    `);

		if (Object.keys(trades).length > 0) {
			console.log("✅ Successfully fetched trades from offset 600!");
		} else {
			console.log("⚠️  No trades returned from offset 600");
		}
	} catch (error) {
		console.error("💥 Error testing offset 600:", error);
	}
}

testSpecificOffset();
