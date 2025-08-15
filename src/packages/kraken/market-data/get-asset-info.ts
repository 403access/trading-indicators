/**
 * Title: Get Asset Info
 * Description: Get information about the assets that are available for deposit, withdrawal, trading and earn.
 * Documentation: https://docs.kraken.com/api/docs/rest-api/get-asset-info
 */
import {
	buildUrl,
	type KrakenResponse as Response,
} from "#/packages/kraken/api";

/**
 * Request
 */
export interface AssetInfoRequest {
	/**
	 * Comma delimited list of assets to get info on (optional, default all available assets)
	 *
	 * Example: XBT,ETH
	 */
	asset: string;

	/**
	 * Asset class (optional, default: currency)
	 *
	 * Example: currency
	 */
	aclass: string;
}

export interface AssetInfo {
	/**
	 * Asset Class
	 */
	aclass: string;

	/**
	 * Alternate name
	 */
	altname: string;

	/**
	 * decimals: integer
	 *
	 * Number of decimal places for record keeping amounts of this asset
	 */
	decimals: number;

	/**
	 * display_decimals: integer
	 *
	 * Number of decimal places shown for display purposes in frontends
	 */
	display_decimals: number;

	/**
	 * Valuation as margin collateral (if applicable)
	 */
	collateral_value: number;

	/**
	 * Status of asset. Possible values: enabled, deposit_only, withdrawal_only, funding_temporarily_disabled.
	 */
	status: string;
}

export type AssetInfoResponse = Response<AssetInfo>;

export const ASSET_INFO_URL = "https://api.kraken.com/0/public/Assets";

export const getAssetInfo = async (params?: AssetInfoRequest) => {
	const url = buildUrl(ASSET_INFO_URL, params);
	console.log("Fetching asset info from:", url);
	const response = await fetch(url);

	const responseContent = await response.json();
	return responseContent as AssetInfoResponse;
};
