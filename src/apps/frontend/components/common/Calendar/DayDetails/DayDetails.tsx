import type { DayData } from "#/apps/frontend/components/common/Calendar/CalendarDay";
import { colors } from "#/apps/frontend/styles/colors";
import type { Trade } from "#/packages/kraken";
import { DayDetailsAssetsTraded } from "./DayDetailsAssetsTraded";
import { DayDetailsIndividualTrades } from "./DayDetailsIndividualTrades";
import { DayDetailsTotalPnL } from "./DayDetailsTotalPnL";
import { DayDetailsTotalTrades } from "./DayDetailsTotalTrades";

interface DayDetailsProps {
	selectedDate: Date;
	dayData: DayData;
	onTradeSelect: (trade: Trade) => void;
	formatCurrency: (amount: number) => string;
}

export function DayDetails({
	selectedDate,
	dayData,
	onTradeSelect,
	formatCurrency,
}: DayDetailsProps) {
	return (
		<div
			style={{
				marginTop: "24px",
				padding: "16px",
				borderRadius: "8px",
				background: colors.sidebar,
			}}
		>
			{/* 
			<h4
				style={{
					fontSize: "18px",
					fontWeight: "600",
					marginBottom: "12px",
					color: colors.text,
				}}
			>
				Trading Activity - {selectedDate.toLocaleDateString()}
			</h4>
			 */}

			{/* KPI Cards */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
					gap: "16px",
					marginBottom: "16px",
				}}
			>
				<DayDetailsTotalTrades dayData={dayData} />

				<DayDetailsTotalPnL dayData={dayData} formatCurrency={formatCurrency} />

				<DayDetailsAssetsTraded dayData={dayData} />
			</div>

			<DayDetailsIndividualTrades
				dayData={dayData}
				onTradeSelect={onTradeSelect}
				formatCurrency={formatCurrency}
			/>
		</div>
	);
}
