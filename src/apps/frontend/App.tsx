import { useState } from "react";
import { KrakenTradesHistoryApp } from "./components/KrakenTradesHistoryApp";
import { PerformanceApp } from "./components/performance/PerformanceApp";
import { colors } from "./styles/colors";
import "./index.css";

type AppView = "trades" | "performance";

export function App() {
	const [currentView, setCurrentView] = useState<AppView>("trades");

	const renderView = () => {
		switch (currentView) {
			case "performance":
				return <PerformanceApp />;
			case "trades":
			default:
				return <KrakenTradesHistoryApp />;
		}
	};

	return (
		<div className="min-h-screen" style={{ background: colors.bg }}>
			{/* Navigation */}
			<nav
				style={{
					background: colors.panel,
					borderBottom: `1px solid ${colors.line}`,
				}}
			>
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex space-x-8">
						<button
							type="button"
							onClick={() => setCurrentView("trades")}
							className="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
							style={{
								borderBottomColor:
									currentView === "trades" ? colors.blue : "transparent",
								color:
									currentView === "trades" ? colors.blue : colors.textMuted,
							}}
						>
							Trades History
						</button>
						<button
							type="button"
							onClick={() => setCurrentView("performance")}
							className="py-4 px-2 border-b-2 font-medium text-sm transition-colors"
							style={{
								borderBottomColor:
									currentView === "performance" ? colors.blue : "transparent",
								color:
									currentView === "performance"
										? colors.blue
										: colors.textMuted,
							}}
						>
							Performance Overview
						</button>
					</div>
				</div>
			</nav>

			{/* Content */}
			<main>{renderView()}</main>
		</div>
	);
}

export default App;
