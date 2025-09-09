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
			<h3 className="text-lg font-semibold" style={{ color: colors.text }}>
				{title}
			</h3>
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
	title: string;
}
export function DetailsDrawer<T>({
	open,
	onClose,
	children,
	title,
}: React.PropsWithChildren<DetailsDrawerProps<T>>) {
	if (!open) return null;
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
			</div>
		</div>
	);
}
