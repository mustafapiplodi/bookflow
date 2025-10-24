'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface MonthlyBooksChartProps {
  data: Array<{
    month: string
    finished: number
  }>
  isLoading?: boolean
}

export function MonthlyBooksChart({ data, isLoading }: MonthlyBooksChartProps) {
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    finished: item.finished,
  }))

  const totalFinished = data.reduce((sum, item) => sum + item.finished, 0)

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-64 w-full" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Books Finished (Last 6 Months)
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {totalFinished} books completed in the last 6 months
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
              label={{ value: 'Books', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="finished"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
