import { useState } from "react";
import { LiabilityTable } from "#/apps/frontend/components/performance/liabilities/LiabilityTable";
import { TradeCalendar } from "#/apps/frontend/components/performance/TradeCalendar";
import type { Trade } from "#/packages/kraken";
import { colors } from "../../../styles/colors";
import type {
	ChartMode,
	Liability,
	PerformanceData,
	TimeFrame,
} from "../../../types/performance";
import { KPIBar } from "../KPIBar";
import { PerformanceChart } from "../PerformanceChart";

// Mock trades data - in a real app, this would come from props or a hook
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
		Math.floor(Date.now() / 1000) - 86400, // yesterday
		"BTCUSD",
		"buy",
		"50000.00",
		"25.00",
		"1.0",
		"50000.00",
	),
	createMockTrade(
		Math.floor(Date.now() / 1000) - 172800, // 2 days ago
		"ETHUSD",
		"sell",
		"3000.00",
		"15.00",
		"2.0",
		"1500.00",
	),
	createMockTrade(
		Math.floor(Date.now() / 1000) - 259200, // 3 days ago
		"ADAUSD",
		"buy",
		"1000.00",
		"5.00",
		"1000.0",
		"1.00",
	),
];

interface PerformanceContentProps {
	data: PerformanceData;
	timeFrame: TimeFrame;
	chartMode: ChartMode;
	onChartModeChange: (mode: ChartMode) => void;
	onLiabilityClick: (liability: Liability) => void;
}

export function PerformanceContent({
	data,
	timeFrame,
	chartMode,
	onChartModeChange,
	onLiabilityClick,
}: PerformanceContentProps) {
	const [activeTab, setActiveTab] = useState<"performance" | "calendar">(
		"performance",
	);

	return (
		<div className="space-y-6">
			{/* Tab Navigation */}
			<div style={{ borderBottom: `1px solid ${colors.line}` }}>
				<nav className="-mb-px flex space-x-8">
					<button
						type="button"
						onClick={() => setActiveTab("performance")}
						className="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
						style={{
							borderBottomColor:
								activeTab === "performance" ? colors.blue : "transparent",
							color:
								activeTab === "performance" ? colors.blue : colors.textMuted,
						}}
						onMouseEnter={(e) => {
							if (activeTab !== "performance") {
								e.currentTarget.style.color = colors.text;
							}
						}}
						onMouseLeave={(e) => {
							if (activeTab !== "performance") {
								e.currentTarget.style.color = colors.textMuted;
							}
						}}
					>
						Performance Overview
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("calendar")}
						className="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
						style={{
							borderBottomColor:
								activeTab === "calendar" ? colors.blue : "transparent",
							color: activeTab === "calendar" ? colors.blue : colors.textMuted,
						}}
						onMouseEnter={(e) => {
							if (activeTab !== "calendar") {
								e.currentTarget.style.color = colors.text;
							}
						}}
						onMouseLeave={(e) => {
							if (activeTab !== "calendar") {
								e.currentTarget.style.color = colors.textMuted;
							}
						}}
					>
						Trading Calendar
					</button>
				</nav>
			</div>

			{/* Tab Content */}
			{activeTab === "performance" ? (
				<div className="space-y-6">
					{/* KPI Bar */}
					<KPIBar kpis={data.kpis} />

					{/* Performance Chart */}
					<PerformanceChart
						balances={data.balances}
						mode={chartMode}
						timeFrame={timeFrame}
						onModeChange={onChartModeChange}
					/>

					{/* Liability Table */}
					<LiabilityTable
						liabilities={data.liabilities}
						onLiabilityClick={onLiabilityClick}
					/>
				</div>
			) : (
				<TradeCalendar trades={mockTrades} />
			)}
		</div>
	);
}
