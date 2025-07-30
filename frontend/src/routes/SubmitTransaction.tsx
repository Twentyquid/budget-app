import { useEffect, useState } from 'react'

type Category = {
  id: number
  name: string
  type: string
  is_default: boolean
  user_id: number | null
}

export default function SubmitTransaction() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    user_id: '',
    account_id: '',
    category_id: '',
    amount: '',
    type: 'expense',
    description: '',
    transaction_date: '',
  })
  const [message, setMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Replace with actual user_id as needed
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/categories?user_id=${form.user_id || 1}`,
    )
      .then((res) => res.json())
      .then(setCategories)
  }, [form.user_id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    // If category_id is changed, update type to match selected category
    if (name === 'category_id') {
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
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/transactions/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      },
    )
    if (res.ok) {
      setMessage('Transaction submitted!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000) // Hide toast after 3s
      //   setForm({ ...form, amount: "", description: "" })
    } else {
      const data = await res.json()
      setMessage(data.error || 'Error submitting transaction')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          name="user_id"
          placeholder="User ID"
          value={form.user_id}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 w-full"
          name="account_id"
          placeholder="Account ID"
          value={form.account_id}
          onChange={handleChange}
          required
        />
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
          type="number"
          step="0.01"
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
          Transaction submitted!
        </div>
      )}
    </div>
  )
}
