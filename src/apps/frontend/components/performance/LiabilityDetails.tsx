import type { Liability } from "../../types/performance";

interface LiabilityDetailsProps {
	liability: Liability;
	onClose: () => void;
}

export function LiabilityDetails({
	liability,
	onClose,
}: LiabilityDetailsProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold">Details: {liability.name}</h3>
				<button
					type="button"
					onClick={onClose}
					className="text-gray-400 hover:text-gray-600"
				>
					✕
				</button>
			</div>

			{/* Basic Information Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div>
					<div className="text-sm text-gray-500">Typ</div>
					<div className="font-medium">{liability.type}</div>
				</div>
				<div>
					<div className="text-sm text-gray-500">APR</div>
					<div className="font-medium">{(liability.apr * 100).toFixed(2)}%</div>
				</div>
				<div>
					<div className="text-sm text-gray-500">Laufzeit</div>
					<div className="font-medium">{liability.termMonths} Monate</div>
				</div>
				<div>
					<div className="text-sm text-gray-500">Restschuld</div>
					<div className="font-medium">
						{new Intl.NumberFormat("de-DE", {
							style: "currency",
							currency: "EUR",
						}).format(liability.currentPrincipalEur)}
					</div>
				</div>
			</div>

			{/* Amortization Schedule */}
			{liability.amortization && liability.amortization.length > 0 && (
				<div className="mt-6">
					<h4 className="text-md font-medium mb-3">Tilgungsplan</h4>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-3 py-2 text-left">Datum</th>
									<th className="px-3 py-2 text-left">Tilgung</th>
									<th className="px-3 py-2 text-left">Zinsen</th>
									<th className="px-3 py-2 text-left">Rate</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{liability.amortization.slice(0, 10).map((entry, index) => (
									<tr key={`${entry.t}-${index}`}>
										<td className="px-3 py-2">
											{new Intl.DateTimeFormat("de-DE").format(
												new Date(entry.t),
											)}
										</td>
										<td className="px-3 py-2">
											{new Intl.NumberFormat("de-DE", {
												style: "currency",
												currency: "EUR",
											}).format(entry.principal)}
										</td>
										<td className="px-3 py-2">
											{new Intl.NumberFormat("de-DE", {
												style: "currency",
												currency: "EUR",
											}).format(entry.interest)}
										</td>
										<td className="px-3 py-2">
											{new Intl.NumberFormat("de-DE", {
												style: "currency",
												currency: "EUR",
											}).format(entry.payment)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
