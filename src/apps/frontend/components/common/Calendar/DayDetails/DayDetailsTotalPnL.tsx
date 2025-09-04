import { colors } from "#/apps/frontend/styles/colors";
import type { DayData } from "../CalendarDay";

export interface DayDetailsTotalPnLProps {
	dayData: DayData;
	formatCurrency: (amount: number) => string;
}

export function DayDetailsTotalPnL({
	dayData,
	formatCurrency,
}: DayDetailsTotalPnLProps) {
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
				Total PnL
			</div>
			<div
				style={{
					fontSize: "20px",
					fontWeight: "bold",
					color: dayData.totalPnL >= 0 ? colors.green : colors.red,
				}}
			>
				{formatCurrency(dayData.totalPnL)}
			</div>
		</div>
	);
}
