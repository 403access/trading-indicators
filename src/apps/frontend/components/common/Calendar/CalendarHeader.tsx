import { colors } from "#/apps/frontend/styles/colors";

interface CalendarHeaderProps {
	currentDate: Date;
	onNavigateMonth: (direction: "prev" | "next") => void;
}

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

export function CalendarHeader({
	currentDate,
	onNavigateMonth,
}: CalendarHeaderProps) {
	return (
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
					onClick={() => onNavigateMonth("prev")}
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
				<h3 className="text-xl font-semibold" style={{ color: colors.text }}>
					{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
				</h3>
				<button
					type="button"
					onClick={() => onNavigateMonth("next")}
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
	);
}
