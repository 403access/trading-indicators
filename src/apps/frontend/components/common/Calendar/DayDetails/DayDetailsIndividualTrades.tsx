import { colors } from "#/apps/frontend/styles/colors";
import type { Trade } from "#/packages/kraken";
import type { DayData } from "../CalendarDay";

export interface DayDetailsIndividualTradesProps {
	dayData: DayData;
	onTradeSelect: (trade: Trade) => void;
	formatCurrency: (amount: number) => string;
}

export function DayDetailsIndividualTrades({
	dayData,
	onTradeSelect,
	formatCurrency,
}: DayDetailsIndividualTradesProps) {
	return (
		<div
			style={{
				padding: "12px",
				borderRadius: "4px",
				background: colors.panel,
				border: `1px solid ${colors.line}`,
			}}
		>
			<div
				style={{
					fontSize: "14px",
					fontWeight: "600",
					marginBottom: "8px",
					color: colors.text,
				}}
			>
				Individual Trades (click to view details)
			</div>
			<div style={{ maxHeight: "200px", overflowY: "auto" }}>
				{dayData.trades.map((trade, index) => (
					<button
						key={`${trade.time}_${index}`}
						type="button"
						onClick={() => onTradeSelect(trade)}
						style={{
							width: "100%",
							padding: "8px",
							marginBottom: "4px",
							borderRadius: "4px",
							border: `1px solid ${colors.line}`,
							cursor: "pointer",
							transition: "background-color 0.2s",
							background: colors.bg,
							textAlign: "left",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = colors.sidebar;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = colors.bg;
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<div>
								<span
									style={{
										fontWeight: "500",
										color: colors.text,
									}}
								>
									{trade.pair}
								</span>
								<span
									style={{
										marginLeft: "8px",
										padding: "2px 6px",
										borderRadius: "4px",
										fontSize: "12px",
										background:
											trade.type === "buy" ? colors.blue : colors.yellow,
										color: colors.text,
									}}
								>
									{trade.type.toUpperCase()}
								</span>
							</div>
							<div
								style={{
									fontSize: "14px",
									fontWeight: "500",
									color: (trade.net || 0) >= 0 ? colors.green : colors.red,
								}}
							>
								{formatCurrency(trade.net || 0)}
							</div>
						</div>
						<div
							style={{
								fontSize: "12px",
								color: colors.textMuted,
								marginTop: "4px",
							}}
						>
							{new Date(trade.time * 1000).toLocaleTimeString()} • Vol:{" "}
							{trade.vol} • Price: ${trade.price}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
