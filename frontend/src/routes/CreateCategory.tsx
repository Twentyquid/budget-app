import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import React, { useState } from 'react'

export default function CreateCategory() {
  // name, type, user_id
  const [form, setForm] = useState({
    name: '',
    type: '',
  })
  const [message, setMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await axiosPrivate.post('/categories', form)
      setMessage('Category created')
      setForm({ name: '', type: '' })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      setMessage('Error creating category')
    }
  }
  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          name="name"
          placeholder="Category Name"
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
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Create Category
        </button>
      </form>
      {message && <div className="mt-3 text-center">{message}</div>}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity">
          Category created!
        </div>
      )}
    </div>
  )
}
