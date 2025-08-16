/**
 * Title: Get Trades History
 * Description: Retrieve information about trades/fills. 50 results are returned at a time, the most recent by default.
 * - Unless otherwise stated, costs, fees, prices, and volumes are specified with the precision for the asset pair
 *   (pair_decimals and lot_decimals), not the individual assets' precision (decimals).
 * API Key Permissions Required: Orders and trades - Query closed orders & trades
 * Documentation: https://api.kraken.com/0/private/TradesHistory
 */
import {
	buildUrl,
	getKrakenSignature,
	type KrakenResponse as Response,
} from "#/packages/kraken/api";

export type TradeType =
	| "all"
	| "any position"
	| "closed position"
	| "closing position"
	| "no position";

export type OrderType = "buy" | "sell";

export type PositionStatus = "open" | "closed";

/**
 * Request
 */
export interface GetTradesHistoryRequest {
	/**
	 * nonce: integer<int64>
	 *
	 * Nonce used in construction of API-Sign header
	 */
	nonce: number;

	/**
	 * Type of trade
	 *
	 * Possible values: [all, any position, closed position, closing position, no position]
	 *
	 * Default value: all
	 */
	type?: TradeType;

	/**
	 * Whether or not to include trades related to position in output
	 *
	 * Default value: false
	 */
	trades?: boolean;

	/**
	 * start: integer
	 *
	 * Starting unix timestamp or trade tx ID of results (exclusive)
	 */
	start?: number;

	/**
	 * Ending unix timestamp or trade tx ID of results (inclusive)
	 */
	end?: number;

	/**
	 * Result offset for pagination
	 */
	ofs?: number;

	/**
	 * Whether or not to consolidate trades by individual taker trades
	 *
	 * Default value: true
	 */
	consolidate_taker?: boolean;

	/**
	 * Whether or not to include related ledger ids for given trade
	 *
	 * Note that setting this to true will slow request performance
	 *
	 * Default value: false
	 */
	ledgers?: boolean;
}

export interface Trade {
	/**
	 * Order responsible for execution of trade
	 */
	ordertxid: string;

	/**
	 * Position responsible for execution of trade
	 */
	postxid: string;

	/**
	 * Asset pair
	 */
	pair: string;

	/**
	 * time: integer
	 *
	 * Unix timestamp of trade
	 */
	time: number;

	/**
	 * Type of order (buy/sell)
	 */
	type: OrderType;
	/**
	 * Order type
	 */
	ordertype: string;

	/**
	 * Average price order was executed at (quote currency)
	 */
	price: string;

	/**
	 * Total cost of order (quote currency)
	 */
	cost: string;

	/**
	 * Total fee (quote currency)
	 */
	fee: string;

	/**
	 * Volume (base currency)
	 */
	vol: string;

	/**
	 * Initial margin (quote currency)
	 */
	margin: string;

	/**
	 * Amount of leverage used in trade
	 */
	leverage: string;

	/**
	 * Comma delimited list of miscellaneous info:
	 *
	 * `closing`: Trade closes all or part of a position
	 */
	misc: string;

	/**
	 * List of ledger ids for entries associated with trade
	 */
	ledgers: string[];

	/**
	 * trade_id: integer
	 *
	 * Unique identifier of trade executed
	 */
	trade_id: number;
	/**
	 * `true` if trade was executed with user as the maker, `false` if taker
	 */
	maker: boolean;

	/**
	 * Position status (open/closed)
	 *
	 * Only present if trade opened a position
	 */
	poststatus: PositionStatus;

	/**
	 * cprice: integer
	 *
	 * Average price of closed portion of position (quote currency)
	 *
	 * Only present if trade opened a position
	 */
	cprice: number;

	/**
	 * Total cost of closed portion of position (quote currency)
	 *
	 * Only present if trade opened a position
	 */
	ccost: number;

	/**
	 * Total fee of closed portion of position (quote currency)
	 *
	 * Only present if trade opened a position
	 */
	cfee: number;

	/**
	 * TODO: fix this comment, see https://github.com/krakenfx/api-go/issues/30
	 *
	 * Total fee of closed portion of position (quote currency)
	 *
	 * Only present if trade opened a position
	 */
	cvol: number;

	/**
	 * Total margin freed in closed portion of position (quote currency)
	 *
	 * Only present if trade opened a position
	 */
	cmargin: number;

	/**
	 * Net profit/loss of closed portion of position (quote currency, quote currency scale)
	 *
	 * Only present if trade opened a position
	 */
	net: number;

	/**
	 * List of closing trades for position (if available)
	 *
	 * Only present if trade opened a position
	 */
	trades: string[];
}

export interface TradeHistory {
	/**
	 * count: integer
	 *
	 * Amount of available trades matching criteria
	 */
	count: number;

	/**
	 * Trade info
	 */
	trades: { [key: string]: Trade };
}

/**
 * Trade history retrieved.
 */
export type GetTradesHistoryResponse = Response<TradeHistory>;

export const GET_TRADES_HISTORY_URL =
	"https://api.kraken.com/0/private/TradesHistory";

export const getTradesHistory = async (params: GetTradesHistoryRequest) => {
	const relativeUrl = "/0/private/TradesHistory";

	const apiKey = process.env.API_KEY;
	console.log("API Key:", apiKey);
	if (apiKey === undefined) throw new Error("API_KEY is not defined");

	const apiPrivateKey = process.env.API_PRIVATE_KEY;
	console.log("API Private Key:", apiPrivateKey);
	if (apiPrivateKey === undefined)
		throw new Error("API_PRIVATE_KEY is not defined");

	const url = buildUrl(GET_TRADES_HISTORY_URL);
	console.log("URL with query:", url);

	const nonce = Date.now().toString();
	console.log("Nonce:", nonce);

	const body = JSON.stringify(params);
	console.log("Request body:", body);

	const apiSignature = getKrakenSignature(relativeUrl, body, apiPrivateKey);
	console.log("API Signature:", apiSignature);

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"API-Key": apiKey,
			"API-Sign": apiSignature,
		},
		body,
	});

	const responseContent = await response.json();
	return responseContent as GetTradesHistoryResponse;
};
