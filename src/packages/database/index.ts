/**
 * Database module for storing and retrieving trading data using SQLite
 */
import { Database } from "bun:sqlite";
import type { Trade } from "#/packages/kraken";

// Database row interface
interface TradeRow {
	id: string;
	ordertxid: string;
	postxid: string | null;
	pair: string;
	time: number;
	type: string;
	ordertype: string;
	price: string;
	cost: string;
	fee: string;
	vol: string;
	margin: string;
	leverage: string | null;
	misc: string | null;
	trade_id: number | null;
	maker: number;
	poststatus: string | null;
	cprice: number | null;
	ccost: number | null;
	cfee: number | null;
	cvol: number | null;
	cmargin: number | null;
	net: number | null;
	ledgers: string | null;
	trades: string | null;
	created_at: number;
	updated_at: number;
}

interface SyncStateRow {
	id: number;
	last_sync_timestamp: number;
	last_trade_id: string | null;
	total_trades_count: number;
	created_at: number;
	updated_at: number;
}

// Database file path
const DB_PATH = "./data/trades.db";

// Initialize database connection
export const db = new Database(DB_PATH, { create: true });

// Enable WAL mode for better performance
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA synchronous = NORMAL;");
db.exec("PRAGMA foreign_keys = ON;");

/**
 * Database schema for trades
 */
const CREATE_TRADES_TABLE = `
  CREATE TABLE IF NOT EXISTS trades (
    id TEXT PRIMARY KEY,
    ordertxid TEXT NOT NULL,
    postxid TEXT,
    pair TEXT NOT NULL,
    time INTEGER NOT NULL,
    type TEXT NOT NULL,
    ordertype TEXT NOT NULL,
    price TEXT NOT NULL,
    cost TEXT NOT NULL,
    fee TEXT NOT NULL,
    vol TEXT NOT NULL,
    margin TEXT NOT NULL,
    leverage TEXT,
    misc TEXT,
    trade_id INTEGER,
    maker BOOLEAN,
    poststatus TEXT,
    cprice REAL,
    ccost REAL,
    cfee REAL,
    cvol REAL,
    cmargin REAL,
    net REAL,
    ledgers TEXT, -- JSON array as string
    trades TEXT,  -- JSON array as string
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  )
`;

const CREATE_TRADES_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_trades_time ON trades(time);
  CREATE INDEX IF NOT EXISTS idx_trades_pair ON trades(pair);
  CREATE INDEX IF NOT EXISTS idx_trades_type ON trades(type);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_trades_trade_id ON trades(trade_id);
`;

const CREATE_SYNC_STATE_TABLE = `
  CREATE TABLE IF NOT EXISTS sync_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    last_sync_timestamp INTEGER NOT NULL,
    last_trade_id TEXT,
    total_trades_count INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  )
`;

// Initialize database tables
export function initializeDatabase() {
	try {
		db.exec(CREATE_TRADES_TABLE);
		db.exec(CREATE_TRADES_INDEX);
		db.exec(CREATE_SYNC_STATE_TABLE);

		// Initialize sync state if it doesn't exist
		const syncState = db.prepare("SELECT * FROM sync_state WHERE id = 1").get();
		if (!syncState) {
			db.prepare(`
        INSERT INTO sync_state (id, last_sync_timestamp, total_trades_count) 
        VALUES (1, 0, 0)
      `).run();
		}

		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Error initializing database:", error);
		throw error;
	}
}

/**
 * Insert or update trades in the database
 */
export function upsertTrades(trades: { [key: string]: Trade }): number {
	const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO trades (
      id, ordertxid, postxid, pair, time, type, ordertype, price, cost, fee,
      vol, margin, leverage, misc, trade_id, maker, poststatus, cprice, ccost,
      cfee, cvol, cmargin, net, ledgers, trades, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, unixepoch()
    )
  `);

	let insertedCount = 0;

	for (const [id, trade] of Object.entries(trades)) {
		try {
			insertStmt.run(
				id,
				trade.ordertxid,
				trade.postxid || null,
				trade.pair,
				trade.time,
				trade.type,
				trade.ordertype,
				trade.price,
				trade.cost,
				trade.fee,
				trade.vol,
				trade.margin,
				trade.leverage || null,
				trade.misc || null,
				trade.trade_id || null,
				trade.maker ? 1 : 0,
				trade.poststatus || null,
				trade.cprice || null,
				trade.ccost || null,
				trade.cfee || null,
				trade.cvol || null,
				trade.cmargin || null,
				trade.net || null,
				trade.ledgers ? JSON.stringify(trade.ledgers) : null,
				trade.trades ? JSON.stringify(trade.trades) : null,
			);
			insertedCount++;
		} catch (error) {
			console.error(`Error inserting trade ${id}:`, error);
		}
	}

	return insertedCount;
}

/**
 * Get trades from database with pagination and filtering
 */
export function getTrades(
	options: {
		offset?: number;
		limit?: number;
		pair?: string;
		type?: string;
		startTime?: number;
		endTime?: number;
	} = {},
): { trades: { [key: string]: Trade }; count: number } {
	const { offset = 0, limit = 50, pair, type, startTime, endTime } = options;

	let whereClause = "WHERE 1=1";
	const params: (string | number)[] = [];

	if (pair) {
		whereClause += " AND pair LIKE ?";
		params.push(`%${pair}%`);
	}

	if (type && type !== "all") {
		whereClause += " AND type = ?";
		params.push(type);
	}

	if (startTime) {
		whereClause += " AND time >= ?";
		params.push(startTime);
	}

	if (endTime) {
		whereClause += " AND time <= ?";
		params.push(endTime);
	}

	// Get count
	const countStmt = db.prepare(
		`SELECT COUNT(*) as count FROM trades ${whereClause}`,
	);
	const countResult = countStmt.get(...params) as { count: number };
	const totalCount = countResult.count;

	// Get trades with pagination
	const tradesStmt = db.prepare(`
    SELECT * FROM trades 
    ${whereClause}
    ORDER BY time DESC
    LIMIT ? OFFSET ?
  `);

	const rows = tradesStmt.all(...params, limit, offset) as TradeRow[];

	const trades: { [key: string]: Trade } = {};

	for (const row of rows) {
		trades[row.id] = {
			ordertxid: row.ordertxid,
			postxid: row.postxid || "",
			pair: row.pair,
			time: row.time,
			type: row.type as "buy" | "sell",
			ordertype: row.ordertype,
			price: row.price,
			cost: row.cost,
			fee: row.fee,
			vol: row.vol,
			margin: row.margin,
			leverage: row.leverage || "",
			misc: row.misc || "",
			trade_id: row.trade_id || 0,
			maker: Boolean(row.maker),
			poststatus: (row.poststatus as "open" | "closed") || "open",
			cprice: row.cprice || 0,
			ccost: row.ccost || 0,
			cfee: row.cfee || 0,
			cvol: row.cvol || 0,
			cmargin: row.cmargin || 0,
			net: row.net || 0,
			ledgers: row.ledgers ? JSON.parse(row.ledgers) : [],
			trades: row.trades ? JSON.parse(row.trades) : [],
		};
	}

	return { trades, count: totalCount };
}

/**
 * Get the latest trade timestamp from database
 */
export function getLatestTradeTimestamp(): number {
	const stmt = db.prepare("SELECT MAX(time) as latest_time FROM trades");
	const result = stmt.get() as { latest_time: number | null };
	return result.latest_time || 0;
}

/**
 * Update sync state
 */
export function updateSyncState(
	lastSyncTimestamp: number,
	lastTradeId?: string,
) {
	const stmt = db.prepare(`
    UPDATE sync_state 
    SET last_sync_timestamp = ?, last_trade_id = ?, updated_at = unixepoch()
    WHERE id = 1
  `);
	stmt.run(lastSyncTimestamp, lastTradeId || null);
}

/**
 * Get sync state
 */
export function getSyncState(): {
	lastSyncTimestamp: number;
	lastTradeId: string | null;
	totalTradesCount: number;
} | null {
	const stmt = db.prepare("SELECT * FROM sync_state WHERE id = 1");
	const result = stmt.get() as SyncStateRow | undefined;

	if (!result) return null;

	return {
		lastSyncTimestamp: result.last_sync_timestamp,
		lastTradeId: result.last_trade_id,
		totalTradesCount: result.total_trades_count,
	};
}

/**
 * Update total trades count
 */
export function updateTradesCount() {
	const countStmt = db.prepare("SELECT COUNT(*) as count FROM trades");
	const result = countStmt.get() as { count: number };

	const updateStmt = db.prepare(`
    UPDATE sync_state 
    SET total_trades_count = ?, updated_at = unixepoch()
    WHERE id = 1
  `);
	updateStmt.run(result.count);
}

/**
 * Get database statistics
 */
export function getDatabaseStats() {
	const tradesCount = db
		.prepare("SELECT COUNT(*) as count FROM trades")
		.get() as { count: number };
	const oldestTrade = db
		.prepare("SELECT MIN(time) as oldest FROM trades")
		.get() as { oldest: number | null };
	const newestTrade = db
		.prepare("SELECT MAX(time) as newest FROM trades")
		.get() as { newest: number | null };
	const syncState = getSyncState();

	return {
		totalTrades: tradesCount.count,
		oldestTradeTime: oldestTrade.oldest,
		newestTradeTime: newestTrade.newest,
		syncState,
	};
}
