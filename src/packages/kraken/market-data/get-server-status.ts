/**
 * Title: Get Server Status
 * Description: Get the current system status or trading mode.
 * Documentation: https://docs.kraken.com/api/docs/rest-api/get-system-status
 */
import type { KrakenResponse as Response } from "#/packages/kraken/api";

export interface ServerStatus {
	/**
	 * Current system status:
	 *
	 * `online`: Kraken is operating normally. All order types may be submitted and trades can occur.
	 *
	 * `maintenance`: The exchange is offline. No new orders or cancellations may be submitted.
	 *
	 * `cancel_only`: Resting (open) orders can be cancelled but no new orders may be submitted. No trades will occur.
	 *
	 * `post_only`: Only post-only limit orders can be submitted. Existing orders may still be cancelled. No trades will occur.
	 *
	 * Possible values: [online, maintenance, cancel_only, post_only]
	 */
	status: string;

	/**
	 * Current timestamp (RFC3339)
	 */
	timestamp: string;
}

export type GetServerStatusResponse = Response<ServerStatus>;

export const GET_SERVER_STATUS_URL =
	"https://api.kraken.com/0/public/SystemStatus";

export const getServerStatus = async () => {
	const response = await fetch(GET_SERVER_STATUS_URL);

	const responseContent = await response.json();
	return responseContent as GetServerStatusResponse;
};
