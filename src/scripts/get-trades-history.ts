import { getTradesHistory } from "@/packages/kraken";

const tradesHistoryResponse = await getTradesHistory({
	nonce: Date.now(),
	type: "all",
	trades: false,
	consolidate_taker: true,
});

if (tradesHistoryResponse.error.length === 0) {
	const tradesHistory = tradesHistoryResponse.result;
	console.log("Trades history:", JSON.stringify(tradesHistory));
} else {
	console.error(
		"Error fetching trades history:",
		JSON.stringify(tradesHistoryResponse.error),
	);
}
