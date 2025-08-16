import { colors } from "#/apps/frontend/styles/colors";
import { Button } from "./Button";

export function Toolbar({
    loading,
    page,
    totalPages,
    onPrev,
    onNext,
    onRefresh,
}: {
    loading: boolean;
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    onRefresh: () => void;
}) {
    return (
        <div
            className="flex items-center justify-between px-3 py-2"
            style={{ borderBottom: `1px solid ${colors.line}` }}
        >
            <div className="flex items-center gap-2 text-sm" style={{ color: colors.textMuted }}>
                <span>Page</span>
                <span className="px-2 py-0.5 rounded" style={{ background: colors.sidebar, color: colors.text }}>
                    {page}
                </span>
                <span>/ {totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={onPrev} disabled={loading || page <= 1}>
                    ◀ Prev
                </Button>
                <Button onClick={onNext} disabled={loading || page >= totalPages}>
                    Next ▶
                </Button>
                <Button onClick={onRefresh} disabled={loading} variant="ghost">
                    ⟳ Refresh
                </Button>
            </div>
        </div>
    );
}