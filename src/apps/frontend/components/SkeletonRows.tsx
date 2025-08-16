import { colors } from "#/apps/frontend/styles/colors";

export function SkeletonRows() {
	return (
		<>
			{Array.from({ length: 10 }).map((_, i) => (
				<tr
					key={i}
					className="animate-pulse"
					style={{ borderBottom: `1px solid ${colors.line}` }}
				>
					{Array.from({ length: 10 }).map((__, j) => (
						<td key={j} className="px-3 py-2">
							<div
								className="h-4 w-24 rounded"
								style={{ background: colors.line }}
							/>
						</td>
					))}
				</tr>
			))}
		</>
	);
}
