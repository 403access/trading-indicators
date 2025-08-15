// import { Database } from "bun:sqlite";

// const db = new Database("mydb.sqlite", { create: true });

import { getOHLCData } from "@/packages/kraken";

const ohlcDataResponse = await getOHLCData({
	pair: "XBTUSD",
	interval: 60,
	since: 1597424146,
});

if (ohlcDataResponse.error.length === 0) {
	const ohlcData = ohlcDataResponse.result;
	console.log("OHLCC data info:", JSON.stringify(ohlcData));
} else {
	console.error("Error fetching OHLCC data:", ohlcDataResponse.error);
}
