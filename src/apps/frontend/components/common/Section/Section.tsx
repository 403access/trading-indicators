import { colors } from "#/apps/frontend/styles/colors";

export interface SectionProps {
	title: string;
	onRequestAdd: () => void;
}

export function Section({
	title,
	onRequestAdd,
	children,
}: React.PropsWithChildren<SectionProps>) {
	return (
		<div
			className="rounded-xl overflow-hidden"
			style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
		>
			<div
				className="px-6 py-4 flex items-center justify-between"
				style={{ borderBottom: `1px solid ${colors.line}` }}
			>
				<h2 className="text-xl font-semibold" style={{ color: colors.text }}>
					{title}
				</h2>

				<div className="mt-2">
					<button
						type="button"
						onClick={onRequestAdd}
						className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
					>
						Hinzufügen
					</button>
				</div>
			</div>

			<div className="overflow-x-auto">{children}</div>
		</div>
	);
}
