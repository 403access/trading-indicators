import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { colors } from "#/apps/frontend/styles/colors";
import "./index.css";
import { type AppView, MyTabs } from "#/apps/frontend/components/common/Tabs";

const queryClient = new QueryClient();

export function App() {
	return (
		<div className="min-h-screen" style={{ background: colors.bg }}>
			<QueryClientProvider client={queryClient}>
				<MyTabs<AppView> defaultView="trades" />
			</QueryClientProvider>
		</div>
	);
}

export default App;
