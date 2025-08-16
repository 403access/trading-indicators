import { colors } from "#/apps/frontend/styles/colors";

export function Badge({
	children,
	tone = "blue",
}: {
	children: React.ReactNode;
	tone?: "blue" | "green" | "red" | "yellow" | "cyan";
}) {
	const bg = (colors as any)[tone] || colors.blue;
	return (
		<span
			className="px-2 py-0.5 rounded text-xs"
			style={{ background: bg, color: "#000" }}
		>
			{children}
		</span>
	);
}
