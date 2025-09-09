import { colors } from "#/apps/frontend/styles/colors";

export type TaxesPageProps = {};

export function TaxesPage(props: TaxesPageProps) {
	return (
		<div className="min-h-screen p-6" style={{ background: colors.bg }}>
			<div className="max-w-7xl mx-auto space-y-6">
				<div>Taxes Page</div>
			</div>
		</div>
	);
}
