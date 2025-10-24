'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

interface ReadingTimeChartProps {
  data: Array<{
    date: string
    minutes: number
  }>
  isLoading?: boolean
}

export function ReadingTimeChart({ data, isLoading }: ReadingTimeChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, 'MMM d')
  }

  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    minutes: item.minutes,
  }))

  const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0)
  const avgMinutes = data.length > 0 ? Math.round(totalMinutes / data.length) : 0

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
          Reading Activity (Last 7 Days)
        </h3>
        <p className="text-sm text-slate-600">
          {totalMinutes} total minutes • {avgMinutes} average per day
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar
              dataKey="minutes"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
