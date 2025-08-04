import { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

type Category = {
  id: number
  name: string
  type: string
  is_default: boolean
  user_id: number | null
}

export default function SubmitTransaction() {
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<{ id: number; name: string }[]>([])
  const [form, setForm] = useState({
    account_id: '',
    category_id: '',
    amount: '',
    type: 'expense',
    description: '',
    transaction_date: '',
  })
  const [message, setMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axiosPrivate.get('/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()

    // Fetch accounts when user_id changes
    const fetchAccounts = async () => {
      try {
        const response = await axiosPrivate.get(`/accounts/all`)
        setAccounts(response.data)
      } catch (error) {
        console.error('Error fetching accounts:', error)
      }
    }

    fetchAccounts()
  }, [])

  // Format number to Indian style
  const formatIndianNumber = (value: string) => {
    const num = value.replace(/,/g, '')
    if (!num || isNaN(Number(num))) return value
    const [integer, decimal] = num.split('.')
    let lastThree = integer.slice(-3)
    let otherNumbers = integer.slice(0, -3)
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree
    }
    const formatted =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
      lastThree +
      (decimal ? '.' + decimal : '')
    return formatted
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    if (name === 'amount') {
      // Format as user types
      const raw = value.replace(/,/g, '')
      setForm({ ...form, amount: formatIndianNumber(raw) })
    } else if (name === 'category_id') {
      const selectedCat = categories.find((cat) => cat.id === Number(value))
      setForm((prev) => ({
        ...prev,
        category_id: value,
        type: selectedCat ? selectedCat.type : prev.type,
      }))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      const response = await axiosPrivate.post(
        '/transactions/submit',
        JSON.stringify({
          ...form,
          amount: parseFloat(form.amount.replace(/,/g, '')),
        }),
      )
      if (response.status === 201) {
        setMessage('Transaction submitted!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000) // Hide toast after 3s
      }
    } catch (error) {
      console.error('Error submitting transaction:', error)
      setMessage('Error submitting transaction')
      return
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          className="border p-2 w-full"
          name="account_id"
          value={form.account_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2 w-full"
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.type})
            </option>
          ))}
        </select>
        <input
          className="border p-2 w-full"
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select
          className="border p-2 w-full"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          className="border p-2 w-full"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full"
          name="transaction_date"
          type="date"
          value={form.transaction_date}
          onChange={handleChange}
          required
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
      {/* {message && <div className="mt-3 text-center">{message}</div>} */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity">
          {message}
        </div>
      )}
    </div>
  )
}
