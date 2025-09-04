import { colors } from "#/apps/frontend/styles/colors";

export interface DetailsDrawerHeaderProps {
	title: string;
	onClose: () => void;
}

export function DetailsDrawerHeader({
	title,
	onClose,
}: DetailsDrawerHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<h3 className="text-lg font-semibold">{title}</h3>
			<button
				type="button"
				className="text-sm"
				style={{ color: colors.textMuted }}
				onClick={onClose}
			>
				✕ Close
			</button>
		</div>
	);
}

export interface DetailsDrawerProps<T> {
	open: boolean;
	onClose: () => void;
	selected: { id: string; item: T } | null;
	title: string;
}
export function DetailsDrawer<T>({
	open,
	onClose,
	selected,
	children,
	title,
}: React.PropsWithChildren<DetailsDrawerProps<T>>) {
	if (!open || !selected) return null;
	const { id, item } = selected;
	return (
		<div className="fixed inset-0 z-20">
			<div
				className="absolute inset-0"
				style={{ background: "rgba(0,0,0,0.5)" }}
				onClick={onClose}
			/>
			<div
				className="absolute right-0 top-0 h-full w-full sm:w-[520px] p-4 overflow-auto"
				style={{
					background: colors.panel,
					borderLeft: `1px solid ${colors.line}`,
				}}
			>
				<DetailsDrawerHeader title={title} onClose={onClose} />

				{children}

				<section className="mt-6">
					<h4
						className="text-sm font-semibold mb-2"
						style={{ color: colors.text }}
					>
						Raw JSON
					</h4>
					<pre
						className="text-xs p-3 rounded-lg overflow-auto"
						style={{
							background: colors.sidebar,
							border: `1px solid ${colors.line}`,
						}}
					>
						{JSON.stringify(item, null, 2)}
					</pre>
				</section>
			</div>
		</div>
	);
}
