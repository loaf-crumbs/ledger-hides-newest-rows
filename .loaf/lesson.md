# Why page one started ten rows too late

## What you saw

Twenty-five transactions in the database, ten to a page. The header said "Showing 1–10 of 25," but page one actually opened on the *eleventh* newest row. Today's payout and the nine entries behind it were unreachable, and clicking through to the end produced a blank final page — a whole page of nothing.

Curl the endpoint and the data layer confirms it:

```
GET /api/transactions?page=1  ->  rows t-15 … t-06   (should be t-25 … t-16)
GET /api/transactions?page=2  ->  rows t-05 … t-01
GET /api/transactions?page=3  ->  rows []            (empty)
```

The newest ten rows are gone, and there's a phantom third page. Every visible row is correct; the *window* is just shifted by exactly one page.

## What's actually happening

It's one line in `lib/db.js`:

```js
const start = page * pageSize
const end = start + pageSize
const rows = TRANSACTIONS.slice(start, end)
```

The pager is **1-based** — its first page is labelled "Page 1" and sends `?page=1`. But `slice` is **0-based**: the first row lives at index `0`. Multiplying a 1-based page by the page size assumes page numbers start at `0`, so every page lands one full window too far down the list:

| page | `page * pageSize` | rows you get | rows you wanted |
|------|-------------------|--------------|-----------------|
| 1    | `1 * 10 = 10`     | index 10–19  | index 0–9       |
| 2    | `2 * 10 = 20`     | index 20–24  | index 10–19     |
| 3    | `3 * 10 = 30`     | index 30+ → **empty** | index 20–24 |

Page 1 begins at offset 10, so the first ten rows (the newest) are never served. And because the offset is always one page ahead, the code keeps going one page past the real end — `totalPages` is correctly `3`, but page 3 slices from index 30, off the end of a 25-row array, and `slice` happily returns `[]`. That's your blank page.

Notice the bug is *silent*. `slice` never throws when the start index is past the end — it just returns an empty array. No error, no 500, no warning. The only symptom is data quietly missing from one end and an empty page on the other.

## The fix

Map the 1-based page number to a 0-based offset by subtracting one before multiplying:

```js
const start = (page - 1) * pageSize
const end = start + pageSize
const rows = TRANSACTIONS.slice(start, end)
```

Now page 1 starts at offset `0`, page 2 at `10`, page 3 at `20` (returning the last five rows), and there's no page 4 to come back empty. The `(page - 1) * pageSize` form is the canonical one-based-page-to-zero-based-offset conversion, and it's exactly what you'd write against a database too:

```sql
SELECT * FROM transactions
ORDER BY created_at DESC
LIMIT 10 OFFSET (:page - 1) * 10;
```

The same `- 1` belongs in any spot that turns a human page number into an offset — including the "Showing X–Y of N" label, which is why the UI computes its first row as `(page - 1) * pageSize + 1`.

## The bug class: off-by-one at the fencepost

This is a classic **off-by-one** (a "fencepost" error): a boundary calculation that's correct in shape but shifted by one because two systems disagree about where counting starts. Here a **1-based** page index met a **0-based** array offset, and nobody reconciled them.

Pagination is where this bug lives most often, because almost every pager shows pages starting at 1 while every array, slice, and SQL `OFFSET` starts at 0. The favourite variations:

- **`page * pageSize` instead of `(page - 1) * pageSize`** — what happened here. The first page is skipped and an extra empty page appears at the end.
- **The mirror image:** treating `page` as already 0-based in the URL, so the user's "page 1" link silently shows page 2's data.
- **`OFFSET page * limit` in SQL** — identical mistake, identical symptom, just in the query.
- **Boundary `<` vs `<=`** when computing total pages, which adds or drops a final page.

How to spot it in the wild:

- The *first* or the *last* page is wrong while the middle pages look fine — off-by-one errors bite hardest at the edges.
- A row goes missing from one end of a list, or a stray empty page appears at the other.
- The "showing X–Y of N" count disagrees with the rows actually on screen — that label is computed from the same offset, so it drifts in lockstep with the bug.

The mental model: **a page number is 1-based for humans and 0-based for machines; convert exactly once, with `(page - 1) * pageSize`, and do it the moment the page number becomes an offset.** Any time you see a raw `page * pageSize`, pause and ask what the first page number is — if it's 1, you've probably found one.
