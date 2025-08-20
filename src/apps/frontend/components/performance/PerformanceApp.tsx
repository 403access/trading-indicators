import type { PerformanceData } from "../../types/performance";
import { PerformanceOverview } from "./PerformanceOverview";

// Mock data for development - replace with actual data fetching
const mockData: PerformanceData = {
	balances: [
		{
			t: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
			sourceId: "kraken",
			liquidEur: 10000,
			frozenEur: 2000,
			interestAccruedEur: 50,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: Date.now() - 6 * 24 * 60 * 60 * 1000,
			sourceId: "kraken",
			liquidEur: 10200,
			frozenEur: 2100,
			interestAccruedEur: 55,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: Date.now() - 5 * 24 * 60 * 60 * 1000,
			sourceId: "binance",
			liquidEur: 5000,
			frozenEur: 1000,
			interestAccruedEur: 25,
			depositsEur: 1000,
			withdrawalsEur: 0,
		},
		{
			t: Date.now() - 4 * 24 * 60 * 60 * 1000,
			sourceId: "kraken",
			liquidEur: 10500,
			frozenEur: 2000,
			interestAccruedEur: 60,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: Date.now() - 3 * 24 * 60 * 60 * 1000,
			sourceId: "binance",
			liquidEur: 5200,
			frozenEur: 1100,
			interestAccruedEur: 30,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: Date.now() - 2 * 24 * 60 * 60 * 1000,
			sourceId: "kraken",
			liquidEur: 10800,
			frozenEur: 2200,
			interestAccruedEur: 65,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
			sourceId: "binance",
			liquidEur: 5400,
			frozenEur: 1200,
			interestAccruedEur: 35,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: Date.now() - 60 * 60 * 1000, // 1 hour ago (current)
			sourceId: "kraken",
			liquidEur: 11000,
			frozenEur: 2300,
			interestAccruedEur: 70,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
		{
			t: Date.now() - 30 * 60 * 1000, // 30 minutes ago (current)
			sourceId: "binance",
			liquidEur: 5600,
			frozenEur: 1300,
			interestAccruedEur: 40,
			depositsEur: 0,
			withdrawalsEur: 0,
		},
	],
	liabilities: [
		{
			id: "mortgage-1",
			name: "Immobilienkredit Hauptwohnsitz",
			type: "loan",
			apr: 0.035,
			installmentEur: 1200,
			termMonths: 240,
			startDate: Date.now() - 36 * 30 * 24 * 60 * 60 * 1000, // 3 years ago
			currentPrincipalEur: 180000,
			amortization: [
				{
					t: Date.now() + 30 * 24 * 60 * 60 * 1000, // next month
					principal: 650,
					interest: 550,
					payment: 1200,
				},
				{
					t: Date.now() + 60 * 24 * 60 * 60 * 1000, // in 2 months
					principal: 652,
					interest: 548,
					payment: 1200,
				},
			],
		},
		{
			id: "cc-1",
			name: "Visa Kreditkarte",
			type: "cc",
			apr: 0.189,
			installmentEur: 150,
			termMonths: 12,
			startDate: Date.now() - 6 * 30 * 24 * 60 * 60 * 1000, // 6 months ago
			currentPrincipalEur: 2500,
		},
		{
			id: "broker-1",
			name: "Interactive Brokers Margin",
			type: "broker",
			apr: 0.055,
			installmentEur: 0,
			termMonths: 0,
			startDate: Date.now() - 12 * 30 * 24 * 60 * 60 * 1000, // 1 year ago
			currentPrincipalEur: 15000,
		},
	],
	taxReserves: [
		{
			t: Date.now() - 24 * 60 * 60 * 1000,
			reservedEur: 3500,
		},
		{
			t: Date.now(),
			reservedEur: 3650,
		},
	],
	targets: {
		period: "month",
		valueEur: 2000,
	},
	kpis: {
		liquid: 16600,
		frozen: 3600,
		equity: 2700,
		totalPercent: 15.2,
		weekPercent: 5.8,
		biweekPercent: 9.1,
		monthPercent: 12.4,
		totalEur: 20200, // liquid + frozen
		targetEur: 2000,
		neededEur: 1550, // what's still needed to reach target
		earnedEur: 1200, // gross profit before deductions
		liabilitiesEur: 750, // taxes + other liabilities
		profitEur: 450, // net profit after all deductions
		interestToday: 15,
		interestWeek: 105,
		interestMonth: 450,
		taxReserve: 3650,
	},
};

export function PerformanceApp() {
	return <PerformanceOverview data={mockData} />;
}
