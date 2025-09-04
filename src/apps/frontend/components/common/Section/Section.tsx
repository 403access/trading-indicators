import { colors } from "#/apps/frontend/styles/colors";

export interface SectionProps {
	title: string;
}

export function Section({
	title,
	children,
}: React.PropsWithChildren<SectionProps>) {
	return (
		<div
			className="rounded-xl overflow-hidden"
			style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
		>
			<div
				className="px-6 py-4"
				style={{ borderBottom: `1px solid ${colors.line}` }}
			>
				<h2 className="text-xl font-semibold" style={{ color: colors.text }}>
					{title}
				</h2>
			</div>

			<div className="overflow-x-auto">{children}</div>
		</div>
	);
}
