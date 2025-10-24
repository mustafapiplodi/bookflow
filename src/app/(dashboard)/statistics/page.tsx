'use client'

import { OverviewStats } from '@/components/statistics/overview-stats'
import { ReadingTimeChart } from '@/components/statistics/reading-time-chart'
import { MonthlyBooksChart } from '@/components/statistics/monthly-books-chart'
import { TopBooksList } from '@/components/statistics/top-books-list'
import {
  useOverviewStats,
  useDailyReadingTime,
  useMonthlyBooksFinished,
  useTopBooks,
} from '@/hooks/use-statistics'

export default function StatisticsPage() {
  const { data: overviewStats, isLoading: loadingOverview } = useOverviewStats()
  const { data: dailyReading, isLoading: loadingDaily } = useDailyReadingTime(7)
  const { data: monthlyBooks, isLoading: loadingMonthly } = useMonthlyBooksFinished(6)
  const { data: topBooks, isLoading: loadingTopBooks } = useTopBooks(5)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">Statistics</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your reading progress and insights
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview Stats Grid */}
        <OverviewStats
          stats={overviewStats || {
            totalBooks: 0,
            booksReading: 0,
            booksFinished: 0,
            totalReadingTime: 0,
            totalNotes: 0,
            totalActions: 0,
            completedActions: 0,
            currentStreak: 0,
          }}
          isLoading={loadingOverview}
        />

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ReadingTimeChart
            data={dailyReading || []}
            isLoading={loadingDaily}
          />
          <MonthlyBooksChart
            data={monthlyBooks || []}
            isLoading={loadingMonthly}
          />
        </div>

        {/* Top Books */}
        <TopBooksList
          books={topBooks || []}
          isLoading={loadingTopBooks}
        />
      </div>
    </div>
  )
}
