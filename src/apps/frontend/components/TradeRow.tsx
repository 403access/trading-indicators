import { fmt } from "#/apps/frontend/lib/utils";
import { colors } from "#/apps/frontend/styles/colors";
import type { Trade } from "#/packages/kraken";
import { Badge } from "./Badge";

export function TradeRow({
	row,
	onSelect,
}: {
	row: { id: string; trade: Trade };
	onSelect: (row: { id: string; trade: Trade }) => void;
}) {
	const { trade } = row;
	const pnl = trade.net ?? 0;
	return (
		<tr
			className="hover:brightness-110 cursor-pointer"
			onClick={() => onSelect(row)}
			style={{ borderBottom: `1px solid ${colors.line}` }}
		>
			<td className="px-3 py-2 whitespace-nowrap">{fmt.date(trade.time)}</td>
			<td className="px-3 py-2 whitespace-nowrap">
				<span
					className="px-2 py-0.5 rounded"
					style={{ background: colors.line }}
				>
					{trade.pair}
				</span>
			</td>
			<td className="px-3 py-2 whitespace-nowrap">
				<Badge tone={trade.type === "buy" ? "blue" : "yellow"}>
					{trade.type}
				</Badge>
			</td>
			<td
				className="px-3 py-2 whitespace-nowrap"
				style={{ color: colors.textMuted }}
			>
				{trade.ordertype}
			</td>
			<td className="px-3 py-2 whitespace-nowrap">{fmt.money(trade.price)}</td>
			<td className="px-3 py-2 whitespace-nowrap">{fmt.base(trade.vol)}</td>
			<td className="px-3 py-2 whitespace-nowrap">{fmt.money(trade.cost)}</td>
			<td
				className="px-3 py-2 whitespace-nowrap"
				style={{ color: colors.yellow }}
			>
				{fmt.money(trade.fee)}
			</td>
			<td className="px-3 py-2 whitespace-nowrap">
				<Badge tone={trade.maker ? "green" : "cyan"}>
					{trade.maker ? "maker" : "taker"}
				</Badge>
			</td>
			<td
				className="px-3 py-2 whitespace-nowrap"
				style={{ color: pnl >= 0 ? colors.green : colors.red }}
			>
				{fmt.money(pnl)}
			</td>
		</tr>
	);
}
