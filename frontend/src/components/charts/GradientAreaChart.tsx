import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type ChartDataItem = {
  dow: string
  previous_week: number
  current_week: number
}

interface GradientAreaChartProps {
  chartData: ChartDataItem[]
}

export function GradientAreaChart({ chartData }: GradientAreaChartProps) {
  // const weekNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        // width={500}
        // height={300}
        data={chartData}
      >
        <CartesianGrid
          vertical={false}
          horizontal={true}
          strokeDasharray="3 3"
        />
        <XAxis dataKey="dow" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="previous_week" stroke="#8884d8" />
        <Line
          type="monotone"
          dataKey="current_week"
          strokeWidth={3}
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
