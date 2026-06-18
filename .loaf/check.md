# Run: npm install && npm run dev  (default port 3000)
# API shape: GET /api/transactions?page=N -> { rows, page, pageSize, total, totalPages }

- GET /api/transactions?page=1 returns 200 with rows.length === 10
- On page 1, rows[0].id === "t-25" (the newest transaction) — page one starts at the top of the ledger, not partway down
- totalPages === 3 for 25 rows at pageSize 10
- GET ?page=3 (the last page) returns rows.length === 5 and is NOT empty; it ends with the oldest row, id === "t-01"
- Concatenating rows across pages 1..3 yields all 25 ids exactly once — none skipped, none duplicated
- No page within 1..totalPages returns an empty rows array
- Loading http://localhost:3000 shows today's payout (t-25) at the top of page 1, and the "Showing 1–10 of 25" label matches the visible rows
