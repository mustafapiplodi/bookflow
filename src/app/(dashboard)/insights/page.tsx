'use client'

import { ActionDrivenBooks } from '@/components/insights/action-driven-books'
import { ReadingPatternsChart } from '@/components/insights/reading-patterns-chart'
import { TopRatedBooks } from '@/components/insights/top-rated-books'
import { Card } from '@/components/ui/card'
import { TrendingUp, Zap } from 'lucide-react'
import {
  useActionDrivenBooks,
  useReadingPatterns,
  useTopRatedBooks,
  useReadingVelocity,
} from '@/hooks/use-insights'

export default function InsightsPage() {
  const { data: actionBooks, isLoading: loadingActionBooks } = useActionDrivenBooks(5)
  const { data: patterns, isLoading: loadingPatterns } = useReadingPatterns()
  const { data: topRated, isLoading: loadingTopRated } = useTopRatedBooks(5)
  const { data: velocity, isLoading: loadingVelocity } = useReadingVelocity()

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">Insights</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Discover patterns and insights from your reading journey
        </p>
      </div>

      <div className="space-y-8">
        {/* Velocity Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Session</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loadingVelocity ? '...' : formatTime(velocity?.averageSessionLength || 0)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {velocity?.totalSessions || 0} total sessions
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Books/Month</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loadingVelocity ? '...' : velocity?.booksPerMonth || 0}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Based on last 30 days
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Reading Pace</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loadingVelocity
                    ? '...'
                    : velocity?.averageSessionLength && velocity.averageSessionLength > 0
                    ? 'Active'
                    : 'Start Reading'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep up the momentum!
            </p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ActionDrivenBooks
            books={actionBooks || []}
            isLoading={loadingActionBooks}
          />
          <ReadingPatternsChart
            data={patterns || []}
            isLoading={loadingPatterns}
          />
        </div>

        {/* Top Rated Books */}
        <TopRatedBooks
          books={topRated || []}
          isLoading={loadingTopRated}
        />
      </div>
    </div>
  )
}
