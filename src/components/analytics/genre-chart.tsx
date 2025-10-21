'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { GenreStats } from '@/lib/api/analytics'

interface GenreChartProps {
  data: GenreStats[]
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(142.1 76.2% 36.3%)', // green
  'hsl(221.2 83.2% 53.3%)', // blue
  'hsl(262.1 83.3% 57.8%)', // purple
  'hsl(24.6 95% 53.1%)',   // orange
  'hsl(346.8 77.2% 49.8%)', // red
  'hsl(173.4 80.4% 40%)',  // cyan
  'hsl(47.9 95.8% 53.1%)', // yellow
  'hsl(280.4 89.1% 68.6%)', // pink
  'hsl(27.8 87.8% 67.1%)', // peach
]

export function GenreChart({ data }: GenreChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genre Distribution</CardTitle>
          <CardDescription>
            No genre data available yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Add genres to your books to see distribution</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((item, index) => ({
    name: item.genre,
    value: item.count,
    percentage: item.percentage,
    fill: COLORS[index % COLORS.length],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} {data.value === 1 ? 'book' : 'books'} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null // Don't show label for small slices

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre Distribution</CardTitle>
        <CardDescription>
          Breakdown of your library by genre
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm">
                    {value} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Genres List */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Top Genres</h4>
          {data.slice(0, 5).map((genre, index) => (
            <div key={genre.genre} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{genre.genre}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {genre.count} {genre.count === 1 ? 'book' : 'books'}
                </span>
                <span className="text-sm font-medium">
                  {genre.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
