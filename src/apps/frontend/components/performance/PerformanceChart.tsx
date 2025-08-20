import { useMemo } from "react";
import { colors } from "../../styles/colors";
import type { Balance, ChartMode, TimeFrame } from "../../types/performance";

interface PerformanceChartProps {
	balances: Balance[];
	mode: ChartMode;
	timeFrame: TimeFrame;
	onModeChange: (mode: ChartMode) => void;
}

export function PerformanceChart({
	balances,
	mode,
	timeFrame,
	onModeChange,
}: PerformanceChartProps) {
	const chartData = useMemo(() => {
		// Filter data based on timeFrame
		const now = Date.now();
		const timeRanges = {
			day: 24 * 60 * 60 * 1000,
			week: 7 * 24 * 60 * 60 * 1000,
			month: 30 * 24 * 60 * 60 * 1000,
			all: Infinity,
		};

		const cutoff = now - timeRanges[timeFrame];
		const filteredBalances = balances.filter((b) => b.t >= cutoff);

		// Group by timestamp and calculate totals
		const grouped = filteredBalances.reduce(
			(acc, balance) => {
				if (!acc[balance.t]) {
					acc[balance.t] = {
						liquid: 0,
						frozen: 0,
						deposits: 0,
						withdrawals: 0,
						interest: 0,
					};
				}
				const entry = acc[balance.t];
				if (entry) {
					entry.liquid += balance.liquidEur;
					entry.frozen += balance.frozenEur;
					entry.deposits += balance.depositsEur;
					entry.withdrawals += balance.withdrawalsEur;
					entry.interest += balance.interestAccruedEur;
				}
				return acc;
			},
			{} as Record<
				number,
				{
					liquid: number;
					frozen: number;
					deposits: number;
					withdrawals: number;
					interest: number;
				}
			>,
		);

		return Object.entries(grouped)
			.map(([timestamp, data]) => ({
				timestamp: parseInt(timestamp),
				...data,
				equity: data.liquid + data.frozen, // Simplified - would need to subtract liabilities
				netDebt: 0, // Would need liability data
			}))
			.sort((a, b) => a.timestamp - b.timestamp);
	}, [balances, timeFrame]);

	const formatDate = (timestamp: number) =>
		new Intl.DateTimeFormat("de-DE", {
			month: "short",
			day: "numeric",
			hour: timeFrame === "day" ? "numeric" : undefined,
			minute: timeFrame === "day" ? "2-digit" : undefined,
		}).format(new Date(timestamp));

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("de-DE", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);

	const getYValue = (dataPoint: (typeof chartData)[0]) => {
		switch (mode) {
			case "liquid":
				return dataPoint.liquid;
			case "netDebt":
				return dataPoint.netDebt;
			case "equity":
			default:
				return dataPoint.equity;
		}
	};

	// Simple SVG chart implementation
	const maxValue = Math.max(...chartData.map(getYValue));
	const minValue = Math.min(...chartData.map(getYValue));
	const range = maxValue - minValue || 1;

	return (
		<div
			className="rounded-xl p-6"
			style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold" style={{ color: colors.text }}>
					Performance Chart
				</h2>
				<div className="flex gap-2">
					{(["equity", "liquid", "netDebt"] as const).map((chartMode) => (
						<button
							key={chartMode}
							type="button"
							onClick={() => onModeChange(chartMode)}
							className="px-3 py-1 text-sm rounded transition-colors"
							style={{
								background: mode === chartMode ? colors.blue : colors.sidebar,
								color: mode === chartMode ? colors.text : colors.textMuted,
								border: `1px solid ${mode === chartMode ? colors.blue : colors.line}`,
							}}
						>
							{chartMode === "equity"
								? "Equity"
								: chartMode === "liquid"
									? "Liquid"
									: "Net Debt"}
						</button>
					))}
				</div>
			</div>

			{chartData.length === 0 ? (
				<div
					style={{
						height: "16rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#cccccc",
					}}
				>
					No data available for the selected time frame
				</div>
			) : (
				<div className="h-64 relative">
					<svg
						className="w-full h-full"
						viewBox="0 0 800 200"
						aria-label="Performance chart"
					>
						<title>Performance chart showing {mode} over time</title>
						<defs>
							<linearGradient
								id="areaGradient"
								x1="0%"
								y1="0%"
								x2="0%"
								y2="100%"
							>
								<stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
								<stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
							</linearGradient>
						</defs>

						{/* Grid lines */}
						{[0, 25, 50, 75, 100].map((percent) => (
							<line
								key={percent}
								x1="50"
								y1={40 + (160 * percent) / 100}
								x2="750"
								y2={40 + (160 * percent) / 100}
								stroke="#404040"
								strokeWidth="1"
							/>
						))}

						{/* Chart line */}
						<polyline
							fill="none"
							stroke="#3b82f6"
							strokeWidth="2"
							points={chartData
								.map((point, index) => {
									const x = 50 + (700 * index) / (chartData.length - 1);
									const y =
										40 + 160 * (1 - (getYValue(point) - minValue) / range);
									return `${x},${y}`;
								})
								.join(" ")}
						/>

						{/* Area under curve */}
						<polygon
							fill="url(#areaGradient)"
							points={`50,200 ${chartData
								.map((point, index) => {
									const x = 50 + (700 * index) / (chartData.length - 1);
									const y =
										40 + 160 * (1 - (getYValue(point) - minValue) / range);
									return `${x},${y}`;
								})
								.join(" ")} 750,200`}
						/>

						{/* Data points */}
						{chartData.map((point, index) => {
							const x = 50 + (700 * index) / (chartData.length - 1);
							const y = 40 + 160 * (1 - (getYValue(point) - minValue) / range);
							return (
								<circle
									key={`${point.timestamp}-${index}`}
									cx={x}
									cy={y}
									r="4"
									fill="#3b82f6"
									className="hover:r-6 transition-all cursor-pointer"
								>
									<title>
										{formatDate(point.timestamp)}:{" "}
										{formatCurrency(getYValue(point))}
										{point.deposits > 0 &&
											`\nDeposits: ${formatCurrency(point.deposits)}`}
										{point.withdrawals > 0 &&
											`\nWithdrawals: ${formatCurrency(point.withdrawals)}`}
										{point.interest > 0 &&
											`\nInterest: ${formatCurrency(point.interest)}`}
									</title>
								</circle>
							);
						})}
					</svg>
				</div>
			)}
		</div>
	);
}
