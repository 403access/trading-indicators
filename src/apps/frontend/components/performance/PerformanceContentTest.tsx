import { TradeCalendar } from "./TradeCalendar";

// Simple test component
export function PerformanceContentTest() {
	const mockTrades = [
		{
			time: Math.floor(Date.now() / 1000) - 86400,
			pair: "BTCUSD",
			type: "buy",
			cost: "50000.00",
			fee: "25.00",
			vol: "1.0",
			price: "50000.00",
		},
	];

	return (
		<div>
			<h1>Test Component</h1>
			<TradeCalendar trades={mockTrades} />
		</div>
	);
}
