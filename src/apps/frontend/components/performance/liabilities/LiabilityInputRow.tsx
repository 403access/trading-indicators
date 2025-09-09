import { Input } from "#/apps/frontend/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/apps/frontend/components/ui/select";
import { colors } from "#/apps/frontend/styles/colors";
import type { Liability } from "#/apps/frontend/types/performance";

export interface LiabilityInputRowProps {
	label: string;
	property: keyof Liability;
	liability: Liability;
	setLiability: React.Dispatch<React.SetStateAction<Liability>>;
	placeholder: string;
	options?: string[];
}

export function LiabilityInputRow({
	label,
	property,
	liability,
	setLiability,
	placeholder,
	options,
}: LiabilityInputRowProps) {
	const rawValue = liability[property];
	const value =
		typeof rawValue === "string" || typeof rawValue === "number"
			? rawValue
			: "";

	return (
		<tr
			style={{
				padding: "12px",
				background: "rgb(30, 30, 30)",
			}}
		>
			<td
				className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
				style={{ color: colors.text }}
			>
				{label}
			</td>
			<td className="px-6 py-4">
				{options ? (
					<Select
						value={String(value)}
						onValueChange={(val: string) =>
							setLiability((prev: Liability) => ({
								...prev,
								[property]: val,
							}))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<Input
						autoComplete="off"
						id={String(property)}
						value={value}
						placeholder={placeholder}
						style={{
							background: "rgb(45, 45, 48)",
							color: colors.text,
						}}
						className="shadow-none focus-visible:outline-none transition-none focus-visible:ring-0 border-[#333333] focus-visible:border-[#414141]"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const val = e.target.value;
							setLiability((prev: Liability) => ({
								...prev,
								[property]: typeof value === "number" ? Number(val) : val,
							}));
						}}
					/>
				)}
			</td>
		</tr>
	);
}
