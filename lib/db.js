// A small in-process stand-in for the transactions table. In production these
// rows live in Postgres and come back already sorted newest-first; here we keep
// a fixed list in the same order so the page is deterministic to work with.
//
// `seq` is the row's position in time: 25 is the most recent transaction, 1 is
// the oldest. The array is stored newest-first, exactly how the query returns it.

const TRANSACTIONS = [
  { id: 't-25', seq: 25, date: '2026-06-18', merchant: 'Stripe payout', amount: 4820.0 },
  { id: 't-24', seq: 24, date: '2026-06-18', merchant: 'AWS', amount: -512.33 },
  { id: 't-23', seq: 23, date: '2026-06-17', merchant: 'Figma', amount: -45.0 },
  { id: 't-22', seq: 22, date: '2026-06-17', merchant: 'Customer — Acme Co', amount: 1200.0 },
  { id: 't-21', seq: 21, date: '2026-06-16', merchant: 'Vercel', amount: -20.0 },
  { id: 't-20', seq: 20, date: '2026-06-16', merchant: 'GitHub', amount: -21.0 },
  { id: 't-19', seq: 19, date: '2026-06-15', merchant: 'Customer — Bolt Ltd', amount: 640.0 },
  { id: 't-18', seq: 18, date: '2026-06-15', merchant: 'Notion', amount: -16.0 },
  { id: 't-17', seq: 17, date: '2026-06-14', merchant: 'Datadog', amount: -89.5 },
  { id: 't-16', seq: 16, date: '2026-06-13', merchant: 'Customer — Pine Inc', amount: 980.0 },
  { id: 't-15', seq: 15, date: '2026-06-12', merchant: 'Cloudflare', amount: -25.0 },
  { id: 't-14', seq: 14, date: '2026-06-12', merchant: 'Slack', amount: -75.0 },
  { id: 't-13', seq: 13, date: '2026-06-11', merchant: 'Customer — Vale LLC', amount: 2300.0 },
  { id: 't-12', seq: 12, date: '2026-06-10', merchant: 'Google Workspace', amount: -36.0 },
  { id: 't-11', seq: 11, date: '2026-06-09', merchant: 'Linear', amount: -32.0 },
  { id: 't-10', seq: 10, date: '2026-06-09', merchant: 'Customer — Reef Co', amount: 410.0 },
  { id: 't-09', seq: 9, date: '2026-06-08', merchant: 'Postmark', amount: -15.0 },
  { id: 't-08', seq: 8, date: '2026-06-07', merchant: 'Sentry', amount: -29.0 },
  { id: 't-07', seq: 7, date: '2026-06-06', merchant: 'Customer — Oak Group', amount: 1750.0 },
  { id: 't-06', seq: 6, date: '2026-06-05', merchant: 'AWS', amount: -498.12 },
  { id: 't-05', seq: 5, date: '2026-06-04', merchant: 'Fly.io', amount: -18.0 },
  { id: 't-04', seq: 4, date: '2026-06-03', merchant: 'Customer — Mesa Co', amount: 520.0 },
  { id: 't-03', seq: 3, date: '2026-06-02', merchant: '1Password', amount: -8.0 },
  { id: 't-02', seq: 2, date: '2026-06-01', merchant: 'Customer — Birch Ltd', amount: 1340.0 },
  { id: 't-01', seq: 1, date: '2026-05-31', merchant: 'Domain renewal', amount: -22.0 },
]

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Return one page of transactions, newest first, plus the metadata the UI needs
// to render its pager (total count and how many pages there are).
export async function getTransactions({ page, pageSize }) {
  await delay(80)

  const total = TRANSACTIONS.length
  const totalPages = Math.ceil(total / pageSize)

  // Slice out the window of rows for the requested page.
  const start = page * pageSize
  const end = start + pageSize
  const rows = TRANSACTIONS.slice(start, end)

  return { rows, page, pageSize, total, totalPages }
}
