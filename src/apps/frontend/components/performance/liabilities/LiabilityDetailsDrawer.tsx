import { DetailsDrawer } from "#/apps/frontend/components/common/DetailsDrawer";
import type { Liability } from "#/apps/frontend/types/performance";
import { LiabilityDetails } from "./LiabilityDetails";

export interface LiabilityDetailsDrawerProps<T> {
	open: boolean;
	onClose: () => void;
	selected: { id: string; liability: T } | null;
}
export function LiabilityDetailsDrawer({
	open,
	onClose,
	selected,
}: LiabilityDetailsDrawerProps<Liability>) {
	if (!open || !selected) return null;
	const { id, liability } = selected;

	return (
		<DetailsDrawer<Liability>
			open={open}
			onClose={onClose}
			selected={{ ...selected, item: liability }}
			title={`Details: ${liability.name}`}
		>
			<LiabilityDetails liability={liability} onClose={onClose} />
		</DetailsDrawer>
	);
}
