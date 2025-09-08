import * as Calendar from "#/apps/frontend/components/common/Calendar";
import { DetailsDrawer } from "#/apps/frontend/components/common/DetailsDrawer";
import { formatCurrency } from "#/apps/frontend/components/performance/liabilities/LiabilityTable/LiabilityTableUtilities";
import type { Trade } from "#/packages/kraken";

export interface TradeCalendarDrawerProps<T> {
	open: boolean;
	onClose: () => void;
	selected: { id: string; trade: T } | null;
	selectedDate: Date | null;
	handleTradeSelect: (trade: T) => void;
	tradeDays: Map<string, Calendar.DayData>;
}

export function TradeCalendarDrawer({
	open,
	onClose,
	selected,
	selectedDate,
	handleTradeSelect,
	tradeDays,
}: TradeCalendarDrawerProps<Trade>) {
	if (!open || !selected) return null;
	const { id, trade } = selected;
	const hasSelectedDate =
		selectedDate && tradeDays.has(selectedDate.toDateString());
	if (!hasSelectedDate) return null;

	const dayData = tradeDays.get(selectedDate.toDateString());
	if (!dayData) return null;

	return (
		<DetailsDrawer<Trade>
			open={open}
			onClose={onClose}
			title={`Trading Activity ${selectedDate.toLocaleDateString()}`}
		>
			<Calendar.DayDetails
				selectedDate={selectedDate}
				dayData={dayData}
				onTradeSelect={handleTradeSelect}
				formatCurrency={formatCurrency}
			/>
		</DetailsDrawer>
	);
}
