import { colors } from "../../styles/colors";
import type { TimeFrame } from "../../types/performance";
import { TimeFrameFilter } from "./TimeFrameFilter";

interface PerformanceHeaderProps {
	timeFrame: TimeFrame;
	onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export function PerformanceHeader({
	timeFrame,
	onTimeFrameChange,
}: PerformanceHeaderProps) {
	return (
		<div className="flex justify-between items-center">
			<div>
				<h1 className="text-3xl font-bold" style={{ color: colors.text }}>
					Performance Overview
				</h1>
				<p className="mt-1" style={{ color: colors.textMuted }}>
					Kapital, Zinsen und Verbindlichkeiten im Überblick
				</p>
			</div>
			<TimeFrameFilter selected={timeFrame} onChange={onTimeFrameChange} />
		</div>
	);
}
