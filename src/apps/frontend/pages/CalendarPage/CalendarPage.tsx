import { colors } from "#/apps/frontend/styles/colors";

export type CalendarPageProps = {};
export function CalendarPage(props: CalendarPageProps) {
	return (
		<div className="min-h-screen p-6" style={{ background: colors.bg }}>
			<div className="max-w-7xl mx-auto space-y-6">
				<div>Calendar Page</div>
			</div>
		</div>
	);
}
