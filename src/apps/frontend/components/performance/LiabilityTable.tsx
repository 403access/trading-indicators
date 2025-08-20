import { colors } from "../../styles/colors";
import type { Liability } from "../../types/performance";

interface LiabilityTableProps {
	liabilities: Liability[];
	onLiabilityClick: (liability: Liability) => void;
}

export function LiabilityTable({
	liabilities,
	onLiabilityClick,
}: LiabilityTableProps) {
	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("de-DE", {
			style: "currency",
			currency: "EUR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);

	const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

	const formatDate = (timestamp: number) =>
		new Intl.DateTimeFormat("de-DE").format(new Date(timestamp));

	const calculateMaturityDate = (liability: Liability) => {
		const startDate = new Date(liability.startDate);
		const maturityDate = new Date(startDate);
		maturityDate.setMonth(startDate.getMonth() + liability.termMonths);
		return maturityDate.getTime();
	};

	const calculateNextPayment = (_liability: Liability) => {
		// Simplified - would need more complex logic for actual payment schedules
		const today = new Date();
		const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
		return nextMonth.getTime();
	};

	const calculateYTDInterest = (liability: Liability) => {
		// Simplified calculation - would need actual payment history
		const monthsPassed = Math.max(1, new Date().getMonth() + 1);
		return (liability.currentPrincipalEur * liability.apr * monthsPassed) / 12;
	};

	const getTypeLabel = (type: Liability["type"]) => {
		switch (type) {
			case "loan":
				return "Darlehen";
			case "cc":
				return "Kreditkarte";
			case "broker":
				return "Broker-Kredit";
			default:
				return type;
		}
	};

	const getTypeColor = (type: Liability["type"]) => {
		switch (type) {
			case "loan":
				return { background: colors.blue, color: colors.text };
			case "cc":
				return { background: colors.red, color: colors.text };
			case "broker":
				return { background: colors.yellow, color: colors.text };
			default:
				return { background: colors.line, color: colors.text };
		}
	};

	return (
		<div
			className="rounded-xl overflow-hidden"
			style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
		>
			<div
				className="px-6 py-4"
				style={{ borderBottom: `1px solid ${colors.line}` }}
			>
				<h2 className="text-xl font-semibold" style={{ color: colors.text }}>
					Verbindlichkeiten
				</h2>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead style={{ background: colors.sidebar }}>
						<tr>
							<th
								className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								Name
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								Typ
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								APR
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								Rate €
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								Restschuld €
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								Fälligkeit
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								Nächste Zahlung
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
								style={{
									color: colors.textMuted,
									borderBottom: `1px solid ${colors.line}`,
								}}
							>
								Zinsen YTD €
							</th>
						</tr>
					</thead>
					<tbody style={{ background: colors.panel }}>
						{liabilities.map((liability) => (
							<tr
								key={liability.id}
								onClick={() => onLiabilityClick(liability)}
								className="cursor-pointer transition-colors"
								style={{
									borderBottom: `1px solid ${colors.line}`,
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = colors.sidebar;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = colors.panel;
								}}
							>
								<td className="px-6 py-4 whitespace-nowrap">
									<div
										className="text-sm font-medium"
										style={{ color: colors.text }}
									>
										{liability.name}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
										style={getTypeColor(liability.type)}
									>
										{getTypeLabel(liability.type)}
									</span>
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-sm"
									style={{ color: colors.text }}
								>
									{formatPercent(liability.apr)}
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-sm"
									style={{ color: colors.text }}
								>
									{formatCurrency(liability.installmentEur)}
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-sm font-medium"
									style={{ color: colors.text }}
								>
									{formatCurrency(liability.currentPrincipalEur)}
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-sm"
									style={{ color: colors.text }}
								>
									{formatDate(calculateMaturityDate(liability))}
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-sm"
									style={{ color: colors.text }}
								>
									{formatDate(calculateNextPayment(liability))}
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-sm"
									style={{ color: colors.text }}
								>
									{formatCurrency(calculateYTDInterest(liability))}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{liabilities.length === 0 && (
					<div
						className="text-center py-12"
						style={{ color: colors.textMuted }}
					>
						Keine Verbindlichkeiten vorhanden
					</div>
				)}
			</div>
		</div>
	);
}
