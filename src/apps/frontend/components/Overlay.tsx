import { colors } from "#/apps/frontend/styles/colors";

export interface OverlayProps {
	text: string;
}

export const Overlay = ({ text }: OverlayProps) => {
	return (
		<div
			className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow"
			style={{ background: colors.red, color: "#000" }}
		>
			{text}
		</div>
	);
};
