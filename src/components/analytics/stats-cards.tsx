'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Calendar,
  BookCheck,
  FileText,
  Flame,
} from 'lucide-react'
import { ReadingStats } from '@/lib/api/analytics'

interface StatsCardsProps {
  stats: ReadingStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const statsData = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      subtitle: `${stats.booksRead} completed`,
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Books Read',
      value: stats.booksThisYear,
      subtitle: `${stats.booksThisMonth} this month`,
      icon: BookCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Reading Time',
      value: formatTime(stats.totalReadingTime),
      subtitle: `${formatTime(stats.timeThisMonth)} this month`,
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Pages Read',
      value: stats.totalPages.toLocaleString(),
      subtitle: `${stats.pagesThisMonth} this month`,
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—',
      subtitle: 'out of 5 stars',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Reading Streak',
      value: stats.readingStreak,
      subtitle: stats.readingStreak === 1 ? 'day' : 'days',
      icon: Flame,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      badge: stats.readingStreak > 0 ? '🔥' : undefined,
    },
    {
      title: 'This Week',
      value: formatTime(stats.timeThisWeek),
      subtitle: `${stats.pagesThisWeek} pages`,
      icon: Calendar,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Currently Reading',
      value: stats.booksReading,
      subtitle: `${stats.booksWantToRead} want to read`,
      icon: TrendingUp,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                    {stat.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
