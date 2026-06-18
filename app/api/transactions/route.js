import { NextResponse } from 'next/server'
import { getTransactions } from '@/lib/db'

const PAGE_SIZE = 10

// GET /api/transactions?page=1
// Returns one page of the ledger, newest transactions first.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? 1)

  const data = await getTransactions({ page, pageSize: PAGE_SIZE })
  return NextResponse.json(data)
}
