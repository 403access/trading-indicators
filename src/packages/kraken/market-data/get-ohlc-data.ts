/**
 * Title: Get OHLC Data
 * Description: Retrieve OHLC market data. The last entry in the OHLC array is for the current,
 * not-yet-committed timeframe, and will always be present, regardless of the value of since.
 * Returns up to 720 of the most recent entries (older data cannot be retrieved, regardless of
 * the value of since).
 * Documentation: https://docs.kraken.com/api/docs/rest-api/get-ohlc-data
 */
import {
	buildUrl,
	type KrakenResponse as Response,
} from "@/packages/kraken/api";
import type { NoKey } from "@/packages/type-system/keys";
import { Environment } from "../config";

/**
 * Request
 */
export interface GetOHLCDataRequest {
	/**
	 * Asset pair to get data for
	 *
	 * Example: XBTUSD
	 */
	pair: string;

	/**
	 * interval: integer
	 *
	 * Possible values: [1, 5, 15, 30, 60, 240, 1440, 10080, 21600]
	 *
	 * Time frame interval in minutes
	 *
	 * Default value: 1
	 *
	 * Example: 60
	 */
	interval: number;

	/**
	 * Return OHLC entries since the given timestamp (intended for incremental updates)
	 *
	 * Example: 1688671200
	 */
	since: number;
}

/**
 * Single OHLC tick:
 * [ time, open, high, low, close, vwap, volume, count ]
 */
export type OHLCTick = [
	/**
	 * time: integer
	 */
	time: number,
	open: string,
	high: string,
	low: string,
	close: string,
	vwap: string,
	volume: string,
	/**
	 * count: integer
	 */
	count: number,
];

/**
 * Dynamic property name (asset pair), e.g. "XBTUSD"
 * Value is an array of OHLC ticks
 *
 * all keys are OHLCTick[] EXCEPT "last",
 * and "last" is a number.
 */
export type OHLCResult = NoKey<"last", OHLCTick[]> & {
	/**
	 * last: integer
	 *
	 * ID to be used as since when polling for new, committed OHLC data
	 */
	last: number;
};

export type GetOHLCDataResponse = Response<OHLCResult>;

export const GET_OHLC_DATA_PATH = "/0/public/OHLC";

export const getOHLCData = async (params: GetOHLCDataRequest) => {
	const url = buildUrl(GET_OHLC_DATA_PATH, params);
	console.log("Fetching OHLC data from:", url);
	const response = await fetch(url);

	const responseContent = await response.json();
	return responseContent as GetOHLCDataResponse;
};
