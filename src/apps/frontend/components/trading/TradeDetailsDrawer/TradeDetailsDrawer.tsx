import { DetailsDrawer } from "#/apps/frontend/components/common/DetailsDrawer";
import { Field } from "#/apps/frontend/components/Field";
import { fmt } from "#/apps/frontend/lib/utils";
import { colors } from "#/apps/frontend/styles/colors";
import type { Trade } from "#/packages/kraken";

export interface TradeDetailsDrawerProps<T> {
	open: boolean;
	onClose: () => void;
	selected: { id: string; trade: T } | null;
}

export function TradeDetailsDrawer({
	open,
	onClose,
	selected,
}: TradeDetailsDrawerProps<Trade>) {
	if (!open || !selected) return null;
	const { id, trade } = selected;

	const title = `Trade #${id}`;

	return (
		<DetailsDrawer<Trade> open={open} onClose={onClose} title={title}>
			<div className="mt-4 grid grid-cols-2 gap-3">
				<Field label="Time" value={fmt.date(trade.time)} />
				<Field label="Pair" value={trade.pair} />
				<Field label="Side" value={trade.type} />
				<Field label="Order Type" value={trade.ordertype} />
				<Field label="Price (quote)" value={fmt.money(trade.price)} />
				<Field label="Volume (base)" value={fmt.base(trade.vol)} />
				<Field label="Cost (quote)" value={fmt.money(trade.cost)} />
				<Field label="Fee (quote)" value={fmt.money(trade.fee)} />
				<Field label="Maker/Taker" value={trade.maker ? "maker" : "taker"} />
				{trade.poststatus ? (
					<Field label="Position" value={trade.poststatus} />
				) : null}
				{typeof trade.net === "number" ? (
					<Field
						label="Net P&L (quote)"
						value={fmt.money(trade.net)}
						tone={trade.net >= 0 ? "green" : "red"}
					/>
				) : null}
			</div>

			{trade.ledgers?.length ? (
				<section className="mt-4">
					<h4
						className="text-sm font-semibold mb-2"
						style={{ color: colors.text }}
					>
						Ledgers
					</h4>
					<div className="flex flex-wrap gap-2">
						{trade.ledgers.map((l) => (
							<span
								key={l}
								className="px-2 py-1 rounded"
								style={{ background: colors.line }}
							>
								{l}
							</span>
						))}
					</div>
				</section>
			) : null}

			{trade.trades?.length ? (
				<section className="mt-4">
					<h4
						className="text-sm font-semibold mb-2"
						style={{ color: colors.text }}
					>
						Closing trades
					</h4>
					<div className="flex flex-wrap gap-2">
						{trade.trades.map((t) => (
							<span
								key={t}
								className="px-2 py-1 rounded"
								style={{ background: colors.line }}
							>
								{t}
							</span>
						))}
					</div>
				</section>
			) : null}
		</DetailsDrawer>
	);
}
