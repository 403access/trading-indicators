import { useState } from "react";
import type { ChartMode, Liability, TimeFrame } from "../types/performance";

interface UsePerformanceOverviewState {
	timeFrame: TimeFrame;
	chartMode: ChartMode;
	selectedLiability: Liability | null;
	setTimeFrame: (timeFrame: TimeFrame) => void;
	setChartMode: (mode: ChartMode) => void;
	handleLiabilityClick: (liability: Liability) => void;
	clearSelectedLiability: () => void;
}

export function usePerformanceOverview(): UsePerformanceOverviewState {
	const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
	const [chartMode, setChartMode] = useState<ChartMode>("equity");
	const [selectedLiability, setSelectedLiability] = useState<Liability | null>(
		null,
	);

	const handleLiabilityClick = (liability: Liability) => {
		setSelectedLiability(liability);
		// TODO: Show detailed view/modal
	};

	const clearSelectedLiability = () => {
		setSelectedLiability(null);
	};

	return {
		timeFrame,
		chartMode,
		selectedLiability,
		setTimeFrame,
		setChartMode,
		handleLiabilityClick,
		clearSelectedLiability,
	};
}
