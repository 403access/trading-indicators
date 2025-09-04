import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ApiResponse } from "#/packages/api";
import type {
	GetTradesHistoryRequest,
	Trade,
	TradeHistory,
} from "#/packages/kraken";
import { mapToKeyedArray } from "#/packages/type-system/objects";
import { colors } from "../styles/colors";
import { usePagination } from "./common/utils/usePagination";
import { FiltersPanel } from "./FiltersPanels";
import { Header } from "./Header";
import { JSONInspector } from "./JSONInspector";
import { Overlay } from "./Overlay";
import { SummaryBar } from "./SummaryBar";
import { Toolbar } from "./Toolbar";
import { TradesTable } from "./TradesTable";
import { TradeDetailsDrawer } from "./trading/TradeDetailsDrawer/TradeDetailsDrawer";

export const fetchApi = <T,>(url: string): Promise<ApiResponse<T>> =>
	fetch(url).then((response) => response.json());

export const fetchTradeHistory = (): Promise<ApiResponse<TradeHistory>> =>
	fetchApi<TradeHistory>("/api/trades");

export const selectApiResult = <T, R>(
	data: ApiResponse<T>,
	mapper?: (data: T) => R,
): R | T => {
	if (data.error.length > 0) {
		throw new Error(data.error.join(" | "));
	}

	if (data.result === null) throw new Error("No result data from API");

	return mapper ? mapper(data.result) : data.result;
};

export const selectQuery = (data: ApiResponse<TradeHistory>) => {
	if (data.error.length > 0) {
		throw new Error(data.error.join(" | "));
	}

	if (data.result === null) throw new Error("No result data from API");

	return mapToKeyedArray(data.result.trades, "trade");
};

export function KrakenTradesHistoryApp() {
	const [query, setQuery] = useState<GetTradesHistoryRequest>({
		nonce: Date.now(),
	});

	const {
		isPending,
		isLoading,
		error: errorTanstack,
		data: dataTanstack,
	} = useQuery({
		queryKey: ["repoData"],
		queryFn: fetchTradeHistory,
		select: selectQuery,
	});

	const pagination = usePagination({
		defaultPage: 1,
		defaultPageSize: 20,
		itemCount: dataTanstack?.length ?? 0,
	});

	console.log("Pagination:", JSON.stringify(pagination));

	const [selected, setSelected] = useState<{ id: string; trade: Trade } | null>(
		null,
	);

	console.log("Pending:", isPending);
	console.log("Tanstack Error:", errorTanstack);
	console.log("Tanstack Data:", dataTanstack);

	const onPrev = () => pagination.prevPage();
	const onNext = () => pagination.nextPage();

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
					<JSONInspector data={dataTanstack} />
				</aside>

				<main className="col-span-12 lg:col-span-9 space-y-3">
					{dataTanstack && <SummaryBar items={dataTanstack} />}

					<div
						className="rounded-xl overflow-hidden"
						style={{
							background: colors.panel,
							border: `1px solid ${colors.line}`,
						}}
					>
						<Toolbar
							loading={isLoading}
							page={pagination.currentPage}
							totalPages={pagination.totalPages}
							onPrev={onPrev}
							onNext={onNext}
							onRefresh={() => setQuery((q) => ({ ...q }))}
						/>
						{dataTanstack && (
							<TradesTable
								items={dataTanstack}
								loading={isLoading}
								onSelect={(row) => setSelected(row)}
							/>
						)}
					</div>
				</main>
			</div>

			{/* Details Drawer */}
			<TradeDetailsDrawer
				open={!!selected}
				onClose={() => setSelected(null)}
				selected={selected}
			/>

			{/* Error toast */}
			{errorTanstack && <Overlay text={JSON.stringify(errorTanstack)} />}
		</div>
	);
}
