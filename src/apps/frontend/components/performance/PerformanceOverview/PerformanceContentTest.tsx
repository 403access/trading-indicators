import type { Trade } from "#/packages/kraken";
import { TradeCalendar } from "../TradeCalendar/TradeCalendar";

// Simple test component
export function PerformanceContentTest() {
	const createMockTrade = (
		time: number,
		pair: string,
		type: "buy" | "sell",
		cost: string,
		fee: string,
		vol: string,
		price: string,
	): Trade => ({
		ordertxid: `mock-order-${time}`,
		postxid: `mock-post-${time}`,
		pair,
		time,
		type,
		ordertype: "market",
		price,
		cost,
		fee,
		vol,
		margin: "0.0",
		leverage: "1.0",
		misc: "",
		ledgers: [],
		trade_id: time,
		maker: false,
		poststatus: "closed",
		cprice: parseFloat(price),
		ccost: parseFloat(cost),
		cfee: parseFloat(fee),
		cvol: parseFloat(vol),
		cmargin: 0,
		net: (parseFloat(cost) - parseFloat(fee)) * (type === "sell" ? 1 : -1),
		trades: [],
	});

	const mockTrades: Trade[] = [
		createMockTrade(
			Math.floor(Date.now() / 1000) - 86400,
			"BTCUSD",
			"buy",
			"50000.00",
			"25.00",
			"1.0",
			"50000.00",
		),
	];

	return (
		<div>
			<h1>Test Component</h1>
			<TradeCalendar trades={mockTrades} />
		</div>
	);
}
