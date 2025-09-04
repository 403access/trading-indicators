import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Tabs } from "#/apps/frontend/components/common/Tabs";
import { KrakenTradesHistoryApp } from "#/apps/frontend/components/KrakenTradesHistoryApp";
import { PerformanceApp } from "#/apps/frontend/components/performance/PerformanceApp";
import { colors } from "#/apps/frontend/styles/colors";
import "./index.css";
import { type AppView, MyTabs } from "#/apps/frontend/components/common/Tabs";

const queryClient = new QueryClient();

export function Comp1() {
	console.log("Comp1 rendered");
	return <div>Component 1</div>;
}

export function Comp2() {
	console.log("Comp2 rendered");
	return <div>Component 2</div>;
}

export function App() {
	const renderView = (currentView: AppView) => {
		switch (currentView) {
			case "performance":
				return <PerformanceApp />;
			case "trades":
				return <KrakenTradesHistoryApp />;
			default:
				return <div>Not implemented yet.</div>;
		}
	};

	return (
		<div className="min-h-screen" style={{ background: colors.bg }}>
			{/* Navigation */}
			{/* <Tabs<AppView> defaultView="trades" renderView={renderView} /> */}

			{/* Content */}
			{/* <main>
				<QueryClientProvider client={queryClient}>
					{renderView()}
				</QueryClientProvider>
			</main> */}

			<QueryClientProvider client={queryClient}>
				<MyTabs<AppView> defaultView="trades" />
			</QueryClientProvider>
		</div>
	);
}

export default App;
