import { useEffect, useMemo, useState } from "react";
import type {
	GetTradesHistoryRequest,
	Trade,
	TradeHistory,
} from "#/packages/kraken";
import { colors } from "../styles/colors";
import { DetailsDrawer } from "./DetailsDrawer";
import { FiltersPanel } from "./FiltersPanels";
import { Header } from "./Header";
import { JSONInspector } from "./JSONInspector";
import { Overlay } from "./Overlay";
import { SummaryBar } from "./SummaryBar";
import { Toolbar } from "./Toolbar";
import { TradesTable } from "./TradesTable";

export function KrakenTradesHistoryApp() {
	const [query, setQuery] = useState<GetTradesHistoryRequest>({
		nonce: Date.now(),
	});
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<TradeHistory | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [selected, setSelected] = useState<{ id: string; trade: Trade } | null>(
		null,
	);
	const pageSize = 50;

	console.log("Error:", error);

	// pull data
	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				// const res = await fetcher(query);

				// fetch /api/trades
				const response = await fetch("/api/trades");
				const res = await response.json();
				console.log("Response:", res);
				if (res.error.length > 0) {
					throw new Error(JSON.stringify(res.error));
				}

				console.log("Response:", res);
				if (res.error.length > 0) {
					throw new Error(JSON.stringify(res.error));
				}
				if (!cancelled) {
					if (res.error?.length) setError(res.error.join(" | "));
					setData(res.result ?? null);
				}
			} catch (e: any) {
				if (!cancelled) setError(e?.message ?? "Unknown error");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [query]);

	// const items = useMemo(() => {
	//     const arr: { id: string; trade: Trade }[] = [];
	//     if (!data?.trades) return arr;
	//     for (const [id, t] of Object.entries(data.trades)) {
	//         arr.push({ id, trade: t });
	//     }
	//     // local filters (pair + orderType), Kraken covers others server-side
	//     return arr
	//         .filter((x) =>
	//             query.pair
	//                 ? x.trade.pair.toLowerCase().includes(query.pair.toLowerCase())
	//                 : true,
	//         )
	//         .filter((x) =>
	//             query.orderType === "all" ? true : x.trade.type === query.orderType,
	//         )
	//         .sort((a, b) => b.trade.time - a.trade.time);
	// }, [data, query.pair, query.orderType]);

	const items = useMemo(() => {
		const arr: { id: string; trade: Trade }[] = [];
		if (!data?.trades) return arr;
		for (const [id, t] of Object.entries(data.trades)) {
			arr.push({ id, trade: t });
		}
		return arr;
	}, [data]);

	const total = data?.count ?? 0;
	const page = Math.floor((query.ofs ?? 0) / pageSize) + 1;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const onPrev = () => {
		setQuery((q) => ({ ...q, ofs: Math.max(0, q.ofs - pageSize) }));
	};

	const onNext = () => {
		setQuery((q) => ({
			...q,
			ofs: Math.min((totalPages - 1) * pageSize, q.ofs + pageSize),
		}));
	};

	return (
		<div
			className="min-h-screen"
			style={{ background: colors.bg, color: colors.text }}
		>
			<Header />
			<div className="grid grid-cols-12 gap-3 p-3">
				<aside
					className="col-span-12 lg:col-span-3 rounded-xl p-4 space-y-4"
					style={{
						background: colors.sidebar,
						border: `1px solid ${colors.line}`,
					}}
				>
					<FiltersPanel query={query} setQuery={setQuery} />
					<JSONInspector data={data} />
				</aside>

				<main className="col-span-12 lg:col-span-9 space-y-3">
					<SummaryBar items={items} />

					<div
						className="rounded-xl overflow-hidden"
						style={{
							background: colors.panel,
							border: `1px solid ${colors.line}`,
						}}
					>
						<Toolbar
							loading={loading}
							page={page}
							totalPages={totalPages}
							onPrev={onPrev}
							onNext={onNext}
							onRefresh={() => setQuery((q) => ({ ...q }))}
						/>
						<TradesTable
							items={items}
							loading={loading}
							onSelect={(row) => setSelected(row)}
						/>
					</div>
				</main>
			</div>

			{/* Details Drawer */}
			<DetailsDrawer
				open={!!selected}
				onClose={() => setSelected(null)}
				selected={selected}
			/>

			{/* Error toast */}
			{error && <Overlay text={error} />}
		</div>
	);
}
