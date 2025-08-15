import { randomInt } from "node:crypto";

export class Nonce {
	constructor(
		private last: bigint = 0n,
		private salt: bigint = BigInt(randomInt(0, 1000)),
	) {}

	next(): string {
		// microsecond-ish: ms*1000 + jitter
		const now = BigInt(Date.now()) * 1000n + this.salt;
		this.last = now > this.last ? now : this.last + 1n;
		return this.last.toString();
	}
}
