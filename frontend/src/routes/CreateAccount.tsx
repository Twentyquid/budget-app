import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'

export default function CreateAccount() {
  const [form, setForm] = useState({
    name: '',
    type: '',
    balance: '',
  })
  const [message, setMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      const _res = await axiosPrivate.post('/accounts/add', {
        ...form,
        balance: form.balance ? parseFloat(form.balance) : 0,
      })
      setMessage('Account created!')
      setForm({ name: '', type: '', balance: '' })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      setMessage('Error creating account')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          name="name"
          placeholder="Account Name"
          value={form.name}
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
          <option value="">Select Type</option>
          <option value="Cash">Cash</option>
          <option value="Bank">Bank</option>
          <option value="UPI">UPI</option>
        </select>
        <input
          className="border p-2 w-full"
          name="balance"
          type="number"
          step="0.01"
          placeholder="Initial Balance"
          value={form.balance}
          onChange={handleChange}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Create Account
        </button>
      </form>
      {message && <div className="mt-3 text-center">{message}</div>}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity">
          Account created!
        </div>
      )}
    </div>
  )
}
