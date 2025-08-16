import { colors } from "#/apps/frontend/styles/colors";

export function Button({
    children,
    onClick,
    disabled,
    variant = "solid",
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "solid" | "ghost";
}) {
    const base =
        "px-3 py-1.5 rounded-lg text-sm transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
    const styles: Record<string, React.CSSProperties> = {
        solid: { background: colors.blue, color: "#fff" },
        ghost: { background: "transparent", color: colors.text, border: `1px solid ${colors.line}` },
    };
    return (
        <button type="button" className={base} style={styles[variant]} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}