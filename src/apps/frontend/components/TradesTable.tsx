import { colors } from "#/apps/frontend/styles/colors";
import type { Trade } from "#/packages/kraken";
import { SkeletonRows } from "./SkeletonRows";
import { TradeRow } from "./TradeRow";

export function TradesTable({
	items,
	loading,
	onSelect,
}: {
	items: { id: string; trade: Trade }[];
	loading: boolean;
	onSelect: (row: { id: string; trade: Trade }) => void;
}) {
	return (
		<div className="w-full overflow-auto">
			<table className="w-full text-sm">
				<thead style={{ background: colors.sidebar }}>
					<tr>
						{[
							"Time",
							"Pair",
							"Side",
							"Type",
							"Price (quote)",
							"Vol (base)",
							"Cost (quote)",
							"Fee",
							"Maker",
							"P&L",
						].map((h) => (
							<th
								key={h}
								className="text-left px-3 py-2 whitespace-nowrap font-medium"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<SkeletonRows />
					) : items.length === 0 ? (
						<tr>
							<td
								colSpan={10}
								className="px-3 py-6 text-center"
								style={{ color: colors.textMuted }}
							>
								No trades found for current filters.
							</td>
						</tr>
					) : (
						items.map((row) => (
							<TradeRow key={row.id} row={row} onSelect={onSelect} />
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
