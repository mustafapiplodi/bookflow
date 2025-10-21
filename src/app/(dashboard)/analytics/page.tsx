import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/analytics/stats-cards'
import { ReadingTimeChart } from '@/components/analytics/reading-time-chart'
import { GenreChart } from '@/components/analytics/genre-chart'
import { ExportReportButton } from '@/components/analytics/export-report-button'
import { AnalyticsDateFilter } from '@/components/analytics/analytics-date-filter'
import { getReadingStats, getGenreStats, getMonthlyReadingTrends } from '@/lib/api/analytics'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all analytics data
  const [statsResult, genreResult, trendsResult] = await Promise.all([
    getReadingStats(user.id),
    getGenreStats(user.id),
    getMonthlyReadingTrends(user.id),
  ])

  const stats = statsResult.data
  const genreStats = genreResult.data || []
  const trends = trendsResult.data || []

  if (!stats) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your reading progress and insights
            </p>
          </div>
          <ExportReportButton stats={stats} genreStats={genreStats} />
        </div>
        <div className="flex items-center gap-4">
          <AnalyticsDateFilter />
          <p className="text-xs text-muted-foreground">
            Note: Date range filtering will be applied to charts in a future update
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Reading Activity
          </TabsTrigger>
          <TabsTrigger value="genres">
            Genre Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <ReadingTimeChart data={trends} type="bar" />
        </TabsContent>

        <TabsContent value="genres" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GenreChart data={genreStats} />
            <div className="space-y-6">
              {/* Reading Insights */}
              <div className="rounded-lg border p-6 space-y-4">
                <h3 className="text-lg font-semibold">Reading Insights</h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Reading Pace</p>
                    <p className="text-2xl font-bold">
                      {stats.totalReadingTime > 0 && stats.totalPages > 0
                        ? Math.round(stats.totalPages / (stats.totalReadingTime / 60))
                        : '—'}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        pages/hour
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Books per Month (2024)</p>
                    <p className="text-2xl font-bold">
                      {stats.booksThisYear > 0
                        ? (stats.booksThisYear / new Date().getMonth() + 1 || 1).toFixed(1)
                        : '—'}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        books/month
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Reading Consistency</p>
                    <p className="text-2xl font-bold">
                      {stats.readingStreak > 0 ? '🔥' : '💤'}
                      {' '}
                      {stats.readingStreak}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        day streak
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Most Productive Month</p>
                    <p className="text-xl font-bold">
                      {trends.length > 0
                        ? trends.reduce((max, curr) =>
                            curr.booksRead > max.booksRead ? curr : max
                          ).month
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="rounded-lg border p-6 space-y-4">
                <h3 className="text-lg font-semibold">Milestones</h3>

                <div className="space-y-3">
                  {stats.booksRead >= 100 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <p className="font-medium">Century Club</p>
                        <p className="text-sm text-muted-foreground">Read 100+ books</p>
                      </div>
                    </div>
                  )}

                  {stats.booksRead >= 50 && stats.booksRead < 100 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg">
                      <span className="text-2xl">🎖️</span>
                      <div>
                        <p className="font-medium">Bookworm</p>
                        <p className="text-sm text-muted-foreground">Read 50+ books</p>
                      </div>
                    </div>
                  )}

                  {stats.readingStreak >= 30 && (
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <p className="font-medium">On Fire!</p>
                        <p className="text-sm text-muted-foreground">30+ day streak</p>
                      </div>
                    </div>
                  )}

                  {stats.readingStreak >= 7 && stats.readingStreak < 30 && (
                    <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-medium">Week Warrior</p>
                        <p className="text-sm text-muted-foreground">7+ day streak</p>
                      </div>
                    </div>
                  )}

                  {stats.totalReadingTime >= 6000 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="font-medium">Time Master</p>
                        <p className="text-sm text-muted-foreground">100+ hours read</p>
                      </div>
                    </div>
                  )}

                  {stats.averageRating >= 4.5 && (
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="font-medium">Quality Curator</p>
                        <p className="text-sm text-muted-foreground">4.5+ average rating</p>
                      </div>
                    </div>
                  )}

                  {stats.booksRead === 0 && stats.readingStreak === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">Start reading to unlock milestones!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
