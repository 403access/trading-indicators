import { useEffect, useState } from "react";
import type { PerformanceData } from "#/apps/frontend/types/performance";
import { handleApiResponse, performanceApi } from "#/packages/api-client";
import { PerformanceOverview } from "./PerformanceOverview/PerformanceOverview";

export function PerformanceApp() {
	const [data, setData] = useState<PerformanceData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchPerformanceData() {
			try {
				setLoading(true);
				setError(null);

				const response = await performanceApi.getData();
				const performanceData = handleApiResponse(response);

				setData(performanceData);
			} catch (err) {
				console.error("Failed to fetch performance data:", err);
				setError(
					err instanceof Error
						? err.message
						: "Failed to load performance data",
				);
			} finally {
				setLoading(false);
			}
		}

		fetchPerformanceData();
	}, []);

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "400px",
					color: "#d4d4d4",
				}}
			>
				Loading performance data...
			</div>
		);
	}

	if (error) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "400px",
					color: "#f48771",
					gap: "16px",
				}}
			>
				<div>Error loading performance data:</div>
				<div style={{ fontSize: "14px", opacity: 0.8 }}>{error}</div>
				<button
					type="button"
					onClick={() => window.location.reload()}
					style={{
						padding: "8px 16px",
						backgroundColor: "#007acc",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					Retry
				</button>
			</div>
		);
	}

	if (!data) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "400px",
					color: "#d4d4d4",
				}}
			>
				No performance data available
			</div>
		);
	}

	return <PerformanceOverview data={data} />;
}
