import { useState } from "react";
import { LiabilityTable } from "#/apps/frontend/components/performance/liabilities/LiabilityTable";
import { PerformanceChart } from "#/apps/frontend/components/performance/PerformanceChart";
import { TradeCalendar } from "#/apps/frontend/components/performance/TradeCalendar";
import { colors } from "#/apps/frontend/styles/colors";
import type {
	ChartMode,
	Liability,
	PerformanceData,
	TimeFrame,
} from "#/apps/frontend/types/performance";
import { mockTrades } from "#/data/trades";
import { KPIBar } from "../KPIBar";

interface PerformanceContentProps {
	data: PerformanceData;
	timeFrame: TimeFrame;
	chartMode: ChartMode;
	onChartModeChange: (mode: ChartMode) => void;
	onLiabilityClick: (liability: Liability) => void;
	onRequestAddLiability: () => void;
}

export function PerformanceContent({
	data,
	timeFrame,
	chartMode,
	onChartModeChange,
	onLiabilityClick,
	onRequestAddLiability,
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
			{activeTab === "performance" && (
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
						onRequestAddLiability={onRequestAddLiability}
					/>
				</div>
			)}

			{activeTab === "calendar" && <TradeCalendar trades={mockTrades} />}
		</div>
	);
}
