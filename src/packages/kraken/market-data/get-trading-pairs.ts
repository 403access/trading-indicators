/**
 * Title: Get Tradable Asset Pairs
 * Description: Get tradable asset pairs
 * Documentation: https://docs.kraken.com/api/docs/rest-api/get-tradable-asset-pairs/
 */

import {
	buildUrl,
	type KrakenResponse as Response,
} from "#/packages/kraken/api";

/**
 * Request
 */
export interface TradableAssetPairsRequest {
	/**
	 * Asset pairs to get data for
	 *
	 * Example: BTC/USD,ETH/BTC
	 */
	pair: string;
	/**
	 * Possible values: [info, leverage, fees, margin]
	 *
	 * Info to retrieve (optional)
	 * - info = all info
	 * - leverage = leverage info
	 * - fees = fees schedule
	 * - margin = margin info
	 *
	 * Default value: info
	 */
	info?: "info" | "leverage" | "fees" | "margin";
	/**
	 * country_code: ISO 3166-1 alpha-2
	 *
	 * Filter for response to only include pairs available in the provided country/region.
	 *
	 * Example: GB
	 */
	country_code?: string;
}

export interface TradableAssetPair {
	/**
	 * Alternate pair name
	 */
	altname: string;

	/**
	 * WebSocket pair name (if available)
	 */
	wsname: string;

	/**
	 * Asset class of base component
	 */
	aclass_base: string;

	/**
	 * Asset ID of base component
	 */
	base: string;

	/**
	 * Asset class of quote component
	 */
	aclass_quote: string;

	/**
	 * Asset ID of quote component
	 */
	quote: string;

	/**
	 * @deprecated No official comments.
	 *
	 * Volume lot size
	 */
	lot: string;

	/**
	 * pair_decimals: integer;
	 *
	 * Number of decimal places for prices in this pair
	 */
	pair_decimals: number;

	/**
	 * cost_decimals: integer
	 *
	 * Number of decimal places for cost of trades in pair (quote asset terms)
	 */
	cost_decimals: number;

	/**
	 * lot_multiplier: integer
	 *
	 * Number of decimal places for volume (base asset terms)
	 */
	lot_multiplier: number;

	/**
	 * leverage_buy: integer[]
	 *
	 * Array of leverage amounts available when buying
	 */
	leverage_buy: number[];

	/**
	 * leverage_sell: integer[]
	 *
	 * Array of leverage amounts available when selling
	 */
	leverage_sell: number[];

	/**
	 * fees: array[]
	 *
	 * Fee schedule array in [<volume>, <percent fee>] tuples
	 */
	fees: [number, string][];

	/**
	 * fees_maker: array[]
	 *
	 * Maker fee schedule array in [<volume>, <percent fee>] tuples (if on maker/taker)
	 */
	fees_maker: [number, string][];

	/**
	 * Volume discount currency
	 */
	fee_volume_currency: string;

	/**
	 * margin_call: integer
	 *
	 * Margin call level
	 */
	margin_call: number;

	/**
	 * margin_stop: integer
	 *
	 * Stop-out/liquidation margin level
	 */
	margin_stop: number;

	/**
	 * Minimum order size (in terms of base currency)
	 */
	ordermin: string;

	/**
	 * Minimum order cost (in terms of quote currency)
	 */
	costmin: string;

	/**
	 * Minimum increment between valid price levels
	 */
	ticket_size: string;

	/**
	 * status: string
	 *
	 * Status of asset. Possible values: online, cancel_only, post_only, limit_only, reduce_only.
	 */
	status: string;

	/**
	 * long_position_limit: integer
	 *
	 * Maximum long margin position size (in terms of base currency)
	 */
	long_position_limit: number;

	/**
	 * short_position_limit: integer
	 *
	 * Maximum short margin position size (in terms of base currency)
	 */
	short_position_limit: number;
}

export type TradableAssetPairsResponse = Response<TradableAssetPair>;

export const TRADABLE_ASSET_PAIRS_URL =
	"https://api.kraken.com/0/public/AssetPairs";

export const getTradableAssetPairs = async (
	params?: TradableAssetPairsRequest,
) => {
	const url = buildUrl(TRADABLE_ASSET_PAIRS_URL, params);
	console.log("Fetching tradable asset pairs from:", url);
	const response = await fetch(url);

	const responseContent = await response.json();
	return responseContent as TradableAssetPairsResponse;
};
