const upperBound = 250;
const lowerBound = 50;

const currentPrice = 200;

const timeHorizonInDays = 360;

const simulateDecreasingPrices = () => {
	return Array(timeHorizonInDays)
		.fill(0)
		.map((_, index) => 200 - (index + 1) * 1);
};

const simulateSinusoidalPrices = () => {
	return Array(timeHorizonInDays)
		.fill(0)
		.map((_, index) => {
			const angle = (index / timeHorizonInDays) * Math.PI * 2;
			return 100 + 50 * Math.sin(angle);
		});
};

const simulatedPrices = simulateDecreasingPrices();
console.log("Simulated Prices:", simulatedPrices);

const simulatedSinusoidalPrices = simulateSinusoidalPrices();
console.log("Simulated Sinusoidal Prices:", simulatedSinusoidalPrices);
