import { colors } from "#/apps/frontend/styles/colors";

export function KpiCard({
	label,
	value,
	accent,
}: {
	label: string;
	value: React.ReactNode;
	accent?: "blue" | "green" | "red" | "yellow";
}) {
	const borderColor = accent ? (colors as any)[accent] : colors.line;
	return (
		<div
			className="rounded-xl p-4"
			style={{ background: colors.panel, border: `1px solid ${borderColor}` }}
		>
			<div className="text-xs" style={{ color: colors.textMuted }}>
				{label}
			</div>
			<div
				className="mt-1 text-xl font-semibold"
				style={{ color: colors.text }}
			>
				{value}
			</div>
		</div>
	);
}
