/**
 * Title: Get Server Time
 * Description: Get the server's time.
 * Documentation: https://docs.kraken.com/api/docs/rest-api/get-server-time
 */
import type { KrakenResponse as Response } from "#/packages/kraken/api";

export interface ServerTime {
	/**
	 * unixtime: integer
	 *
	 * Unix timestamp
	 *
	 * Example: 1755206180
	 */
	unixtime: number;

	/**
	 * RFC 1123 time format
	 *
	 * Example: "Thu, 14 Aug 25 21:16:20 +0000"
	 */
	rfc1123: string;
}

export type GetServerTimeResponse = Response<ServerTime>;

export const GET_SERVER_TIME_URL = "https://api.kraken.com/0/public/Time";

export const getServerTime = async () => {
	const response = await fetch(GET_SERVER_TIME_URL);

	const responseContent = await response.json();
	return responseContent as GetServerTimeResponse;
};
