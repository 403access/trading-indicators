import { colors } from "../../styles/colors";
import type { PerformanceKPIs } from "../../types/performance";

interface KPIBarProps {
	kpis: PerformanceKPIs;
}

export function KPIBar({ kpis }: KPIBarProps) {
	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("de-DE", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);

	const formatPercent = (value: number) =>
		`${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

	const getPercentColor = (value: number) =>
		value >= 0 ? colors.green : colors.red;

	const getCurrencyColor = (value: number) =>
		value >= 0 ? colors.green : colors.red;

	return (
		<div
			className="rounded-xl overflow-hidden"
			style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
		>
			{/* First Row - Performance Percentages */}
			<div
				className="px-4 py-2"
				style={{
					borderBottom: `1px solid ${colors.line}`,
					background: colors.sidebar,
				}}
			>
				<h3 className="text-sm font-medium" style={{ color: colors.textMuted }}>
					Performance
				</h3>
			</div>
			<div
				className="grid grid-cols-4 gap-0"
				style={{ borderBottom: `1px solid ${colors.line}` }}
			>
				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Total
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: getPercentColor(kpis.totalPercent) }}
					>
						{formatPercent(kpis.totalPercent)}
					</div>
				</div>

				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Week
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: getPercentColor(kpis.weekPercent) }}
					>
						{formatPercent(kpis.weekPercent)}
					</div>
				</div>

				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						BiWeek
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: getPercentColor(kpis.biweekPercent) }}
					>
						{formatPercent(kpis.biweekPercent)}
					</div>
				</div>

				<div className="text-center p-4">
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Month
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: getPercentColor(kpis.monthPercent) }}
					>
						{formatPercent(kpis.monthPercent)}
					</div>
				</div>
			</div>

			{/* Second Row - Asset Breakdown (% and EUR) */}
			<div
				className="px-4 py-2"
				style={{
					borderBottom: `1px solid ${colors.line}`,
					background: colors.sidebar,
				}}
			>
				<h3 className="text-sm font-medium" style={{ color: colors.textMuted }}>
					Assets
				</h3>
			</div>
			<div
				className="grid grid-cols-4 gap-0"
				style={{ borderBottom: `1px solid ${colors.line}` }}
			>
				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Total
					</div>
					<div className="text-lg font-semibold" style={{ color: colors.blue }}>
						{formatCurrency(kpis.totalEur)}
					</div>
					<div
						className="text-sm"
						style={{ color: getPercentColor(kpis.totalPercent) }}
					>
						{formatPercent(kpis.totalPercent)}
					</div>
				</div>

				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Liquid
					</div>
					<div className="text-lg font-semibold" style={{ color: colors.cyan }}>
						{formatCurrency(kpis.liquid)}
					</div>
					<div className="text-sm" style={{ color: colors.textMuted }}>
						{((kpis.liquid / kpis.totalEur) * 100).toFixed(1)}%
					</div>
				</div>

				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Frozen
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: colors.yellow }}
					>
						{formatCurrency(kpis.frozen)}
					</div>
					<div className="text-sm" style={{ color: colors.textMuted }}>
						{((kpis.frozen / kpis.totalEur) * 100).toFixed(1)}%
					</div>
				</div>

				<div className="text-center p-4">
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Target
					</div>
					<div className="text-lg font-semibold" style={{ color: colors.text }}>
						{formatCurrency(kpis.targetEur)}
					</div>
					<div className="text-sm" style={{ color: colors.textMuted }}>
						{((kpis.targetEur / kpis.totalEur) * 100).toFixed(1)}%
					</div>
				</div>
			</div>

			{/* Third Row - Profit Analysis */}
			<div
				className="px-4 py-2"
				style={{
					borderBottom: `1px solid ${colors.line}`,
					background: colors.sidebar,
				}}
			>
				<h3 className="text-sm font-medium" style={{ color: colors.textMuted }}>
					Profit Analysis
				</h3>
			</div>
			<div className="grid grid-cols-4 gap-0">
				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Needed
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: getCurrencyColor(-kpis.neededEur) }}
					>
						{formatCurrency(kpis.neededEur)}
					</div>
				</div>

				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Earned
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: getCurrencyColor(kpis.earnedEur) }}
					>
						{formatCurrency(kpis.earnedEur)}
					</div>
				</div>

				<div
					className="text-center p-4"
					style={{ borderRight: `1px solid ${colors.line}` }}
				>
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Liabilities
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: getCurrencyColor(-kpis.liabilitiesEur) }}
					>
						{formatCurrency(kpis.liabilitiesEur)}
					</div>
				</div>

				<div className="text-center p-4">
					<div
						className="text-xs uppercase tracking-wide"
						style={{ color: colors.textMuted }}
					>
						Profit
					</div>
					<div
						className="text-lg font-semibold"
						style={{ color: getCurrencyColor(kpis.profitEur) }}
					>
						{formatCurrency(kpis.profitEur)}
					</div>
				</div>
			</div>
		</div>
	);
}
