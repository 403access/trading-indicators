import { useState } from "react";
import { colors } from "../../styles/colors";
import type {
	ChartMode,
	Liability,
	PerformanceData,
	TimeFrame,
} from "../../types/performance";
import { KPIBar } from "./KPIBar";
import { LiabilityTable } from "./LiabilityTable";
import { PerformanceChart } from "./PerformanceChart";
import { TradeCalendar } from "./TradeCalendar";

// Mock trades data - in a real app, this would come from props or a hook
const mockTrades = [
	{
		time: Math.floor(Date.now() / 1000) - 86400, // yesterday
		pair: "BTCUSD",
		type: "buy",
		cost: "50000.00",
		fee: "25.00",
		vol: "1.0",
		price: "50000.00",
	},
	{
		time: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
		pair: "ETHUSD",
		type: "sell",
		cost: "3000.00",
		fee: "15.00",
		vol: "2.0",
		price: "1500.00",
	},
	{
		time: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
		pair: "ADAUSD",
		type: "buy",
		cost: "1000.00",
		fee: "5.00",
		vol: "1000.0",
		price: "1.00",
	},
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
