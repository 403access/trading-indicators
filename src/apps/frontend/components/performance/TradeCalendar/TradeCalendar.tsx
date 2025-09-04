import { useState } from "react";
import * as Calendar from "#/apps/frontend/components/common/Calendar";
import { colors } from "#/apps/frontend/styles/colors";
import type { Trade } from "#/packages/kraken";
import { useTradeCalendarData } from "../useTradeCalendarData";
import { TradeCalendarDrawer } from "./TradeCalendarDrawer";

export interface TradeCalendarProps {
	trades: Trade[];
}

export function TradeCalendar({ trades }: TradeCalendarProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selectedTrade, setSelectedTrade] = useState<{
		id: string;
		trade: Trade;
	} | null>(null);

	const { groupTradesByDate, getCalendarDays, formatCurrency } =
		useTradeCalendarData();
	const tradeDays = groupTradesByDate(trades);
	const days = getCalendarDays(currentDate);

	const navigateMonth = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);
		if (direction === "prev") {
			newDate.setMonth(newDate.getMonth() - 1);
		} else {
			newDate.setMonth(newDate.getMonth() + 1);
		}
		setCurrentDate(newDate);
	};

	const handleDateClick = (date: Date) => {
		setSelectedDate(date);

		// Get trades for this day and open sidebar with first trade if any trades exist
		const dateKey = date.toDateString();
		const dayData = tradeDays.get(dateKey);

		if (dayData && dayData.trades.length > 0) {
			// Create a trade object with id for the DetailsDrawer
			const firstTrade = dayData.trades[0];
			if (firstTrade) {
				const tradeWithId = {
					id: `${firstTrade.time}_${firstTrade.pair}`, // Create a unique ID
					trade: firstTrade,
				};
				setSelectedTrade(tradeWithId);
				setSidebarOpen(true);
			}
		}
	};

	const handleTradeSelect = (trade: Trade) => {
		// Create a trade object with id for the DetailsDrawer
		const tradeWithId = {
			id: `${trade.time}_${trade.pair}`,
			trade: trade,
		};
		setSelectedTrade(tradeWithId);
		setSidebarOpen(true);
	};

	const closeSidebar = () => {
		setSidebarOpen(false);
		setSelectedTrade(null);
	};

	const handleKeyDown = (event: React.KeyboardEvent, date: Date) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleDateClick(date);
		}
	};

	return (
		<div
			style={{
				background: colors.panel,
				border: `1px solid ${colors.line}`,
				borderRadius: "12px",
				overflow: "hidden",
				color: colors.text,
			}}
		>
			<div style={{ padding: "24px", background: "transparent" }}>
				<div style={{ marginBottom: "24px" }}>
					<Calendar.CalendarHeader
						currentDate={currentDate}
						onNavigateMonth={navigateMonth}
					/>

					<Calendar.CalendarGrid
						days={days}
						currentDate={currentDate}
						selectedDate={selectedDate}
						tradeDays={tradeDays}
						onDateClick={handleDateClick}
						onKeyDown={handleKeyDown}
						formatCurrency={formatCurrency}
					/>
				</div>

				<Calendar.CalendarLegend />

				<TradeCalendarDrawer
					tradeDays={tradeDays}
					handleTradeSelect={handleTradeSelect}
					selectedDate={selectedDate}
					open={sidebarOpen}
					onClose={closeSidebar}
					selected={selectedTrade}
				/>
			</div>
		</div>
	);
}
