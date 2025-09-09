import { DetailsDrawer } from "#/apps/frontend/components/common/DetailsDrawer";
import { DebugJSON } from "#/apps/frontend/components/debug/DebugJSON";
import type { Liability } from "#/apps/frontend/types/performance";
import { LiabilityDetails } from "./LiabilityDetails";

export interface LiabilityDetailsDrawerProps<T> {
	open: boolean;
	onClose: () => void;
	selected: { id: string; liability: T } | null;
	onDelete: (id: string) => void;
}
export function LiabilityDetailsDrawer({
	open,
	onClose,
	selected,
	onDelete,
}: LiabilityDetailsDrawerProps<Liability>) {
	if (!open || !selected) return null;
	const { id, liability } = selected;

	return (
		<DetailsDrawer<Liability>
			open={open}
			onClose={onClose}
			title={`Details: ${liability.name}`}
		>
			<LiabilityDetails liability={liability} onClose={onClose} />

			<div className="mt-2">
				<button
					type="button"
					onClick={() => onDelete(id)}
					className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
				>
					Löschen
				</button>
			</div>

			<DebugJSON data={liability} />
		</DetailsDrawer>
	);
}
