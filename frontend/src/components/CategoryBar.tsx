type CategoryBarProps = {
  percent: string
  total: number
}

function CategoryBar({ percent, total }: CategoryBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-secondary-light h-10 flex">
        <div style={{ width: percent }} className={`bg-accent p-2.5`}>
          <p className="text-xl">{percent}</p>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <p>GROCERIES</p>
        <p className="text-primary-light">{total}</p>
      </div>
    </div>
  )
}

export default CategoryBar
