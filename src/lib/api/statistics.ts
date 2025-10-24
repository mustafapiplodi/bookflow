import { createClient } from '@/lib/supabase/client'

export interface OverviewStats {
  totalBooks: number
  booksReading: number
  booksFinished: number
  totalReadingTime: number
  totalNotes: number
  totalActions: number
  completedActions: number
  currentStreak: number
}

export interface DailyReadingTime {
  date: string
  minutes: number
}

export interface MonthlyBooks {
  month: string
  finished: number
}

export interface TopBook {
  id: string
  title: string
  author: string
  readingTime: number
  noteCount: number
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Get book stats
  const { data: books } = await supabase
    .from('books')
    .select('status, total_reading_time')
    .eq('user_id', user.id)

  const totalBooks = books?.length || 0
  const booksReading = books?.filter((b) => b.status === 'reading').length || 0
  const booksFinished = books?.filter((b) => b.status === 'finished').length || 0
  const totalReadingTime = books?.reduce((sum, b) => sum + (b.total_reading_time || 0), 0) || 0

  // Get notes count
  const { count: notesCount } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get actions stats
  const { data: actions } = await supabase
    .from('actions')
    .select('is_completed')
    .eq('user_id', user.id)

  const totalActions = actions?.length || 0
  const completedActions = actions?.filter((a) => a.is_completed).length || 0

  // Calculate streak (simplified - days with reading sessions)
  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('start_time')
    .eq('user_id', user.id)
    .order('start_time', { ascending: false })
    .limit(30)

  const currentStreak = calculateStreak(recentSessions?.map((s) => s.start_time) || [])

  return {
    totalBooks,
    booksReading,
    booksFinished,
    totalReadingTime,
    totalNotes: notesCount || 0,
    totalActions,
    completedActions,
    currentStreak,
  }
}

export async function getDailyReadingTime(days: number = 7): Promise<DailyReadingTime[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days + 1)
  startDate.setHours(0, 0, 0, 0)

  const { data: sessions } = await supabase
    .from('sessions')
    .select('start_time, duration')
    .eq('user_id', user.id)
    .gte('start_time', startDate.toISOString())
    .order('start_time', { ascending: true })

  // Group by date
  const dailyData: { [key: string]: number } = {}

  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    dailyData[dateStr] = 0
  }

  // Aggregate session durations by date
  sessions?.forEach((session) => {
    const dateStr = session.start_time.split('T')[0]
    dailyData[dateStr] = (dailyData[dateStr] || 0) + Math.floor((session.duration || 0) / 60)
  })

  return Object.entries(dailyData).map(([date, minutes]) => ({
    date,
    minutes,
  }))
}

export async function getMonthlyBooksFinished(months: number = 6): Promise<MonthlyBooks[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: books } = await supabase
    .from('books')
    .select('date_finished')
    .eq('user_id', user.id)
    .eq('status', 'finished')
    .not('date_finished', 'is', null)

  // Group by month
  const monthlyData: { [key: string]: number } = {}

  // Initialize last N months with 0
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyData[monthKey] = 0
  }

  // Count books per month
  books?.forEach((book) => {
    if (book.date_finished) {
      const date = new Date(book.date_finished)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthKey in monthlyData) {
        monthlyData[monthKey]++
      }
    }
  })

  return Object.entries(monthlyData).map(([month, finished]) => ({
    month,
    finished,
  }))
}

export async function getTopBooks(limit: number = 5): Promise<TopBook[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: books } = await supabase
    .from('books')
    .select('id, title, author, total_reading_time')
    .eq('user_id', user.id)
    .order('total_reading_time', { ascending: false })
    .limit(limit)

  if (!books) return []

  // Get note counts for each book
  const booksWithCounts = await Promise.all(
    books.map(async (book) => {
      const { count } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('book_id', book.id)

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        readingTime: book.total_reading_time || 0,
        noteCount: count || 0,
      }
    })
  )

  return booksWithCounts
}

function calculateStreak(sessionDates: string[]): number {
  if (sessionDates.length === 0) return 0

  // Get unique dates (ignoring time)
  const uniqueDates = Array.from(
    new Set(sessionDates.map((date) => new Date(date).toISOString().split('T')[0]))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < uniqueDates.length; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const checkDateStr = checkDate.toISOString().split('T')[0]

    if (uniqueDates.includes(checkDateStr)) {
      streak++
    } else {
      // Allow one day gap for today
      if (i === 0) continue
      break
    }
  }

  return streak
}
