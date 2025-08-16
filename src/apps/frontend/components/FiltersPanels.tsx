import { useEffect, useState } from "react";
import type { TradeType } from "#/packages/kraken";
import { colors } from "../styles/colors";
import type { Query } from "./QueryType";

export function FiltersPanel({
	query,
	setQuery,
}: {
	query: Query;
	setQuery: React.Dispatch<React.SetStateAction<Query>>;
}) {
	const [pair, setPair] = useState(query.pair);
	const [start, setStart] = useState<string>("");
	const [end, setEnd] = useState<string>("");

	useEffect(() => setPair(query.pair), [query.pair]);

	return (
		<div>
			<h3 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>
				Filters
			</h3>
			<div className="space-y-3">
				<label className="block">
					<span className="text-xs" style={{ color: colors.textMuted }}>
						Trade Type
					</span>
					<select
						className="mt-1 w-full rounded-lg px-3 py-2 bg-transparent border"
						style={{ borderColor: colors.line }}
						value={query.type}
						onChange={(e) =>
							setQuery((q) => ({
								...q,
								type: e.target.value as TradeType,
								ofs: 0,
							}))
						}
					>
						{(
							[
								"all",
								"any position",
								"closed position",
								"closing position",
								"no position",
							] as TradeType[]
						).map((t) => (
							<option key={t} value={t} style={{ background: colors.panel }}>
								{t}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="text-xs" style={{ color: colors.textMuted }}>
						Order Side
					</span>
					<select
						className="mt-1 w-full rounded-lg px-3 py-2 bg-transparent border"
						style={{ borderColor: colors.line }}
						value={query.orderType}
						onChange={(e) =>
							setQuery((q) => ({
								...q,
								orderType: e.target.value as any,
								ofs: 0,
							}))
						}
					>
						{(["all", "buy", "sell"] as const).map((t) => (
							<option key={t} value={t} style={{ background: colors.panel }}>
								{t}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="text-xs" style={{ color: colors.textMuted }}>
						Pair
					</span>
					<input
						value={pair}
						onChange={(e) => setPair(e.target.value)}
						onBlur={() => setQuery((q) => ({ ...q, pair, ofs: 0 }))}
						placeholder="e.g. XXBTZUSD"
						className="mt-1 w-full rounded-lg px-3 py-2 bg-transparent border outline-none"
						style={{ borderColor: colors.line }}
					/>
				</label>

				<div className="grid grid-cols-2 gap-3">
					<label className="block">
						<span className="text-xs" style={{ color: colors.textMuted }}>
							Start (UTC)
						</span>
						<input
							type="datetime-local"
							className="mt-1 w-full rounded-lg px-3 py-2 bg-transparent border"
							style={{ borderColor: colors.line }}
							value={start}
							onChange={(e) => setStart(e.target.value)}
							onBlur={() =>
								setQuery((q) => ({
									...q,
									start: start
										? Math.floor(new Date(start).getTime() / 1000)
										: undefined,
									ofs: 0,
								}))
							}
						/>
					</label>
					<label className="block">
						<span className="text-xs" style={{ color: colors.textMuted }}>
							End (UTC)
						</span>
						<input
							type="datetime-local"
							className="mt-1 w-full rounded-lg px-3 py-2 bg-transparent border"
							style={{ borderColor: colors.line }}
							value={end}
							onChange={(e) => setEnd(e.target.value)}
							onBlur={() =>
								setQuery((q) => ({
									...q,
									end: end
										? Math.floor(new Date(end).getTime() / 1000)
										: undefined,
									ofs: 0,
								}))
							}
						/>
					</label>
				</div>

				<div className="flex items-center justify-between gap-2">
					<label
						className="flex items-center gap-2 text-sm"
						style={{ color: colors.text }}
					>
						<input
							type="checkbox"
							className="accent-[#007acc]"
							checked={query.consolidate_taker}
							onChange={(e) =>
								setQuery((q) => ({
									...q,
									consolidate_taker: e.target.checked,
									ofs: 0,
								}))
							}
						/>
						Consolidate taker trades
					</label>
					<label
						className="flex items-center gap-2 text-sm"
						style={{ color: colors.text }}
					>
						<input
							type="checkbox"
							className="accent-[#007acc]"
							checked={query.ledgers}
							onChange={(e) =>
								setQuery((q) => ({ ...q, ledgers: e.target.checked, ofs: 0 }))
							}
						/>
						Include ledgers
					</label>
				</div>
			</div>
		</div>
	);
}
