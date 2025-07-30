type Transaction = {
  id: number
  category_name: string
  transaction_date: string
  type: string
  amount: number
  iconClass?: string
}

function TransactionTile({ transaction }: { transaction: Transaction }) {
  return (
    <div className="flex gap-1.5">
      <div className="p-2">
        <div className="flex justify-center items-center p-4 bg-accent">
          <i className={transaction.iconClass ?? 'ri-restaurant-line'}></i>
        </div>
      </div>
      <div className="flex-auto flex justify-between items-center border-b-2 border-secondary-light py-1.5">
        <div className="flex flex-col">
          <p>{transaction.category_name.toUpperCase()}</p>
          <p className="text-sm text-primary-light">
            {new Date(transaction.transaction_date).toLocaleDateString('en-GB')}
          </p>
        </div>
        <p>
          {transaction.type === 'expense' ? '-' : '+'}
          {Math.abs(transaction.amount)}
        </p>
      </div>
    </div>
  )
}

export default TransactionTile
