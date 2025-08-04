import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect, useState } from 'react'

type Transaction = {
  id: number
  user_id: number
  account_id: number
  category_id: number
  amount: string
  type: string
  description: string
  transaction_date: string
}

export default function ViewTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const axiosPrivate = useAxiosPrivate()

  // Hardcoded user_id=1 for demo; replace as needed

  useEffect(() => {
    setLoading(true)
    setError('')
    const getTransactions = async () => {
      try {
        const res = await axiosPrivate.get('/transactions/recent')

        setTransactions(res.data)
      } catch (error) {
        setError(
          typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message?: unknown }).message)
            : 'An error occurred',
        )
      } finally {
        setLoading(false)
      }
    }
    getTransactions()
  }, [refresh])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this transaction?')) return
    const res = await axiosPrivate.delete(`/transactions/delete`, {
      data: { id },
    })
    if (res.status === 200) {
      setRefresh((r) => r + 1)
    } else {
      alert('Failed to delete transaction')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Transactions</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="p-2 border">{tx.amount}</td>
              <td className="p-2 border">{tx.type}</td>
              <td className="p-2 border">{tx.description}</td>
              <td className="p-2 border">
                {tx.transaction_date?.slice(0, 10)}
              </td>
              <td className="p-2 border">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(tx.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && !loading && (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
