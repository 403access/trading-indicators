import { colors } from "#/apps/frontend/styles/colors";

export function Field({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "green" | "red" }) {
    const color = tone ? (colors as any)[tone] : colors.text;
    return (
        <div className="rounded-lg p-3" style={{ background: colors.sidebar, border: `1px solid ${colors.line}` }}>
            <div className="text-xs" style={{ color: colors.textMuted }}>{label}</div>
            <div className="mt-1 text-sm font-medium" style={{ color }}>{value}</div>
        </div>
    );
}
