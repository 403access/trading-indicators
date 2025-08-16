import { useMemo } from "react";
import { fmt } from "#/apps/frontend/lib/utils";
import type { Trade } from "#/packages/kraken";
import { KpiCard } from "./KpiCard";

export function SummaryBar({
	items,
}: {
	items: { id: string; trade: Trade }[];
}) {
	const totals = useMemo(() => {
		let buys = 0,
			sells = 0,
			volBase = 0,
			pnl = 0,
			fees = 0,
			cost = 0;
		for (const { trade } of items) {
			if (trade.type === "buy") buys++;
			if (trade.type === "sell") sells++;
			volBase += Number(trade.vol || 0);
			pnl += Number(trade.net || 0);
			fees += Number(trade.fee || 0);
			cost += Number(trade.cost || 0);
		}
		return {
			buys,
			sells,
			trades: items.length,
			volBase,
			pnl,
			fees,
			notional: cost,
		};
	}, [items]);

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
			<KpiCard label="Trades" value={totals.trades.toLocaleString()} />
			<KpiCard
				label="Buys"
				value={totals.buys.toLocaleString()}
				accent="blue"
			/>
			<KpiCard
				label="Sells"
				value={totals.sells.toLocaleString()}
				accent="yellow"
			/>
			<KpiCard label="Base Vol" value={fmt.base(totals.volBase)} />
			<KpiCard
				label="Fees (quote)"
				value={fmt.money(totals.fees)}
				accent="yellow"
			/>
			<KpiCard
				label="Net P&L (quote)"
				value={fmt.money(totals.pnl)}
				accent={totals.pnl >= 0 ? "green" : "red"}
			/>
		</div>
	);
}
