import { useState } from "react";
import { colors } from "#/apps/frontend/styles/colors";

export function JSONInspector({ data }: { data: any }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="mt-2">
            <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg"
                style={{ background: colors.panel, border: `1px solid ${colors.line}` }}
                onClick={() => setOpen((s) => !s)}
            >
                <span className="text-sm">{open ? "▼" : "▶"} JSON Inspector</span>
            </button>
            {open ? (
                <pre className="mt-2 text-xs p-3 rounded-lg overflow-auto max-h-72" style={{ background: colors.panel, border: `1px solid ${colors.line}` }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            ) : null}
        </div>
    );
}