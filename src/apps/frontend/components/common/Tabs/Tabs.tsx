import { useState } from "react";
import { PerformanceApp } from "#/apps/frontend/components/performance/PerformanceApp";
import { CalendarPage } from "#/apps/frontend/pages/CalendarPage";
import { KrakenTradesHistoryApp } from "#/apps/frontend/pages/KrakenTradesHistoryPage";
import { TaxesPage } from "#/apps/frontend/pages/TaxesPage.tsx/TaxesPage";
import { colors } from "#/apps/frontend/styles/colors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export type AppView = "trades" | "performance" | "taxes" | "calendar";

export type TabsProps<T> = {
	defaultView: T;
};

const TABS = [
	{
		value: "trades",
		label: "Trades History",
		render: () => <KrakenTradesHistoryApp />,
	},
	{
		value: "performance",
		label: "Performance Overview",
		render: () => <PerformanceApp />,
	},
	{
		value: "taxes",
		label: "Taxes",
		render: () => <TaxesPage />,
	},
	{
		value: "Calendar",
		label: "Calendar",
		render: () => <CalendarPage />,
	},
];

export const MyTabs = <AppView,>({ defaultView }: TabsProps<AppView>) => {
	const [currentView, setCurrentView] = useState<AppView>(defaultView);

	if (TABS === undefined || TABS.length === 0) {
		return null;
	}

	return (
		<Tabs
			className="mx-auto space-x-8 gap-0"
			style={{
				background: colors.panel,
				borderBottom: `1px solid ${colors.line}`,
			}}
			defaultValue={TABS[0].value}
		>
			<TabsList
				style={{
					background: colors.panel,
					width: "100%",
					height: 52,
					padding: 0,
				}}
			>
				{TABS.map((tab) => (
					<TabsTrigger
						key={tab.value}
						className="py-4 px-2 font-medium text-sm transition-colors rounded-none"
						style={{
							border: 0,
							borderBottom: `2px solid ${colors.line}`,
							borderBottomColor:
								currentView === tab.value ? colors.blue : colors.line,
							color: currentView === tab.value ? colors.blue : colors.textMuted,
							background: colors.panel,
							boxSizing: "border-box",
						}}
						value={tab.value}
						onClick={() => setCurrentView(tab.value as AppView)}
					>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			{TABS.map((tab) => (
				<TabsContent key={tab.value} className="m-0" value={tab.value}>
					{tab.render()}
				</TabsContent>
			))}
		</Tabs>
	);
};
