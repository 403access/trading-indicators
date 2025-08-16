import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const fmt = {
	date: (ts: number) => new Date(ts * 1000).toLocaleString(),
	money: (n?: number | string) => {
		if (n == null) return "-";
		const x = typeof n === "string" ? parseFloat(n) : n;
		if (Number.isNaN(x)) return String(n);
		return x.toLocaleString(undefined, { maximumFractionDigits: 8 });
	},
	base: (n?: number | string) => fmt.money(n),
};
