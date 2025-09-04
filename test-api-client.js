// Quick test of API client functionality
async function testApiClient() {
	try {
		console.log("Testing performance API endpoint...");

		const response = await fetch(
			"https://192.168.178.110:3000/api/performance",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const data = await response.json();
		console.log("Raw API response:", JSON.stringify(data, null, 2));

		// Test our API client logic
		if (
			typeof data === "object" &&
			data !== null &&
			"error" in data &&
			"result" in data
		) {
			if (Array.isArray(data.error) && data.error.length > 0) {
				console.log("❌ API returned errors:", data.error);
			} else {
				console.log(
					"✅ API client should receive:",
					JSON.stringify(data.result.kpis, null, 2),
				);
			}
		}
	} catch (error) {
		console.error("❌ Test failed:", error);
	}
}

testApiClient();
