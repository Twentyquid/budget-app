import CategoryBar from './components/CategoryBar'
import { GradientAreaChart } from './components/charts/GradientAreaChart'
import Topbar from './components/Topbar'
import TransactionTile from './components/TransactionTile'
import { useEffect, useState, type Key } from 'react'

function App() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch('http://localhost:8000/dashboard?user_id=1')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError('Failed to fetch dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-primary text-main-text flex flex-col sm:flex-row flex-wrap gap-2 font-main px-2">
      <Topbar />
      <div className="flex gap-2 flex-[0_0_50%] sm:flex-row flex-wrap">
        <div className="bg-accent px-6 py-4 sm:order-1 space-y-4 flex flex-[0_0_100%] sm:basis-[calc(50%-4px)] flex-col">
          <p className="text-xl">NET BALANCE</p>
          <p className="text-4xl">
            {data &&
              new Intl.NumberFormat('en-IN', {
                style: 'decimal',
                maximumFractionDigits: 2,
              }).format(data.current_balance.current_balance)}
          </p>
        </div>
        <div className="flex flex-[0_0_100%] gap-2 text-6xl h-28 sm:hidden">
          <div className="flex-1/2 flex bg-secondary rounded-full items-center justify-center">
            <i className="ri-add-line"></i>
          </div>
          <div className="flex-1/2 flex bg-secondary rounded-full items-center justify-center">
            <i className="ri-qr-scan-line"></i>
          </div>
        </div>

        <div className="basis-[calc(50%-4px)] sm:order-3 px-6 py-4 space-y-4 bg-secondary">
          <p>RUNWAY</p>
          <p className="text-2xl">
            {data &&
              Math.floor(
                data.current_balance.current_balance / data.avg_spending,
              )}
            <span className="text-gray-500"> days</span>
          </p>
        </div>
        <div className="basis-[calc(50%-4px)] sm:order-2 px-6 py-4 space-y-4 bg-secondary">
          <p>AVG SPENDING</p>
          <p className="text-2xl">
            {data &&
              new Intl.NumberFormat('en-IN', {
                style: 'decimal',
                maximumFractionDigits: 2,
              }).format(data.avg_spending)}
          </p>
        </div>
        <div className="flex-1/2 sm:basis-[calc(50%-4px)] sm:order-4 px-6 py-4 space-y-4 bg-secondary">
          <p>TOTAL EXPENSE</p>
          <p className="text-2xl">
            {data &&
              new Intl.NumberFormat('en-IN', {
                style: 'decimal',
                maximumFractionDigits: 2,
              }).format(data.month_expense)}
          </p>
        </div>
      </div>
      <div className="bg-secondary px-6 py-4 flex flex-col sm:basis-[calc(50%-16px)] h-[44vh] gap-4">
        <p>WEEKLY EXPENSE</p>
        <div className="flex-1 ml-[-20px] text-xs sm:h-[40vh] min-h-0">
          <GradientAreaChart chartData={data && data.weekly_summary} />
        </div>
      </div>
      <div className="bg-secondary px-6 py-4 flex flex-col gap-4 sm:basis-[calc(25%-4px)]">
        <p>TOP CATEGORIES</p>
        <div className="flex flex-col">
          {/* bar graph parent */}
          {data &&
            data.top_categories.map((category: any) => (
              <CategoryBar
                key={category.name}
                total={category.total_spent}
                percent={
                  Math.round(
                    (category.total_spent / data.month_expense) * 100,
                  ) + '%'
                }
              />
            ))}
        </div>
      </div>
      <div className="bg-secondary px-6 py-4 flex flex-col gap-4 sm:basis-[calc(37%-4px)]">
        <div className="flex justify-between">
          <p>RECENT TRANSACTIONS</p>
          <p className="text-lg text-primary bg-main-text rounded-full px-1">
            <i className="ri-arrow-right-up-line"></i>
          </p>
        </div>
        {data && data.recent_transactions.length > 0 ? (
          data.recent_transactions.map((transaction: any) => (
            <TransactionTile key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <p>No recent transactions</p>
        )}
      </div>
      <div className="flex flex-col flex-auto gap-2">
        <div className="flex gap-2 basis-[70%] bg-secondary"></div>
        <div className="flex-auto bg-secondary"></div>
      </div>
    </div>
  )
}

export default App
