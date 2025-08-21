import type {
	ChartMode,
	Liability,
	PerformanceData,
	TimeFrame,
} from "../../types/performance";
import { KPIBar } from "./KPIBar";
import { LiabilityTable } from "./LiabilityTable";
import { PerformanceChart } from "./PerformanceChart";

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
	return (
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
	);
}
