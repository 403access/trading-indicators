import { colors } from "#/apps/frontend/styles/colors";
import type { DayData } from "../CalendarDay";

export interface DayDetailsTotalTradesProps {
	dayData: DayData;
}

export function DayDetailsTotalTrades({ dayData }: DayDetailsTotalTradesProps) {
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
				Total Trades
			</div>
			<div
				style={{
					fontSize: "20px",
					fontWeight: "bold",
					color: colors.text,
				}}
			>
				{dayData.tradeCount}
			</div>
			<div
				style={{
					fontSize: "12px",
					marginTop: "4px",
					color: colors.textMuted,
				}}
			>
				Spot: {dayData.spotTrades} | Margin: {dayData.marginTrades}
			</div>
		</div>
	);
}
