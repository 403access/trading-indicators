import { colors } from "#/apps/frontend/styles/colors";

export interface DebugJSONProps {
	data: unknown;
}
export function DebugJSON({ data }: DebugJSONProps) {
	return (
		<section className="mt-6">
			<h4 className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
				Raw JSON
			</h4>
			<pre
				className="text-xs p-3 rounded-lg overflow-auto"
				style={{
					background: colors.sidebar,
					border: `1px solid ${colors.line}`,
				}}
			>
				{JSON.stringify(data)}
			</pre>
		</section>
	);
}
