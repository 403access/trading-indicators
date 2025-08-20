import { colors } from "../../styles/colors";
import type { TimeFrame } from "../../types/performance";

interface TimeFrameFilterProps {
	selected: TimeFrame;
	onChange: (timeFrame: TimeFrame) => void;
}

export function TimeFrameFilter({ selected, onChange }: TimeFrameFilterProps) {
	const timeFrames: { value: TimeFrame; label: string }[] = [
		{ value: "day", label: "Tag" },
		{ value: "week", label: "Woche" },
		{ value: "month", label: "Monat" },
		{ value: "all", label: "Alle" },
	];

	return (
		<div className="flex gap-2">
			{timeFrames.map(({ value, label }) => (
				<button
					key={value}
					type="button"
					onClick={() => onChange(value)}
					className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
					style={{
						background: selected === value ? colors.blue : colors.panel,
						color: selected === value ? colors.text : colors.textMuted,
						border: `1px solid ${selected === value ? colors.blue : colors.line}`,
					}}
				>
					{label}
				</button>
			))}
		</div>
	);
}
