import logo from "#/apps/frontend/images/mock-trade-logo-1024x1024-transparent.png";
import { colors } from "#/apps/frontend/styles/colors";

export function Header() {
    return (
        <div
            className="w-full py-3 px-4 flex items-center gap-3 sticky top-0 z-10"
            style={{
                background: colors.panel,
                borderBottom: `1px solid ${colors.line}`,
            }}
        >
            <div
                className="h-3 w-3 rounded-full"
                style={{ background: colors.red }}
            />
            <div
                className="h-3 w-3 rounded-full"
                style={{ background: colors.yellow }}
            />
            <div
                className="h-3 w-3 rounded-full"
                style={{ background: colors.green }}
            />
            <span className="ml-2 font-semibold flex gap-2 items-center" style={{ color: colors.text }}>
                <img
                    src={logo}
                    alt="Mock.Trade"
                    className="h-8 w-8"
                />
                Mock.Trade
            </span>
            <span className="ml-auto text-sm" style={{ color: colors.textMuted }}>
                VS Code Dark UI
            </span>
            <span className="ml-auto text-sm" style={{ color: colors.textMuted }}>
                VS Code Dark UI
            </span>
        </div>
    );
}
