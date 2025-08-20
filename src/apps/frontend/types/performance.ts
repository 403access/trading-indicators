/**
 * Data model for Performance Overview
 */

export interface Balance {
	t: number; // timestamp (int64)
	sourceId: string;
	liquidEur: number;
	frozenEur: number;
	interestAccruedEur: number;
	depositsEur: number;
	withdrawalsEur: number;
}

export interface AmortizationEntry {
	t: number; // timestamp (int64)
	principal: number;
	interest: number;
	payment: number;
}

export interface Liability {
	id: string;
	name: string;
	type: "loan" | "cc" | "broker";
	apr: number; // annual percentage rate
	installmentEur: number;
	termMonths: number;
	startDate: number; // timestamp (int64)
	currentPrincipalEur: number;
	amortization?: AmortizationEntry[];
}

export interface TaxReserve {
	t: number; // timestamp (int64)
	reservedEur: number;
}

export interface Target {
	period: "month" | "week";
	valueEur: number;
}

export interface PerformanceKPIs {
	liquid: number;
	frozen: number;
	equity: number;
	totalPercent: number;
	weekPercent: number;
	biweekPercent: number;
	monthPercent: number;
	totalEur: number;
	targetEur: number;
	neededEur: number;
	earnedEur: number; // profit before deducting liabilities and tax
	liabilitiesEur: number; // includes taxes and other liabilities
	profitEur: number; // after liabilities and tax are deducted
	interestToday: number;
	interestWeek: number;
	interestMonth: number;
	taxReserve: number;
}

export interface PerformanceData {
	balances: Balance[];
	liabilities: Liability[];
	taxReserves: TaxReserve[];
	targets: Target;
	kpis: PerformanceKPIs;
}

export type TimeFrame = "day" | "week" | "month" | "all";
export type ChartMode = "equity" | "liquid" | "netDebt";
