import { colors } from "#/apps/frontend/styles/colors";
import type { Trade } from "#/packages/kraken";

export interface DayData {
	trades: Trade[];
	tradeCount: number;
	totalPnL: number;
	spotTrades: number;
	marginTrades: number;
	assets: Set<string>;
}

interface CalendarDayProps {
	date: Date;
	dayData?: DayData;
	isCurrentMonth: boolean;
	isToday: boolean;
	isSelected: boolean;
	onDateClick: (date: Date) => void;
	onKeyDown: (event: React.KeyboardEvent, date: Date) => void;
	formatCurrency: (amount: number) => string;
}

export function CalendarDay({
	date,
	dayData,
	isCurrentMonth,
	isToday,
	isSelected,
	onDateClick,
	onKeyDown,
	formatCurrency,
}: CalendarDayProps) {
	const dateKey = date.toDateString();

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
			onClick={() => onDateClick(date)}
			onKeyDown={(e) => onKeyDown(e, date)}
			style={getButtonStyle()}
			onMouseEnter={(e) => {
				if (!isSelected) {
					e.currentTarget.style.backgroundColor = colors.sidebar;
				}
			}}
			onMouseLeave={(e) => {
				const style = getButtonStyle();
				e.currentTarget.style.backgroundColor = style.backgroundColor;
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
								color: dayData.totalPnL >= 0 ? colors.green : colors.red,
							}}
						>
							{formatCurrency(dayData.totalPnL)}
						</div>
						<div style={{ fontSize: "12px", color: colors.textMuted }}>
							{Array.from(dayData.assets).slice(0, 2).join(", ")}
							{dayData.assets.size > 2 && "..."}
						</div>
					</div>
				)}
			</div>
		</button>
	);
}
