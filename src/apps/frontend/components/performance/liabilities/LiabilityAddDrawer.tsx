import { useState } from "react";
import { DetailsDrawer } from "#/apps/frontend/components/common/DetailsDrawer";
import type { Liability } from "#/apps/frontend/types/performance";
import { Button } from "../../Button";
import { LiabilityInputRow } from "./LiabilityInputRow";

export interface LiabilityAddDrawerProps<T> {
	open: boolean;
	onClose: () => void;
	onAdd: (liability: T) => void;
}
export function LiabilityAddDrawer({
	open,
	onClose,
	onAdd,
}: LiabilityAddDrawerProps<Liability>) {
	const [liability, setLiability] = useState<Liability>({
		id: "",
		name: "",
		type: "loan",
		amount: 0,
		apr: 0,
		installmentEur: 0,
		termMonths: 0,
		startDate: 0,
		currentPrincipalEur: 0,
		amortization: [],
	});

	const fields = [
		{
			label: "Name",
			property: "name",
			placeholder: "Name der Verbindlichkeit",
		},
		{
			label: "Zinsart",
			property: "type",
			placeholder: "Art der Verbindlichkeit",
			options: ["loan", "cc", "broker"],
		},
		{
			label: "Betrag",
			property: "amount",
			placeholder: "Betrag der Verbindlichkeit",
		},
		{
			label: "Zinssatz",
			property: "apr",
			placeholder: "Zinssatz der Verbindlichkeit",
		},
		{
			label: "Rate",
			property: "installmentEur",
			placeholder: "Monatliche Rate der Verbindlichkeit",
		},
		{
			label: "Laufzeit",
			property: "termMonths",
			placeholder: "Laufzeit der Verbindlichkeit",
		},
		{
			label: "Startdatum",
			property: "startDate",
			placeholder: "Startdatum der Verbindlichkeit (Timestamp)",
		},
		// {
		//     label: "Restschuld",
		//     property: "currentPrincipalEur",
		//     placeholder: "Aktuelle Restschuld der Verbindlichkeit",
		// },
	];

	// Helper to extract union values from a value (for dropdowns)
	function getUnionOptions(val: unknown): string[] {
		if (val === undefined || val === null) return [];
		// If the value is a string, try to get all possible values from its constructor
		// This works for enums and unions if the initial value is set
		if (typeof val === "string") {
			// If the value is a string, try to get all possible values from the type
			// @ts-ignore
			if (Array.isArray((val as any).constructor.values)) {
				// Enum with static values
				// @ts-ignore
				return (val as any).constructor.values();
			}
			// Otherwise, try to infer from the initial value (not perfect, but works for union types)
			// For union types, we can only get the current value, so fallback to a default set if needed
			// In practice, you should pass the options array in the config for full type safety
			// Here, we fallback to the current value only
			return [val];
		}
		return [];
	}

	if (!open) return null;

	const onClickAdd = () => {
		onAdd({
			...liability,
			// id: crypto.randomUUID(),
			currentPrincipalEur: liability.amount,
			startDate: liability.startDate || Math.floor(Date.now() / 1000),
		});
	};

	return (
		<DetailsDrawer<Omit<Liability, "id">>
			open={open}
			onClose={onClose}
			title="New Liability"
		>
			<table className="w-full">
				<tbody>
					{fields.map((field) => (
						<LiabilityInputRow
							key={field.property}
							label={field.label}
							property={field.property as keyof Liability}
							liability={liability}
							setLiability={setLiability}
							placeholder={field.placeholder}
							options={"options" in field ? field.options : undefined}
						/>
					))}
				</tbody>
			</table>

			<div className="mt-2">
				<button
					type="button"
					onClick={onClickAdd}
					className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
				>
					Hinzufügen
				</button>
			</div>
		</DetailsDrawer>
	);
}
