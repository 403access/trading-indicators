import { useState } from "react";
import { KrakenTradesHistoryApp } from "#/apps/frontend/components/KrakenTradesHistoryApp";
import { PerformanceApp } from "#/apps/frontend/components/performance/PerformanceApp";
import { CalendarPage } from "#/apps/frontend/pages/CalendarPage";
import { TaxesPage } from "#/apps/frontend/pages/TaxesPage.tsx/TaxesPage";
import { colors } from "#/apps/frontend/styles/colors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export type AppView = "trades" | "performance" | "taxes";

export type TabsProps<T> = {
	defaultView: T;
};

const TABS = [
	{
		value: "trades",
		label: "Trades History",
		render: () => <PerformanceApp />,
	},
	{
		value: "performance",
		label: "Performance Overview",
		render: () => <KrakenTradesHistoryApp />,
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
			className="mx-auto space-x-8"
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
				<TabsContent
					key={tab.value}
					className="py-4 px-2 border-b-1 font-medium text-sm transition-colors"
					value={tab.value}
					style={{
						borderBottomColor:
							currentView === tab.value ? colors.blue : colors.line,
						color: currentView === tab.value ? colors.blue : colors.textMuted,
					}}
				>
					{tab.render()}
				</TabsContent>
			))}
		</Tabs>
	);
};
