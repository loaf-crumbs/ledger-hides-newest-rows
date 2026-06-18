'use client'

import { useEffect, useState } from 'react'
import TransactionRow from '@/app/components/TransactionRow'

export default function ActivityPage() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  // Load the requested page whenever the user moves through the pager.
  useEffect(() => {
    let active = true
    setData(null)
    fetch(`/api/transactions?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((d) => {
        if (active) {
          setData(d)
          setError(null)
        }
      })
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [page])

  const rows = data?.rows ?? []
  const totalPages = data?.totalPages ?? 1
  const total = data?.total ?? 0

  // The "Showing X–Y of N" label for the current page.
  const firstRow = total === 0 ? 0 : (page - 1) * (data?.pageSize ?? 10) + 1
  const lastRow = firstRow + rows.length - 1

  return (
    <section className="activity">
      <div className="activity-head">
        <h1>Recent activity</h1>
        <span className="count">
          {total > 0 ? `Showing ${firstRow}–${lastRow} of ${total}` : '—'}
        </span>
      </div>

      {error && <p className="error">Couldn’t load activity: {error}</p>}

      <table className="ledger">
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th className="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          ) : (
            <tr>
              <td colSpan={3} className="empty">
                {data ? 'No transactions on this page.' : 'Loading…'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pager">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ← Newer
        </button>
        <span className="page-of">
          Page {page} of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Older →
        </button>
      </div>
    </section>
  )
}
