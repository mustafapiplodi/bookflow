'use client'

import { Card } from '@/components/ui/card'
import { BookOpen, Clock, FileText, CheckSquare, Flame, Target } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface OverviewStatsProps {
  stats: {
    totalBooks: number
    booksReading: number
    booksFinished: number
    totalReadingTime: number
    totalNotes: number
    totalActions: number
    completedActions: number
    currentStreak: number
  }
  isLoading?: boolean
}

export function OverviewStats({ stats, isLoading }: OverviewStatsProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const actionCompletionRate = stats.totalActions > 0
    ? Math.round((stats.completedActions / stats.totalActions) * 100)
    : 0

  const statsCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      subtitle: `${stats.booksReading} reading, ${stats.booksFinished} finished`,
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Reading Time',
      value: formatTime(stats.totalReadingTime),
      subtitle: 'Total time spent reading',
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Notes Captured',
      value: stats.totalNotes,
      subtitle: 'Ideas and insights saved',
      icon: FileText,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Action Items',
      value: `${stats.completedActions}/${stats.totalActions}`,
      subtitle: `${actionCompletionRate}% completion rate`,
      icon: CheckSquare,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} ${stats.currentStreak === 1 ? 'day' : 'days'}`,
      subtitle: 'Keep the momentum going!',
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      title: 'Completion Goal',
      value: `${stats.booksFinished}`,
      subtitle: 'Books finished this year',
      icon: Target,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
