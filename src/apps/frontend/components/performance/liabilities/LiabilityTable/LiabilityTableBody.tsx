import type { Liability } from "#/apps/frontend/types/performance";
import { colors } from "../../../styles/colors";
import * as Utilities from "./LiabilityTableUtilities";

export type LiabilityTableBodyProps = {
	liabilities: Liability[];
	onLiabilityClick: (liability: Liability) => void;
};
export function LiabilityTableBody({
	liabilities,
	onLiabilityClick,
}: LiabilityTableBodyProps) {
	return (
		<tbody style={{ background: colors.panel }}>
			{liabilities.map((liability) => (
				<tr
					key={liability.id}
					onClick={() => onLiabilityClick(liability)}
					className="cursor-pointer transition-colors"
					style={{
						borderBottom: `1px solid ${colors.line}`,
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.background = colors.sidebar;
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.background = colors.panel;
					}}
				>
					<td className="px-6 py-4 whitespace-nowrap">
						<div className="text-sm font-medium" style={{ color: colors.text }}>
							{liability.name}
						</div>
					</td>
					<td className="px-6 py-4 whitespace-nowrap">
						<span
							className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
							style={Utilities.getTypeColor(liability.type)}
						>
							{Utilities.getTypeLabel(liability.type)}
						</span>
					</td>
					<td
						className="px-6 py-4 whitespace-nowrap text-sm"
						style={{ color: colors.text }}
					>
						{Utilities.formatPercent(liability.apr)}
					</td>
					<td
						className="px-6 py-4 whitespace-nowrap text-sm"
						style={{ color: colors.text }}
					>
						{Utilities.formatCurrency(liability.installmentEur)}
					</td>
					<td
						className="px-6 py-4 whitespace-nowrap text-sm font-medium"
						style={{ color: colors.text }}
					>
						{Utilities.formatCurrency(liability.currentPrincipalEur)}
					</td>
					<td
						className="px-6 py-4 whitespace-nowrap text-sm"
						style={{ color: colors.text }}
					>
						{Utilities.formatDate(Utilities.calculateMaturityDate(liability))}
					</td>
					<td
						className="px-6 py-4 whitespace-nowrap text-sm"
						style={{ color: colors.text }}
					>
						{Utilities.formatDate(Utilities.calculateNextPayment(liability))}
					</td>
					<td
						className="px-6 py-4 whitespace-nowrap text-sm"
						style={{ color: colors.text }}
					>
						{Utilities.formatCurrency(
							Utilities.calculateYTDInterest(liability),
						)}
					</td>
				</tr>
			))}
		</tbody>
	);
}
