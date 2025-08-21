import { useState } from "react";
import { colors } from "../../styles/colors";

// Define Trade interface locally since we need to match the expected structure
interface Trade {
	time: number;
	pair: string;
	type: string;
	cost: string;
	fee: string;
	vol: string;
	price: string;
}

interface DayData {
	trades: Trade[];
	tradeCount: number;
	totalPnL: number;
	spotTrades: number;
	marginTrades: number;
	assets: Set<string>;
}

interface TradeCalendarProps {
	trades: Trade[];
}

function TradeCalendar({ trades }: TradeCalendarProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

				// Calculate PnL (simplified - you may need to adjust based on your PnL calculation)
				const pnl = parseFloat(trade.cost) - parseFloat(trade.fee);
				dayData.totalPnL += pnl;

				// Categorize trade types (this may need adjustment based on your trade data structure)
				if (trade.type === "buy" || trade.type === "sell") {
					dayData.spotTrades++;
				} else {
					dayData.marginTrades++;
				}

				// Extract asset from pair (e.g., "BTCUSD" -> "BTC")
				const asset = trade.pair.replace(/USD|EUR|GBP|JPY|CAD/g, "");
				dayData.assets.add(asset);
			}
		});

		return grouped;
	};

	const tradeDays = groupTradesByDate(trades);

	// Get calendar grid for current month
	const getCalendarDays = () => {
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
	};

	const handleKeyDown = (event: React.KeyboardEvent, date: Date) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleDateClick(date);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const days = getCalendarDays();
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

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
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: "16px",
						}}
					>
						<h2
							style={{
								fontSize: "24px",
								fontWeight: "bold",
								margin: 0,
								color: colors.text,
							}}
						>
							Trading Calendar
						</h2>
						<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
							<button
								type="button"
								onClick={() => navigateMonth("prev")}
								style={{
									padding: "8px",
									borderRadius: "4px",
									transition: "background-color 0.2s",
									color: colors.text,
									backgroundColor: "transparent",
									border: "none",
									cursor: "pointer",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = colors.sidebar;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "transparent";
								}}
								aria-label="Previous month"
							>
								<span style={{ fontSize: "18px" }}>←</span>
							</button>
							<h3
								className="text-xl font-semibold"
								style={{ color: colors.text }}
							>
								{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
							</h3>
							<button
								type="button"
								onClick={() => navigateMonth("next")}
								className="p-2 rounded transition-colors"
								style={{
									color: colors.text,
									backgroundColor: "transparent",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = colors.sidebar;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "transparent";
								}}
								aria-label="Next month"
							>
								<span className="text-lg">→</span>
							</button>
						</div>
					</div>

					{/* Calendar Grid */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(7, 1fr)",
							gap: "4px",
							marginBottom: "16px",
						}}
					>
						{/* Day headers */}
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<div
								key={day}
								style={{
									padding: "8px",
									textAlign: "center",
									fontWeight: "600",
									color: colors.textMuted,
								}}
							>
								{day}
							</div>
						))}

						{/* Calendar days */}
						{days.map((date) => {
							const dateKey = date.toDateString();
							const dayData = tradeDays.get(dateKey);
							const isCurrentMonth = date.getMonth() === currentDate.getMonth();
							const isToday = date.toDateString() === new Date().toDateString();
							const isSelected = selectedDate?.toDateString() === dateKey;

							const getButtonStyle = () => {
								const baseStyle = {
									padding: "8px",
									minHeight: "80px",
									border: "1px solid",
									borderRadius: "4px",
									cursor: "pointer",
									transition: "colors 0.2s",
									textAlign: "left" as const,
								};

								if (isSelected) {
									return {
										...baseStyle,
										backgroundColor: colors.blue,
										borderColor: colors.blue,
										color: colors.text,
									};
								}
								if (isToday) {
									return {
										...baseStyle,
										backgroundColor: colors.sidebar,
										borderColor: colors.blue,
										color: colors.text,
										boxShadow: `0 0 0 2px ${colors.blue}`,
									};
								}
								if (!isCurrentMonth) {
									return {
										...baseStyle,
										backgroundColor: colors.bg,
										borderColor: colors.line,
										color: colors.textMuted,
									};
								}
								return {
									...baseStyle,
									backgroundColor: colors.panel,
									borderColor: colors.line,
									color: colors.text,
								};
							};

							return (
								<button
									key={dateKey}
									type="button"
									onClick={() => handleDateClick(date)}
									onKeyDown={(e) => handleKeyDown(e, date)}
									style={getButtonStyle()}
									onMouseEnter={(e) => {
										if (!isSelected) {
											e.currentTarget.style.backgroundColor = colors.sidebar;
										}
									}}
									onMouseLeave={(e) => {
										const style = getButtonStyle();
										e.currentTarget.style.backgroundColor =
											style.backgroundColor;
									}}
									aria-label={`${date.toDateString()}${dayData ? ` - ${dayData.tradeCount} trades` : ""}`}
								>
									<div style={{ textAlign: "left" }}>
										<div style={{ fontWeight: "500", fontSize: "14px" }}>
											{date.getDate()}
										</div>
										{dayData && (
											<div
												style={{
													marginTop: "4px",
													display: "flex",
													flexDirection: "column",
													gap: "4px",
												}}
											>
												<div style={{ fontSize: "12px", color: colors.blue }}>
													{dayData.tradeCount} trades
												</div>
												<div
													style={{
														fontSize: "12px",
														fontWeight: "500",
														color:
															dayData.totalPnL >= 0 ? colors.green : colors.red,
													}}
												>
													{formatCurrency(dayData.totalPnL)}
												</div>
												<div
													style={{ fontSize: "12px", color: colors.textMuted }}
												>
													{Array.from(dayData.assets).slice(0, 2).join(", ")}
													{dayData.assets.size > 2 && "..."}
												</div>
											</div>
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Legend */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "24px",
						fontSize: "14px",
						marginBottom: "16px",
						color: colors.textMuted,
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<div
							style={{
								width: "16px",
								height: "16px",
								border: `1px solid ${colors.blue}`,
								borderRadius: "4px",
								backgroundColor: colors.blue,
							}}
						></div>
						<span>Selected</span>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<div
							style={{
								width: "16px",
								height: "16px",
								border: `2px solid ${colors.blue}`,
								borderRadius: "4px",
								backgroundColor: colors.sidebar,
							}}
						></div>
						<span>Today</span>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<div
							style={{
								width: "16px",
								height: "16px",
								borderRadius: "4px",
								backgroundColor: colors.green,
							}}
						></div>
						<span>Profitable</span>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						<div
							style={{
								width: "16px",
								height: "16px",
								borderRadius: "4px",
								backgroundColor: colors.red,
							}}
						></div>
						<span>Loss</span>
					</div>
				</div>

				{/* Selected Day Details */}
				{selectedDate && tradeDays.has(selectedDate.toDateString()) && (
					<div
						style={{
							marginTop: "24px",
							padding: "16px",
							borderRadius: "8px",
							background: colors.sidebar,
						}}
					>
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
						{(() => {
							const dayData = tradeDays.get(selectedDate.toDateString());
							if (!dayData) return null;

							return (
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
										gap: "16px",
									}}
								>
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
											Spot: {dayData.spotTrades} | Margin:{" "}
											{dayData.marginTrades}
										</div>
									</div>
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
												color:
													dayData.totalPnL >= 0 ? colors.green : colors.red,
											}}
										>
											{formatCurrency(dayData.totalPnL)}
										</div>
									</div>
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
								</div>
							);
						})()}
					</div>
				)}
			</div>
		</div>
	);
}

// Export both named and default export to handle different import styles
export { TradeCalendar };
export default TradeCalendar;
