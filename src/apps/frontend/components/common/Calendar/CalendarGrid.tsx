import { colors } from "#/apps/frontend/styles/colors";
import type { DayData } from "./CalendarDay";
import { CalendarDay } from "./CalendarDay";

interface CalendarGridProps {
	days: Date[];
	currentDate: Date;
	selectedDate: Date | null;
	tradeDays: Map<string, DayData>;
	onDateClick: (date: Date) => void;
	onKeyDown: (event: React.KeyboardEvent, date: Date) => void;
	formatCurrency: (amount: number) => string;
}

export function CalendarGrid({
	days,
	currentDate,
	selectedDate,
	tradeDays,
	onDateClick,
	onKeyDown,
	formatCurrency,
}: CalendarGridProps) {
	return (
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

				return (
					<CalendarDay
						key={dateKey}
						date={date}
						dayData={dayData}
						isCurrentMonth={isCurrentMonth}
						isToday={isToday}
						isSelected={isSelected}
						onDateClick={onDateClick}
						onKeyDown={onKeyDown}
						formatCurrency={formatCurrency}
					/>
				);
			})}
		</div>
	);
}
