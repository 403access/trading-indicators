import { useState } from "react";
import { DetailsDrawer } from "#/apps/frontend/components/common/DetailsDrawer";
import type { Liability } from "#/apps/frontend/types/performance";
import { Input } from "../../ui/input";

export interface LiabilityAddDrawerProps<T> {
	open: boolean;
	onClose: () => void;
}
export function LiabilityAddDrawer({
	open,
	onClose,
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

	if (!open) return null;

	return (
		<DetailsDrawer<Liability>
			open={open}
			onClose={onClose}
			title={`New Liability`}
		>
			<table className="w-full">
				<tbody>
					<tr>
						<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
							Name
						</td>
						<td className="px-6 py-4">
							<Input
								value={liability.name}
								placeholder="Name der Verbindlichkeit"
								onChange={(e) =>
									setLiability({ ...liability, name: e.target.value })
								}
							/>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
							Betrag
						</td>
						<td className="px-6 py-4">
							<Input
								value={liability.amount}
								placeholder="Betrag der Verbindlichkeit"
								onChange={(e) =>
									setLiability({ ...liability, amount: Number(e.target.value) })
								}
							/>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
							Zinssatz
						</td>
						<td className="px-6 py-4">
							<Input
								value={liability.apr}
								placeholder="Zinssatz der Verbindlichkeit"
								onChange={(e) =>
									setLiability({ ...liability, apr: Number(e.target.value) })
								}
							/>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
							Laufzeit
						</td>
						<td className="px-6 py-4">
							<Input
								value={liability.termMonths}
								placeholder="Laufzeit der Verbindlichkeit"
								onChange={(e) =>
									setLiability({
										...liability,
										termMonths: Number(e.target.value),
									})
								}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</DetailsDrawer>
	);
}
