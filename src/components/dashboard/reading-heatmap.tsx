'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame } from 'lucide-react'

interface ReadingHeatmapProps {
  sessions: Array<{
    start_time: string
    duration_minutes: number | null
    pages_read: number | null
  }>
}

export function ReadingHeatmap({ sessions }: ReadingHeatmapProps) {
  // Calculate heatmap data for the last 12 months
  const heatmapData = useMemo(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setMonth(today.getMonth() - 12)
    startDate.setHours(0, 0, 0, 0)

    // Create a map of date strings to activity counts
    const activityMap = new Map<string, number>()

    sessions.forEach(session => {
      const sessionDate = new Date(session.start_time)
      sessionDate.setHours(0, 0, 0, 0)
      const dateKey = sessionDate.toISOString().split('T')[0]
      activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1)
    })

    // Generate all days for the last 12 months
    const days: Array<{
      date: Date
      dateKey: string
      count: number
      level: number
    }> = []

    let currentDate = new Date(startDate)
    while (currentDate <= today) {
      const dateKey = currentDate.toISOString().split('T')[0]
      const count = activityMap.get(dateKey) || 0

      // Determine activity level (0-4)
      let level = 0
      if (count > 0) level = 1
      if (count >= 2) level = 2
      if (count >= 4) level = 3
      if (count >= 6) level = 4

      days.push({
        date: new Date(currentDate),
        dateKey,
        count,
        level,
      })

      currentDate.setDate(currentDate.getDate() + 1)
      currentDate = new Date(currentDate) // Create new date object
    }

    return days
  }, [sessions])

  // Group days by week
  const weeks = useMemo(() => {
    const weeksArray: typeof heatmapData[] = []
    let currentWeek: typeof heatmapData = []

    heatmapData.forEach((day, index) => {
      const dayOfWeek = day.date.getDay()

      // Start new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeksArray.push(currentWeek)
        currentWeek = []
      }

      currentWeek.push(day)

      // Push last week
      if (index === heatmapData.length - 1) {
        weeksArray.push(currentWeek)
      }
    })

    return weeksArray
  }, [heatmapData])

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-muted'
      case 1: return 'bg-emerald-200'
      case 2: return 'bg-emerald-400'
      case 3: return 'bg-emerald-600'
      case 4: return 'bg-emerald-800'
      default: return 'bg-muted'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const totalDaysActive = heatmapData.filter(d => d.count > 0).length
  const maxStreak = useMemo(() => {
    let currentStreak = 0
    let maxStreak = 0

    heatmapData.forEach(day => {
      if (day.count > 0) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    })

    return maxStreak
  }, [heatmapData])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Reading Activity
        </CardTitle>
        <CardDescription>
          Your reading activity over the last 12 months • {totalDaysActive} active days • Longest streak: {maxStreak} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Month labels */}
        <div className="mb-2 flex gap-2">
          <div className="w-10"></div>
          <div className="flex gap-[3px] flex-1">
            {weeks.map((week, weekIndex) => {
              // Show month label only if this week contains the 1st of a month
              let monthLabel = ''
              const containsFirstOfMonth = week.some(day => day.date.getDate() === 1)
              if (containsFirstOfMonth) {
                const firstOfMonth = week.find(day => day.date.getDate() === 1)
                monthLabel = firstOfMonth?.date.toLocaleString('default', { month: 'short' }) || ''
              }

              return (
                <div
                  key={weekIndex}
                  className="flex flex-col"
                  style={{ width: '12px' }}
                >
                  <div className="text-[10px] text-muted-foreground h-4">
                    {monthLabel}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Heatmap grid with day labels */}
        <div className="flex gap-2">
          {/* Day of week labels */}
          <div className="flex flex-col gap-[3px] text-[10px] text-muted-foreground justify-start w-10">
            <div className="h-3 flex items-center">Sun</div>
            <div className="h-3 flex items-center">Mon</div>
            <div className="h-3 flex items-center">Tue</div>
            <div className="h-3 flex items-center">Wed</div>
            <div className="h-3 flex items-center">Thu</div>
            <div className="h-3 flex items-center">Fri</div>
            <div className="h-3 flex items-center">Sat</div>
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[3px] overflow-x-auto pb-2 flex-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                  const day = week.find(d => d.date.getDay() === dayOfWeek)

                  if (!day) {
                    return (
                      <div
                        key={dayOfWeek}
                        className="w-3 h-3 rounded-sm bg-transparent"
                      />
                    )
                  }

                  return (
                    <div
                      key={day.dateKey}
                      className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} transition-all hover:ring-2 hover:ring-primary cursor-pointer`}
                      title={`${formatDate(day.date)}: ${day.count} ${day.count === 1 ? 'session' : 'sessions'}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-emerald-200" />
            <div className="w-3 h-3 rounded-sm bg-emerald-400" />
            <div className="w-3 h-3 rounded-sm bg-emerald-600" />
            <div className="w-3 h-3 rounded-sm bg-emerald-800" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
