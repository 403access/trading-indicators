import { useState } from "react";
import { colors } from "#/apps/frontend/styles/colors";
import type {
	Liability,
	PerformanceData,
} from "#/apps/frontend/types/performance";
import { usePerformanceOverview } from "../../../hooks/usePerformanceOverview";
import { LiabilityAddDrawer } from "../liabilities/LiabilityAddDrawer";
import { LiabilityDetailsDrawer } from "../liabilities/LiabilityDetailsDrawer";
import { PerformanceContent } from "./PerformanceContent";
import { PerformanceHeader } from "./PerformanceHeader";

interface PerformanceOverviewProps {
	data: PerformanceData;
}

export function PerformanceOverview({ data }: PerformanceOverviewProps) {
	const [openAddLiability, setOpenAddLiability] = useState(false);

	const {
		timeFrame,
		chartMode,
		selectedLiability,
		setTimeFrame,
		setChartMode,
		handleLiabilityClick,
		clearSelectedLiability,
	} = usePerformanceOverview();

	const onAddLiability = async (liability: Liability) => {
		try {
			const res = await fetch("/api/liabilities", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(liability),
			});
			if (!res.ok) throw new Error("Failed to add liability");
			const data = await res.json();
			console.log("Liability added:", data);
		} catch (err) {
			console.error("Error adding liability:", err);
		} finally {
			setOpenAddLiability(false);
		}
	};

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
					onRequestAddLiability={() => setOpenAddLiability(true)}
				/>
				{/* Drawers */}
				<LiabilityDetailsDrawer
					open={selectedLiability !== null}
					onClose={clearSelectedLiability}
					selected={
						selectedLiability
							? { id: selectedLiability.id, liability: selectedLiability }
							: null
					}
				/>

				{/* Add Liability Drawer */}
				<LiabilityAddDrawer
					open={openAddLiability}
					onClose={() => setOpenAddLiability(false)}
					onAdd={onAddLiability}
				/>
			</div>
		</div>
	);
}
