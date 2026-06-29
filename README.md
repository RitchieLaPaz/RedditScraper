# RepuPilot Reddit Scanner

Standalone cron job — runs every 2 hours, scans 29 RSS feeds, writes signals to PostgreSQL.

## Structure

```
repupilot-scanner/
├── index.js                  ← entry point
├── package.json
├── render.yaml               ← cron job config (Render)
└── src/
    ├── db.js                 ← PostgreSQL connection
    ├── logger.js             ← console logger
    └── scanner/
        ├── feeds.js          ← 29 RSS feed URLs
        ├── classifier.js     ← Claude Haiku classifier
        └── scheduler.js      ← single-cycle runner
```

## Deploy

1. Push this repo to GitHub
2. Go to render.com → New → Blueprint → connect this repo
3. Render reads `render.yaml` and auto-configures the cron job
4. Add environment variables in the Render dashboard (see below)

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude Haiku classifier |
| `REDDIT_RSS_USER` | Reddit RSS user token (from reddit.com/prefs/feeds) |
| `REDDIT_RSS_TOKEN` | Reddit RSS feed token (from reddit.com/prefs/feeds) |
| `SCANNER_WEBHOOK_KEY` | Shared secret for webhook authentication |
| `REPUPILOT_WEBHOOK_URL` | Base URL of your RepuPilot instance |

All values should be set as environment variables — never hardcoded.

## How it works

- Cron runs `node index.js` every 2 hours
- Seeds seen-post cache from DB to avoid reprocessing
- Fetches up to 10 posts per feed with 15s stagger between requests
- Claude Haiku classifies brand mentions — sentiment, urgency, suggested response
- Signals saved to PostgreSQL — urgency 7+ fires a real-time webhook
- Script exits cleanly after each cycle

## Cost

Free tier on Render covers this usage comfortably.
