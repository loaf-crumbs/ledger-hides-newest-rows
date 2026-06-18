# ledger-hides-newest-rows

A Loaf crumb. Clone it, run it, find what's broken.

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## What you're looking at

A simple account ledger. It shows recent transactions, newest first, ten per page, with a pager at the bottom.

There are 25 transactions in the database. The newest one is today's Stripe payout. But open the page and that payout is nowhere to be seen — page one starts a week and a half in the past. Click through to the end and the last page is blank.

You can hit the API directly too:

```bash
curl 'http://localhost:3000/api/transactions?page=1'
```

## Files

```
app/page.js                       — the ledger UI (client component, pager)
app/api/transactions/route.js     — GET endpoint, one page at a time
app/components/TransactionRow.js  — a single row
lib/db.js                         — the fake data layer + pagination (read this closely)
```

Every transaction is present in the data. Count the rows you can actually reach.
