'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ReadingPatternsChartProps {
  data: Array<{
    hour: number
    sessionCount: number
    totalMinutes: number
  }>
  isLoading?: boolean
}

export function ReadingPatternsChart({ data, isLoading }: ReadingPatternsChartProps) {
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM'
    if (hour < 12) return `${hour} AM`
    if (hour === 12) return '12 PM'
    return `${hour - 12} PM`
  }

  // Filter to only show hours with activity
  const activeHours = data.filter((item) => item.sessionCount > 0)

  // Find peak reading time
  const peakHour = data.reduce((max, item) =>
    item.sessionCount > max.sessionCount ? item : max
  , { hour: 0, sessionCount: 0, totalMinutes: 0 })

  const chartData = activeHours.map((item) => ({
    hour: formatHour(item.hour),
    sessions: item.sessionCount,
  }))

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-64 w-full" />
      </Card>
    )
  }

  if (activeHours.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Reading Patterns
          </h3>
        </div>
        <div className="text-center py-8 text-slate-600">
          <Clock className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p>No reading sessions yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Start tracking sessions to discover your reading patterns
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Reading Patterns
          </h3>
        </div>
        <p className="text-sm text-slate-600">
          Your preferred reading times • Peak: {formatHour(peakHour.hour)}
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="hour"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={{ stroke: '#cbd5e1' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
              label={{ value: 'Sessions', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }}
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
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar
              dataKey="sessions"
              fill="#a855f7"
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
