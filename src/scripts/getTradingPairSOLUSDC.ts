import { getTradableAssetPairs } from "@/packages/kraken";

const tradableAssetPairsResponse = await getTradableAssetPairs({
	pair: "SOLUSDC",
});
if (tradableAssetPairsResponse.error.length === 0) {
	const tradableAssetPairs = tradableAssetPairsResponse.result;
	console.log("Tradable asset pairs:", JSON.stringify(tradableAssetPairs));
} else {
	console.error(
		"Error fetching tradable asset pairs:",
		tradableAssetPairsResponse.error,
	);
}
