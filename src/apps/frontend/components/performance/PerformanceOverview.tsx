import { usePerformanceOverview } from "../../hooks/usePerformanceOverview";
import { colors } from "../../styles/colors";
import type { PerformanceData } from "../../types/performance";
import { LiabilityDetails } from "./LiabilityDetails";
import { PerformanceContent } from "./PerformanceContent";
import { PerformanceHeader } from "./PerformanceHeader";

interface PerformanceOverviewProps {
	data: PerformanceData;
}

export function PerformanceOverview({ data }: PerformanceOverviewProps) {
	const {
		timeFrame,
		chartMode,
		selectedLiability,
		setTimeFrame,
		setChartMode,
		handleLiabilityClick,
		clearSelectedLiability,
	} = usePerformanceOverview();

	return (
		<div className="min-h-screen p-6" style={{ background: colors.bg }}>
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<PerformanceHeader
					timeFrame={timeFrame}
					onTimeFrameChange={setTimeFrame}
				/>

				{/* Main Content */}
				<PerformanceContent
					data={data}
					timeFrame={timeFrame}
					chartMode={chartMode}
					onChartModeChange={setChartMode}
					onLiabilityClick={handleLiabilityClick}
				/>

				{/* Selected Liability Details */}
				{selectedLiability && (
					<LiabilityDetails
						liability={selectedLiability}
						onClose={clearSelectedLiability}
					/>
				)}
			</div>
		</div>
	);
}
