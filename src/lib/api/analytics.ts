import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface ReadingStats {
  totalBooks: number
  booksRead: number
  booksReading: number
  booksWantToRead: number
  totalPages: number
  totalReadingTime: number // in minutes
  averageRating: number
  readingStreak: number // consecutive days
  booksThisMonth: number
  booksThisYear: number
  pagesThisWeek: number
  pagesThisMonth: number
  timeThisWeek: number // in minutes
  timeThisMonth: number // in minutes
}

export interface GenreStats {
  genre: string
  count: number
  percentage: number
}

export interface MonthlyReading {
  month: string
  booksRead: number
  pagesRead: number
  timeSpent: number // in minutes
}

export interface ReadingTrend {
  date: string
  minutesRead: number
  pagesRead: number
}

/**
 * Get comprehensive reading statistics for a user
 */
export async function getReadingStats(userId: string) {
  const supabase = await createClient()

  try {
    // Get all books
    const { data: allBooks, error: booksError } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)

    if (booksError) throw booksError

    // Get all reading sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })

    if (sessionsError) throw sessionsError

    // Calculate date ranges
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Calculate basic stats
    const totalBooks = allBooks?.length || 0
    const booksRead = allBooks?.filter(b => b.status === 'completed').length || 0
    const booksReading = allBooks?.filter(b => b.status === 'reading').length || 0
    const booksWantToRead = allBooks?.filter(b => b.status === 'want_to_read').length || 0

    // Calculate total pages (only from completed books)
    const totalPages = allBooks
      ?.filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.total_pages || 0), 0) || 0

    // Calculate total reading time from sessions
    const totalReadingTime = sessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0

    // Calculate average rating (only from rated books)
    const ratedBooks = allBooks?.filter(b => b.rating && b.rating > 0) || []
    const averageRating = ratedBooks.length > 0
      ? ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length
      : 0

    // Calculate books read this month
    const booksThisMonth = allBooks?.filter(b =>
      b.status === 'completed' &&
      b.updated_at &&
      new Date(b.updated_at) >= startOfMonth
    ).length || 0

    // Calculate books read this year
    const booksThisYear = allBooks?.filter(b =>
      b.status === 'completed' &&
      b.updated_at &&
      new Date(b.updated_at) >= startOfYear
    ).length || 0

    // Calculate pages this week
    const sessionsThisWeek = sessions?.filter(s => new Date(s.start_time) >= startOfWeek) || []
    const pagesThisWeek = sessionsThisWeek.reduce((sum, s) => sum + (s.pages_read || 0), 0)

    // Calculate pages this month
    const sessionsThisMonth = sessions?.filter(s => new Date(s.start_time) >= startOfMonth) || []
    const pagesThisMonth = sessionsThisMonth.reduce((sum, s) => sum + (s.pages_read || 0), 0)

    // Calculate time this week
    const timeThisWeek = sessionsThisWeek.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)

    // Calculate time this month
    const timeThisMonth = sessionsThisMonth.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)

    // Calculate reading streak (simplified - consecutive days with sessions)
    const readingStreak = calculateReadingStreak(sessions || [])

    const stats: ReadingStats = {
      totalBooks,
      booksRead,
      booksReading,
      booksWantToRead,
      totalPages,
      totalReadingTime,
      averageRating,
      readingStreak,
      booksThisMonth,
      booksThisYear,
      pagesThisWeek,
      pagesThisMonth,
      timeThisWeek,
      timeThisMonth,
    }

    return { data: stats, error: null }
  } catch (error: any) {
    console.error('Error fetching reading stats:', error)
    return { data: null, error }
  }
}

/**
 * Get genre distribution statistics
 */
export async function getGenreStats(userId: string) {
  const supabase = await createClient()

  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('genre')
      .eq('user_id', userId)
      .not('genre', 'is', null)

    if (error) throw error

    // Count genres
    const genreCounts: { [key: string]: number } = {}
    books?.forEach(book => {
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1
      }
    })

    const total = books?.length || 0

    // Convert to array with percentages
    const genreStats: GenreStats[] = Object.entries(genreCounts)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 genres

    return { data: genreStats, error: null }
  } catch (error: any) {
    console.error('Error fetching genre stats:', error)
    return { data: null, error }
  }
}

/**
 * Get monthly reading trends for the past 12 months
 */
export async function getMonthlyReadingTrends(userId: string) {
  const supabase = await createClient()

  try {
    const now = new Date()
    const twelveMonthsAgo = new Date(now)
    twelveMonthsAgo.setMonth(now.getMonth() - 12)

    // Get sessions from last 12 months
    const { data: sessions, error: sessionsError } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', twelveMonthsAgo.toISOString())

    if (sessionsError) throw sessionsError

    // Get books completed in last 12 months
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('updated_at', twelveMonthsAgo.toISOString())

    if (booksError) throw booksError

    // Group by month
    const monthlyData: { [key: string]: MonthlyReading } = {}

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now)
      date.setMonth(now.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

      monthlyData[monthKey] = {
        month: monthName,
        booksRead: 0,
        pagesRead: 0,
        timeSpent: 0,
      }
    }

    // Add session data
    sessions?.forEach(session => {
      const date = new Date(session.start_time)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].pagesRead += session.pages_read || 0
        monthlyData[monthKey].timeSpent += session.duration_minutes || 0
      }
    })

    // Add books completed
    books?.forEach(book => {
      if (book.updated_at) {
        const date = new Date(book.updated_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

        if (monthlyData[monthKey]) {
          monthlyData[monthKey].booksRead += 1
        }
      }
    })

    const trends = Object.values(monthlyData)

    return { data: trends, error: null }
  } catch (error: any) {
    console.error('Error fetching monthly trends:', error)
    return { data: null, error }
  }
}

/**
 * Get reading activity for the last 30 days (for streak calendar)
 */
export async function getReadingActivity(userId: string, days: number = 30) {
  const supabase = await createClient()

  try {
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const { data: sessions, error } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate.toISOString())

    if (error) throw error

    // Group by date
    const activityMap: { [key: string]: ReadingTrend } = {}

    sessions?.forEach(session => {
      const date = new Date(session.start_time)
      const dateKey = date.toISOString().split('T')[0]

      if (!activityMap[dateKey]) {
        activityMap[dateKey] = {
          date: dateKey,
          minutesRead: 0,
          pagesRead: 0,
        }
      }

      activityMap[dateKey].minutesRead += session.duration_minutes || 0
      activityMap[dateKey].pagesRead += session.pages_read || 0
    })

    const activity = Object.values(activityMap).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return { data: activity, error: null }
  } catch (error: any) {
    console.error('Error fetching reading activity:', error)
    return { data: null, error }
  }
}

/**
 * Calculate reading streak (consecutive days with reading activity)
 */
function calculateReadingStreak(sessions: any[]): number {
  if (!sessions || sessions.length === 0) return 0

  // Get unique dates with sessions
  const uniqueDates = new Set(
    sessions.map(s => new Date(s.start_time).toISOString().split('T')[0])
  )

  const sortedDates = Array.from(uniqueDates).sort().reverse()

  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  let checkDate = new Date()

  // Check if there's activity today or yesterday (streak is still active)
  if (!sortedDates.includes(today)) {
    checkDate.setDate(checkDate.getDate() - 1)
    const yesterday = checkDate.toISOString().split('T')[0]
    if (!sortedDates.includes(yesterday)) {
      return 0 // Streak is broken
    }
  }

  // Count consecutive days
  checkDate = new Date()
  for (const dateStr of sortedDates) {
    const expectedDate = checkDate.toISOString().split('T')[0]
    if (dateStr === expectedDate) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
