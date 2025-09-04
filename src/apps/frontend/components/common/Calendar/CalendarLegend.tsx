import { colors } from "#/apps/frontend/styles/colors";

export function CalendarLegend() {
	return (
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
	);
}
