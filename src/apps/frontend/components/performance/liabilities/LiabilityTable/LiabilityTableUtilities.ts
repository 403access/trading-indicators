import { colors } from "#/apps/frontend/styles/colors";
import type {
	Liability,
	LiabilityType,
} from "#/apps/frontend/types/performance";

export const formatCurrency = (value: number) =>
	new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);

export const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

export const formatDate = (timestamp: number) =>
	new Intl.DateTimeFormat("de-DE").format(new Date(timestamp));

export const calculateMaturityDate = (liability: Liability) => {
	const startDate = new Date(liability.startDate);
	const maturityDate = new Date(startDate);
	maturityDate.setMonth(startDate.getMonth() + liability.termMonths);
	return maturityDate.getTime();
};

export const calculateNextPayment = (_liability: Liability) => {
	// Simplified - would need more complex logic for actual payment schedules
	const today = new Date();
	const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
	return nextMonth.getTime();
};

export const calculateYTDInterest = (liability: Liability) => {
	// Simplified calculation - would need actual payment history
	const monthsPassed = Math.max(1, new Date().getMonth() + 1);
	return (liability.currentPrincipalEur * liability.apr * monthsPassed) / 12;
};

export const getTypeLabel = (type: LiabilityType) => {
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

export const getTypeColor = (type: LiabilityType) => {
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
