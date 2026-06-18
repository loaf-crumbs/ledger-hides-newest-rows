// A single line in the ledger table. Credits show green, debits show muted.
export default function TransactionRow({ tx }) {
  const isCredit = tx.amount >= 0
  const formatted = `${isCredit ? '+' : '−'}$${Math.abs(tx.amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`

  return (
    <tr>
      <td className="date">{tx.date}</td>
      <td className="merchant">{tx.merchant}</td>
      <td className={isCredit ? 'amount credit' : 'amount'}>{formatted}</td>
    </tr>
  )
}
