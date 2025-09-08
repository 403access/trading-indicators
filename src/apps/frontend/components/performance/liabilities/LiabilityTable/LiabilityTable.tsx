import { Section } from "#/apps/frontend/components/common/Section/Section";
import { colors } from "#/apps/frontend/styles/colors";
import type { Liability } from "#/apps/frontend/types/performance";
import { LiabilityTableBody } from "./LiabilityTableBody";
import { LiabilityTableHeader } from "./LiabilityTableHeader";

export interface LiabilityTableProps {
	liabilities: Liability[];
	onLiabilityClick: (liability: Liability) => void;
	onRequestAddLiability: () => void;
}

export function LiabilityTable({
	liabilities,
	onLiabilityClick,
	onRequestAddLiability,
}: LiabilityTableProps) {
	// TODO: Loading indicator should be moved up in tree to the parent component.
	// Early return if liabilities is undefined or null
	// if (!liabilities || !Array.isArray(liabilities)) {
	// 	return (
	// 		<div
	// 			style={{
	// 				padding: "24px",
	// 				textAlign: "center",
	// 				color: colors.textMuted,
	// 				backgroundColor: colors.panel,
	// 				borderRadius: "8px",
	// 				border: `1px solid ${colors.line}`,
	// 			}}
	// 		>
	// 			Loading liabilities...
	// 		</div>
	// 	);
	// }

	return (
		<Section title="Verbindlichkeiten" onRequestAdd={onRequestAddLiability}>
			<table className="w-full">
				<LiabilityTableHeader />
				<LiabilityTableBody
					liabilities={liabilities}
					onLiabilityClick={onLiabilityClick}
				/>
			</table>

			{liabilities.length === 0 && (
				<div className="text-center py-12" style={{ color: colors.textMuted }}>
					Keine Verbindlichkeiten vorhanden
				</div>
			)}
		</Section>
	);
}
