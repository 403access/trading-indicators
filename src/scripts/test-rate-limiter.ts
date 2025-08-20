/**
 * Test script to demonstrate the Kraken rate limiter
 */

// Kraken API Rate Limits Configuration
interface KrakenRateLimits {
	maxCounter: number;
	decreasePerSecond: number;
	accountLevel: "Starter" | "Intermediate" | "Pro";
}

const RATE_LIMITS: Record<string, KrakenRateLimits> = {
	Starter: { maxCounter: 15, decreasePerSecond: 0.33, accountLevel: "Starter" },
	Intermediate: {
		maxCounter: 20,
		decreasePerSecond: 0.5,
		accountLevel: "Intermediate",
	},
	Pro: { maxCounter: 20, decreasePerSecond: 1.0, accountLevel: "Pro" },
};

const TRADES_HISTORY_COST = 2;
const PRO_ACCOUNT: KrakenRateLimits = {
	maxCounter: 20,
	decreasePerSecond: 1.0,
	accountLevel: "Pro",
};

class KrakenRateLimiter {
	private counter: number = 0;
	private lastCallTime: number = Date.now();
	private readonly limits: KrakenRateLimits;

	constructor(accountLevel: KrakenRateLimits = PRO_ACCOUNT) {
		this.limits = accountLevel;
	}

	private updateCounter(): void {
		const now = Date.now();
		const secondsElapsed = (now - this.lastCallTime) / 1000;
		const decrease = secondsElapsed * this.limits.decreasePerSecond;

		this.counter = Math.max(0, this.counter - decrease);
		this.lastCallTime = now;
	}

	async waitForRateLimit(cost: number = TRADES_HISTORY_COST): Promise<void> {
		this.updateCounter();

		if (this.counter + cost > this.limits.maxCounter) {
			const excessCost = this.counter + cost - this.limits.maxCounter;
			const delaySeconds = excessCost / this.limits.decreasePerSecond;
			const delayMs = Math.ceil(delaySeconds * 1000);

			console.log(
				`⏳ Rate limit protection: waiting ${delayMs}ms (counter: ${this.counter.toFixed(2)}/${this.limits.maxCounter})`,
			);

			await this.delay(delayMs);
			this.updateCounter();
		}

		this.counter += cost;
		console.log(
			`📊 Rate limiter: counter at ${this.counter.toFixed(2)}/${this.limits.maxCounter} (${this.limits.accountLevel} level)`,
		);
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	getStatus(): { counter: number; maxCounter: number; accountLevel: string } {
		this.updateCounter();
		return {
			counter: Math.round(this.counter * 100) / 100,
			maxCounter: this.limits.maxCounter,
			accountLevel: this.limits.accountLevel,
		};
	}
}

async function testRateLimiter() {
	const rateLimiter = new KrakenRateLimiter();

	console.log(`
🧪 TESTING KRAKEN RATE LIMITER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Configuration:
• Account Level: ${PRO_ACCOUNT.accountLevel}
• Max Counter: ${PRO_ACCOUNT.maxCounter}
• Decrease Rate: ${PRO_ACCOUNT.decreasePerSecond}/sec
• TradesHistory Cost: ${TRADES_HISTORY_COST}
• Theoretical Max Rate: ${(PRO_ACCOUNT.decreasePerSecond / TRADES_HISTORY_COST).toFixed(2)} requests/sec
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
	`);

	// Simulate rapid API calls
	for (let i = 1; i <= 12; i++) {
		console.log(`\n🔄 Making API call ${i}/12`);

		const startTime = Date.now();
		await rateLimiter.waitForRateLimit(TRADES_HISTORY_COST);
		const waitTime = Date.now() - startTime;

		console.log(`⚡ Call ${i} ready after ${waitTime}ms wait`);

		// Simulate actual API call (just a small delay)
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	console.log(`\n✅ Test completed!`);
	const finalStatus = rateLimiter.getStatus();
	console.log(
		`📊 Final counter: ${finalStatus.counter}/${finalStatus.maxCounter}`,
	);
}

// Run the test
testRateLimiter().catch(console.error);
