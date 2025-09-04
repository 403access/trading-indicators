/**
 * Performance service that calculates performance metrics from trading data
 */

import type {
	Balance,
	Liability,
	PerformanceData,
	PerformanceKPIs,
	Target,
	TaxReserve,
} from "#/apps/frontend/types/performance";
import {
	getBalances,
	getLiabilities,
	getTaxReserves,
	getTrades,
	initializeDatabase,
} from "#/packages/database";
import type { Trade } from "#/packages/kraken";

// Initialize database on module load
initializeDatabase();

/**
 * Calculate performance metrics from trade data
 */
export function calculatePerformanceKPIs(
	trades: { [key: string]: Trade },
	balances: Balance[],
	liabilities: Liability[],
	taxReserves: TaxReserve[],
): PerformanceKPIs {
	// Calculate totals from most recent balances
	const latestBalances = getLatestBalancesBySource(balances);
	const totalLiquid = Object.values(latestBalances).reduce(
		(sum, balance) => sum + balance.liquidEur,
		0,
	);
	const totalFrozen = Object.values(latestBalances).reduce(
		(sum, balance) => sum + balance.frozenEur,
		0,
	);

	// Calculate trading PnL from trades
	const tradeArray = Object.values(trades);
	const totalPnL = tradeArray.reduce((sum, trade) => {
		// Calculate P&L: (price * volume) - cost - fee
		const revenue = parseFloat(trade.price) * parseFloat(trade.vol);
		const cost = parseFloat(trade.cost);
		const fee = parseFloat(trade.fee);
		const pnl = trade.type === "buy" ? -(cost + fee) : revenue - cost - fee;
		return sum + (trade.net || pnl);
	}, 0);

	// Calculate time-based performance
	const now = Date.now() / 1000;
	const dayAgo = now - 24 * 60 * 60;
	const weekAgo = now - 7 * 24 * 60 * 60;
	const biweekAgo = now - 14 * 24 * 60 * 60;
	const monthAgo = now - 30 * 24 * 60 * 60;

	const dayTrades = tradeArray.filter((t) => t.time >= dayAgo);
	const weekTrades = tradeArray.filter((t) => t.time >= weekAgo);
	const biweekTrades = tradeArray.filter((t) => t.time >= biweekAgo);
	const monthTrades = tradeArray.filter((t) => t.time >= monthAgo);

	const calculatePeriodPnL = (periodTrades: Trade[]) =>
		periodTrades.reduce((sum, trade) => {
			const revenue = parseFloat(trade.price) * parseFloat(trade.vol);
			const cost = parseFloat(trade.cost);
			const fee = parseFloat(trade.fee);
			const pnl = trade.type === "buy" ? -(cost + fee) : revenue - cost - fee;
			return sum + (trade.net || pnl);
		}, 0);

	const dayPnL = calculatePeriodPnL(dayTrades);
	const weekPnL = calculatePeriodPnL(weekTrades);
	const biweekPnL = calculatePeriodPnL(biweekTrades);
	const monthPnL = calculatePeriodPnL(monthTrades);

	// Calculate percentages (assuming initial capital, could be made dynamic)
	const totalCapital = totalLiquid + totalFrozen;
	const weekPercent = totalCapital > 0 ? (weekPnL / totalCapital) * 100 : 0;
	const biweekPercent = totalCapital > 0 ? (biweekPnL / totalCapital) * 100 : 0;
	const monthPercent = totalCapital > 0 ? (monthPnL / totalCapital) * 100 : 0;
	const totalPercent = totalCapital > 0 ? (totalPnL / totalCapital) * 100 : 0;

	// Calculate interest metrics
	const totalInterestToday = Object.values(latestBalances).reduce(
		(sum, balance) => sum + balance.interestAccruedEur,
		0,
	);

	// Get liability totals
	const totalLiabilities = liabilities.reduce(
		(sum, liability) => sum + liability.currentPrincipalEur,
		0,
	);

	// Get latest tax reserve
	const latestTaxReserve =
		taxReserves.length > 0 && taxReserves[taxReserves.length - 1]
			? taxReserves[taxReserves.length - 1].reservedEur
			: 0;

	// Calculate equity (assets - liabilities)
	const equity = totalCapital - totalLiabilities;

	// Mock target for now (can be made configurable)
	const targetEur = 2000;
	const earnedEur = Math.max(0, totalPnL);
	const profitEur = earnedEur - totalLiabilities - latestTaxReserve;
	const neededEur = Math.max(0, targetEur - earnedEur);

	return {
		liquid: totalLiquid,
		frozen: totalFrozen,
		equity,
		totalPercent,
		weekPercent,
		biweekPercent,
		monthPercent,
		totalEur: totalCapital,
		targetEur,
		neededEur,
		earnedEur,
		liabilitiesEur: totalLiabilities,
		profitEur,
		interestToday: totalInterestToday,
		interestWeek: totalInterestToday * 7, // Simplified calculation
		interestMonth: totalInterestToday * 30, // Simplified calculation
		taxReserve: latestTaxReserve,
	};
}

/**
 * Get the latest balance for each source
 */
function getLatestBalancesBySource(balances: Balance[]): {
	[sourceId: string]: Balance;
} {
	const latest: { [sourceId: string]: Balance } = {};

	for (const balance of balances) {
		const currentLatest = latest[balance.sourceId];
		if (!currentLatest || balance.t > currentLatest.t) {
			latest[balance.sourceId] = balance;
		}
	}

	return latest;
}

/**
 * Get complete performance data by combining all sources
 */
export async function getPerformanceData(): Promise<PerformanceData> {
	try {
		// Get data from database
		const tradesResult = getTrades({ limit: 1000 }); // Get more trades for better calculations
		const balances = getBalances({ limit: 100 });
		const liabilities = getLiabilities();
		const taxReserves = getTaxReserves({ limit: 10 });

		// If no data exists, create some sample data for demo
		if (balances.length === 0) {
			await seedSampleData();
			return getPerformanceData(); // Recursive call after seeding
		}

		// Calculate KPIs
		const kpis = calculatePerformanceKPIs(
			tradesResult.trades,
			balances,
			liabilities,
			taxReserves,
		);

		// Define targets (could be made configurable)
		const targets: Target = {
			period: "month",
			valueEur: 2000,
		};

		return {
			balances,
			liabilities,
			taxReserves,
			targets,
			kpis,
		};
	} catch (error) {
		console.error("Error getting performance data:", error);

		// Return default/empty data on error
		return {
			balances: [],
			liabilities: [],
			taxReserves: [],
			targets: { period: "month", valueEur: 2000 },
			kpis: {
				liquid: 0,
				frozen: 0,
				equity: 0,
				totalPercent: 0,
				weekPercent: 0,
				biweekPercent: 0,
				monthPercent: 0,
				totalEur: 0,
				targetEur: 2000,
				neededEur: 2000,
				earnedEur: 0,
				liabilitiesEur: 0,
				profitEur: 0,
				interestToday: 0,
				interestWeek: 0,
				interestMonth: 0,
				taxReserve: 0,
			},
		};
	}
}

/**
 * Seed some sample data if none exists
 */
async function seedSampleData() {
	const { upsertBalance, upsertLiability, insertTaxReserve } = await import(
		"#/packages/database"
	);

	console.log("No performance data found, seeding sample data...");

	// Add sample balances
	const now = Date.now();
	const sampleBalances: (Omit<Balance, "t"> & { t: number })[] = [
		{
			t: now - 7 * 24 * 60 * 60 * 1000,
			sourceId: "kraken",
			liquidEur: 10000,
			frozenEur: 2000,
			interestAccruedEur: 50,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: now - 30 * 60 * 1000,
			sourceId: "kraken",
			liquidEur: 11000,
			frozenEur: 2300,
			interestAccruedEur: 70,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: now - 5 * 24 * 60 * 60 * 1000,
			sourceId: "binance",
			liquidEur: 5000,
			frozenEur: 1000,
			interestAccruedEur: 25,
			depositsEur: 1000,
			withdrawalsEur: 0,
		},
		{
			t: now - 30 * 60 * 1000,
			sourceId: "binance",
			liquidEur: 5600,
			frozenEur: 1300,
			interestAccruedEur: 40,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
	];

	// Add sample liabilities
	const sampleLiabilities: Liability[] = [
		{
			id: "mortgage-1",
			name: "Immobilienkredit Hauptwohnsitz",
			type: "loan",
			apr: 0.035,
			installmentEur: 1200,
			termMonths: 240,
			startDate: now - 36 * 30 * 24 * 60 * 60 * 1000,
			currentPrincipalEur: 180000,
		},
		{
			id: "cc-1",
			name: "Visa Kreditkarte",
			type: "cc",
			apr: 0.189,
			installmentEur: 150,
			termMonths: 12,
			startDate: now - 6 * 30 * 24 * 60 * 60 * 1000,
			currentPrincipalEur: 2500,
		},
	];

	// Add sample tax reserves
	const sampleTaxReserves: TaxReserve[] = [
		{
			t: now - 24 * 60 * 60 * 1000,
			reservedEur: 3500,
		},
		{
			t: now,
			reservedEur: 3650,
		},
	];

	// Insert sample data
	for (const balance of sampleBalances) {
		upsertBalance(balance);
	}

	for (const liability of sampleLiabilities) {
		upsertLiability(liability);
	}

	for (const taxReserve of sampleTaxReserves) {
		insertTaxReserve(taxReserve);
	}

	console.log("Sample performance data seeded successfully");
}

/**
 * Get performance service information
 */
export function getPerformanceServiceInfo() {
	const balances = getBalances({ limit: 1 });
	const liabilities = getLiabilities();
	const taxReserves = getTaxReserves({ limit: 1 });

	return {
		hasData:
			balances.length > 0 || liabilities.length > 0 || taxReserves.length > 0,
		balanceCount: getBalances().length,
		liabilityCount: liabilities.length,
		taxReserveCount: getTaxReserves().length,
		lastUpdated:
			balances.length > 0 && balances[0]
				? new Date(balances[0].t).toISOString()
				: null,
	};
}
