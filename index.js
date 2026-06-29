/**
 * RepuPilot Reddit Scanner — Render Cron Job entry point
 * Runs one full cycle across all feeds, writes signals to Railway Postgres, then exits.
 * Scheduled via render.yaml: every 2 hours
 */
require('dotenv').config();
const { runOnce, seedSeenCache } = require('./src/scanner/scheduler');
const db = require('./src/db');
const log = require('./src/logger');

async function main() {
  log('Scanner starting...');
  await seedSeenCache();
  await runOnce();
  log('Scanner cycle complete. Exiting.');
  await db.end();
  process.exit(0);
}

main().catch(err => {
  console.error('Scanner fatal error:', err.message);
  process.exit(1);
});
