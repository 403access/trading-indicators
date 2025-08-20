import { useState } from "react";
import { colors } from "../../styles/colors";
import type {
	ChartMode,
	Liability,
	PerformanceData,
	TimeFrame,
} from "../../types/performance";
import { KPIBar } from "./KPIBar";
import { LiabilityTable } from "./LiabilityTable";
import { PerformanceChart } from "./PerformanceChart";
import { TimeFrameFilter } from "./TimeFrameFilter";

interface PerformanceOverviewProps {
	data: PerformanceData;
}

export function PerformanceOverview({ data }: PerformanceOverviewProps) {
	const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
	const [chartMode, setChartMode] = useState<ChartMode>("equity");
	const [selectedLiability, setSelectedLiability] = useState<Liability | null>(
		null,
	);

	// Use the provided KPIs from data
	const kpis = data.kpis;

	const handleLiabilityClick = (liability: Liability) => {
		setSelectedLiability(liability);
		// TODO: Show detailed view/modal
	};

	return (
		<div className="min-h-screen p-6" style={{ background: colors.bg }}>
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold" style={{ color: colors.text }}>
							Performance Overview
						</h1>
						<p className="mt-1" style={{ color: colors.textMuted }}>
							Kapital, Zinsen und Verbindlichkeiten im Überblick
						</p>
					</div>
					<TimeFrameFilter selected={timeFrame} onChange={setTimeFrame} />
				</div>

				{/* KPI Bar */}
				<KPIBar kpis={kpis} />

				{/* Performance Chart */}
				<PerformanceChart
					balances={data.balances}
					mode={chartMode}
					timeFrame={timeFrame}
					onModeChange={setChartMode}
				/>

				{/* Liability Table */}
				<LiabilityTable
					liabilities={data.liabilities}
					onLiabilityClick={handleLiabilityClick}
				/>

				{/* Selected Liability Details */}
				{selectedLiability && (
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">
								Details: {selectedLiability.name}
							</h3>
							<button
								type="button"
								onClick={() => setSelectedLiability(null)}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<div className="text-sm text-gray-500">Typ</div>
								<div className="font-medium">{selectedLiability.type}</div>
							</div>
							<div>
								<div className="text-sm text-gray-500">APR</div>
								<div className="font-medium">
									{(selectedLiability.apr * 100).toFixed(2)}%
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-500">Laufzeit</div>
								<div className="font-medium">
									{selectedLiability.termMonths} Monate
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-500">Restschuld</div>
								<div className="font-medium">
									{new Intl.NumberFormat("de-DE", {
										style: "currency",
										currency: "EUR",
									}).format(selectedLiability.currentPrincipalEur)}
								</div>
							</div>
						</div>

						{selectedLiability.amortization &&
							selectedLiability.amortization.length > 0 && (
								<div className="mt-6">
									<h4 className="text-md font-medium mb-3">Tilgungsplan</h4>
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-3 py-2 text-left">Datum</th>
													<th className="px-3 py-2 text-left">Tilgung</th>
													<th className="px-3 py-2 text-left">Zinsen</th>
													<th className="px-3 py-2 text-left">Rate</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200">
												{selectedLiability.amortization
													.slice(0, 10)
													.map((entry, index) => (
														<tr key={`${entry.t}-${index}`}>
															<td className="px-3 py-2">
																{new Intl.DateTimeFormat("de-DE").format(
																	new Date(entry.t),
																)}
															</td>
															<td className="px-3 py-2">
																{new Intl.NumberFormat("de-DE", {
																	style: "currency",
																	currency: "EUR",
																}).format(entry.principal)}
															</td>
															<td className="px-3 py-2">
																{new Intl.NumberFormat("de-DE", {
																	style: "currency",
																	currency: "EUR",
																}).format(entry.interest)}
															</td>
															<td className="px-3 py-2">
																{new Intl.NumberFormat("de-DE", {
																	style: "currency",
																	currency: "EUR",
																}).format(entry.payment)}
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</div>
							)}
					</div>
				)}
			</div>
		</div>
	);
}
