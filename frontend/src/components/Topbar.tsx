import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { userStore } from '@/store/userStore'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

function Topbar() {
  const [open, setOpen] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const downloadAllTransactions = async () => {
    try {
      const response = await axiosPrivate.get('/transactions/download', {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'transactions.csv')
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log('error downloading: ' + error)
    }
  }

  const handleLogout = async () => {
    userStore.setState({ accessToken: '' })
    try {
      await axiosPrivate.get('/auth/logout')
      userStore.setState({ accessToken: '' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
    console.log('User logged out')
  }
  return (
    <div className="h-16 w-[calc(100%-8px)] flex justify-between items-center">
      <div>
        <p>Budgetify</p>
      </div>
      <div>
        <div className="relative">
          <div
            className="text-4xl cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            <i className="ri-add-circle-line"></i>
          </div>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-secondary border rounded shadow-lg z-10">
              <Link
                to={'/create-account'}
                className="block w-full text-left px-4 py-2 hover:bg-accent"
              >
                Add Account
              </Link>
              <Link
                to={'/submit-transaction'}
                className="block w-full text-left px-4 py-2 hover:bg-accent"
              >
                Add Transaction
              </Link>
              <Link
                to={'/create-category'}
                className="block w-full text-left px-4 py-2 hover:bg-accent"
              >
                Add Category
              </Link>
              <div onClick={downloadAllTransactions}>export data</div>
              <div
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-accent cursor-pointer"
              >
                <p>Logout</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Topbar
