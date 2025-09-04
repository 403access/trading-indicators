import type { Trade } from "#/packages/kraken";
import type { DayData } from "../Calendar/CalendarDay";

export function useTradeCalendarData() {
	// Group trades by date
	const groupTradesByDate = (trades: Trade[]): Map<string, DayData> => {
		const grouped = new Map<string, DayData>();

		trades.forEach((trade) => {
			const date = new Date(trade.time * 1000);
			const dateKey = date.toDateString();

			if (!grouped.has(dateKey)) {
				grouped.set(dateKey, {
					trades: [],
					tradeCount: 0,
					totalPnL: 0,
					spotTrades: 0,
					marginTrades: 0,
					assets: new Set(),
				});
			}

			const dayData = grouped.get(dateKey);
			if (dayData) {
				dayData.trades.push(trade);
				dayData.tradeCount++;

				// Calculate PnL using the net field from Kraken trade data
				const pnl = trade.net || 0; // Use net P&L from Kraken if available
				dayData.totalPnL += pnl;

				// Categorize trade types (all Kraken trades are either buy or sell)
				dayData.spotTrades++; // For simplicity, treat all as spot trades

				// Extract asset from pair (e.g., "XXBTZUSD" -> "XBT")
				const asset = trade.pair.replace(
					/USD|EUR|GBP|JPY|CAD|ZUSD|ZEUR|ZGBP/g,
					"",
				);
				dayData.assets.add(asset);
			}
		});

		return grouped;
	};

	// Get calendar grid for current month
	const getCalendarDays = (currentDate: Date) => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();

		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		const endDate = new Date(lastDay);

		// Adjust to start from Sunday
		startDate.setDate(startDate.getDate() - startDate.getDay());

		// Adjust to end on Saturday
		endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

		const days = [];
		const currentDay = new Date(startDate);

		while (currentDay <= endDate) {
			days.push(new Date(currentDay));
			currentDay.setDate(currentDay.getDate() + 1);
		}

		return days;
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	return {
		groupTradesByDate,
		getCalendarDays,
		formatCurrency,
	};
}
