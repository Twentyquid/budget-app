import { useState } from 'react'
import { Link } from '@tanstack/react-router'

function Topbar() {
  const [open, setOpen] = useState(false)
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Topbar
