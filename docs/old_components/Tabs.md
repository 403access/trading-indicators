Usage:

```tsx
{/* Navigation */}
<Tabs<AppView> defaultView="trades" renderView={renderView} />

{/* Content */}
<main>
    <QueryClientProvider client={queryClient}>
        {renderView()}
    </QueryClientProvider>
</main>
```

Definition:

```tsx
import { type JSX, useState } from "react";
import { KrakenTradesHistoryApp } from "#/apps/frontend/components/KrakenTradesHistoryApp";
import { PerformanceApp } from "#/apps/frontend/components/performance/PerformanceApp";
import { colors } from "#/apps/frontend/styles/colors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export type AppView = "trades" | "performance";

export interface TabPrps {
    isActive: boolean
    title: string
    onClick: () => void
}
export function Tab({ isActive, title, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
			style={{
				borderBottomColor: isActive ? colors.blue : "transparent",
				color: isActive ? colors.blue : colors.textMuted,
			}}
		>
			{title}
		</button>
	);
}


export type TabsProps<T> = {
	defaultView: any;
	renderView: (view: T) => JSX.Element;
};
export const MyTabs = <AppView,>({
	defaultView,
	renderView,
}: TabsProps<AppView>) => {
	const [currentView, setCurrentView] = useState<AppView>(defaultView);

	return (
			<nav
				style={{
					background: colors.panel,
					borderBottom: `1px solid ${colors.line}`,
				}}
			>
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex space-x-8">
                        <Tab
                            isActive={currentView === "trades"}
                            title="Trades History"
                            onClick={() => setCurrentView("trades" as AppView)}
                        />
                        <Tab
                            isActive={currentView === "performance"}
                            title="Performance Overview"
                            onClick={() => setCurrentView("performance" as AppView)}
                        />
					</div>
				</div>
			</nav>
	);
};
```