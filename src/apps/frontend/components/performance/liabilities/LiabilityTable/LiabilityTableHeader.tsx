import { colors } from "#/apps/frontend/styles/colors";

export type LiabilityTableHeaderProps = {};
export function LiabilityTableHeader(props: LiabilityTableHeaderProps) {
	return (
		<thead style={{ background: colors.sidebar }}>
			<tr>
				<th
					className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					style={{
						color: colors.textMuted,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					Name
				</th>
				<th
					className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					style={{
						color: colors.textMuted,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					Typ
				</th>
				<th
					className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					style={{
						color: colors.textMuted,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					APR
				</th>
				<th
					className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					style={{
						color: colors.textMuted,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					Rate €
				</th>
				<th
					className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					style={{
						color: colors.textMuted,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					Restschuld €
				</th>
				<th
					className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					style={{
						color: colors.textMuted,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					Fälligkeit
				</th>
				<th
					className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					style={{
						color: colors.textMuted,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					Nächste Zahlung
				</th>
				<th
					className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
					style={{
						color: colors.textMuted,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					Zinsen YTD €
				</th>
			</tr>
		</thead>
	);
}
