#!/usr/bin/env bun
/**
 * Demo script to show the Kraken sync capabilities
 */

import { getDatabaseStats, getSyncState } from "#/packages/database";

function displayDatabaseInfo() {
	const stats = getDatabaseStats();
	const syncState = getSyncState();

	console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CURRENT DATABASE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 DATABASE STATISTICS:
   • Total Trades: ${stats.totalTrades}
   • Oldest Trade: ${stats.oldestTradeTime ? new Date(stats.oldestTradeTime * 1000).toISOString() : "N/A"}
   • Newest Trade: ${stats.newestTradeTime ? new Date(stats.newestTradeTime * 1000).toISOString() : "N/A"}

🔄 SYNC STATUS:
   • Last Sync: ${syncState ? new Date(syncState.lastSyncTimestamp).toISOString() : "Never"}
   • Sync Count: ${syncState?.totalTradesCount || 0}
   
🕐 TIME RANGE:
   • Duration: ${
			stats.oldestTradeTime && stats.newestTradeTime
				? `${Math.round((stats.newestTradeTime - stats.oldestTradeTime) / (24 * 3600))} days`
				: "N/A"
		}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

displayDatabaseInfo();
