import { useState } from "react";
import { KrakenTradesHistoryApp } from "#/apps/frontend/components/KrakenTradesHistoryApp";
import { PerformanceApp } from "#/apps/frontend/components/performance/PerformanceApp";
import { colors } from "#/apps/frontend/styles/colors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export type AppView = "trades" | "performance";

export type TabsProps<T> = {
	defaultView: T;
};
export const MyTabs = <AppView,>({ defaultView }: TabsProps<AppView>) => {
	const [currentView, setCurrentView] = useState<AppView>(defaultView);

	return (
		<Tabs
			className="mx-auto space-x-8"
			style={{
				background: colors.panel,
				borderBottom: `1px solid ${colors.line}`,
			}}
			defaultValue="trades"
		>
			<TabsList
				style={{
					background: colors.panel,
					width: "100%",
					height: 52,
					padding: 0,
				}}
			>
				<TabsTrigger
					className="py-4 px-2 font-medium text-sm transition-colors rounded-none"
					style={{
						border: 0,
						borderBottom: `2px solid ${colors.line}`,
						borderBottomColor:
							currentView === "trades" ? colors.blue : colors.line,
						color: currentView === "trades" ? colors.blue : colors.textMuted,

						background: colors.panel,
						boxSizing: "border-box",
					}}
					value="trades"
					onClick={() => setCurrentView("trades" as AppView)}
				>
					Trades History
				</TabsTrigger>
				<TabsTrigger
					className="py-4 px-2 font-medium text-sm transition-colors  rounded-none"
					style={{
						border: 0,
						borderBottom: `2px solid ${colors.line}`,
						borderBottomColor:
							currentView === "performance" ? colors.blue : colors.line,
						color:
							currentView === "performance" ? colors.blue : colors.textMuted,
						background: colors.panel,
						boxSizing: "border-box",
					}}
					value="performance"
					onClick={() => setCurrentView("performance" as AppView)}
				>
					Performance Overview
				</TabsTrigger>
			</TabsList>
			<TabsContent
				className="py-4 px-2 border-b-1 font-medium text-sm transition-colors"
				value="trades"
				style={{
					borderBottomColor:
						currentView === "trades" ? colors.blue : colors.line,
					color: currentView === "trades" ? colors.blue : colors.textMuted,
				}}
			>
				<PerformanceApp />
			</TabsContent>
			<TabsContent
				className="py-4 px-2 border-b-1 font-medium text-sm transition-colors"
				style={{
					borderBottomColor:
						currentView === "performance" ? colors.blue : "transparent",
					color: currentView === "performance" ? colors.blue : colors.textMuted,
				}}
				value="performance"
			>
				<KrakenTradesHistoryApp />
			</TabsContent>
		</Tabs>
	);
};
