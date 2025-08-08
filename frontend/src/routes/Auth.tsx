import { useState } from 'react'
import { userStore } from '../store/userStore.ts'
import api from '../api/api.ts'
import { Link } from '@tanstack/react-router'
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const endpoint = isLogin ? `/auth/login` : `/auth/signup`
    // Only send email for signup
    const payload = isLogin
      ? { username: form.username, password: form.password }
      : form

    try {
      const res = await api.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      setMessage(isLogin ? 'Login successful!' : 'Registration successful!')
      const { accessToken } = res?.data
      userStore.setState({
        accessToken,
      })
      setIsSuccess(true)
    } catch (error) {
      console.error('Error during authentication:', error)
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { error?: string } } }
        setMessage(err.response?.data?.error || 'Error')
      } else {
        setMessage('Error')
      }
    }
  }

  return (
    <>
      {isSuccess ? (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
          <Link to="/">Go to Dashboard</Link>
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="border p-2 w-full"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            {!isLogin && (
              <input
                className="border p-2 w-full"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            )}
            <div className="relative">
              <input
                className="border p-2 w-full pr-10"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              type="submit"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              className="text-blue-600 underline"
              onClick={() => setIsLogin((v) => !v)}
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </button>
          </div>
          {message && (
            <div className="mt-4 text-center text-green-700">{message}</div>
          )}
        </div>
      )}
    </>
  )
}
