import type { DayData } from "#/apps/frontend/components/common/Calendar/CalendarDay";
import { colors } from "#/apps/frontend/styles/colors";

export type DayDetailsAssetsTradedProps = {
	dayData: DayData;
};

export function DayDetailsAssetsTraded({
	dayData,
}: DayDetailsAssetsTradedProps) {
	return (
		<div
			style={{
				padding: "12px",
				borderRadius: "4px",
				background: colors.panel,
				border: `1px solid ${colors.line}`,
			}}
		>
			<div
				style={{
					fontSize: "14px",
					color: colors.textMuted,
				}}
			>
				Assets Traded
			</div>
			<div
				style={{
					fontSize: "20px",
					fontWeight: "bold",
					color: colors.text,
				}}
			>
				{dayData.assets.size}
			</div>
			<div
				style={{
					fontSize: "12px",
					marginTop: "4px",
					color: colors.textMuted,
				}}
			>
				{Array.from(dayData.assets).join(", ")}
			</div>
		</div>
	);
}
