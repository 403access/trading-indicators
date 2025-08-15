import { getAssetInfo } from "#/packages/kraken";

const assetInfoResponse = await getAssetInfo();

if (assetInfoResponse.error.length === 0) {
	const assetInfo = assetInfoResponse.result;
	console.log("Asset info:", JSON.stringify(assetInfo));
} else {
	console.error("Error fetching asset info:", assetInfoResponse.error);
}
