import { createClient } from '@/lib/supabase/client'

export interface ActionDrivenBook {
  id: string
  title: string
  author: string
  totalActions: number
  completedActions: number
  completionRate: number
}

export interface ReadingPattern {
  hour: number
  sessionCount: number
  totalMinutes: number
}

export interface TopRatedBook {
  id: string
  title: string
  author: string
  rating: number
  dateFinished: string | null
  readingTime: number
}

export interface ReadingVelocity {
  averageSessionLength: number
  totalSessions: number
  booksPerMonth: number
  pagesPerDay: number
}

export async function getActionDrivenBooks(limit: number = 5): Promise<ActionDrivenBook[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Get all books
  const { data: books } = await supabase
    .from('books')
    .select('id, title, author')
    .eq('user_id', user.id)

  if (!books) return []

  // Get action counts for each book
  const booksWithActions = await Promise.all(
    books.map(async (book) => {
      // Get all notes for this book
      const { data: notes } = await supabase
        .from('notes')
        .select('id')
        .eq('book_id', book.id)
        .eq('is_action_item', true)

      const noteIds = notes?.map((n) => n.id) || []

      if (noteIds.length === 0) {
        return {
          id: book.id,
          title: book.title,
          author: book.author,
          totalActions: 0,
          completedActions: 0,
          completionRate: 0,
        }
      }

      // Get actions for these notes
      const { data: actions } = await supabase
        .from('actions')
        .select('is_completed')
        .in('note_id', noteIds)

      const totalActions = actions?.length || 0
      const completedActions = actions?.filter((a) => a.is_completed).length || 0
      const completionRate = totalActions > 0 ? (completedActions / totalActions) * 100 : 0

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        totalActions,
        completedActions,
        completionRate,
      }
    })
  )

  return booksWithActions
    .filter((book) => book.totalActions > 0)
    .sort((a, b) => b.totalActions - a.totalActions)
    .slice(0, limit)
}

export async function getReadingPatterns(): Promise<ReadingPattern[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('start_time, duration')
    .eq('user_id', user.id)

  if (!sessions) return []

  // Group by hour of day
  const hourlyData: { [hour: number]: { count: number; minutes: number } } = {}

  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { count: 0, minutes: 0 }
  }

  sessions.forEach((session) => {
    const hour = new Date(session.start_time).getHours()
    hourlyData[hour].count++
    hourlyData[hour].minutes += Math.floor((session.duration || 0) / 60)
  })

  return Object.entries(hourlyData).map(([hour, data]) => ({
    hour: parseInt(hour),
    sessionCount: data.count,
    totalMinutes: data.minutes,
  }))
}

export async function getTopRatedBooks(limit: number = 5): Promise<TopRatedBook[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: books } = await supabase
    .from('books')
    .select('id, title, author, rating, date_finished, total_reading_time')
    .eq('user_id', user.id)
    .not('rating', 'is', null)
    .order('rating', { ascending: false })
    .limit(limit)

  if (!books) return []

  return books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    rating: book.rating!,
    dateFinished: book.date_finished,
    readingTime: book.total_reading_time || 0,
  }))
}

export async function getReadingVelocity(): Promise<ReadingVelocity> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Get sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select('duration, start_time')
    .eq('user_id', user.id)

  const totalSessions = sessions?.length || 0
  const totalDuration = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0
  const averageSessionLength = totalSessions > 0 ? Math.floor(totalDuration / totalSessions) : 0

  // Get books finished in last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentBooks } = await supabase
    .from('books')
    .select('date_finished')
    .eq('user_id', user.id)
    .eq('status', 'finished')
    .gte('date_finished', thirtyDaysAgo.toISOString())

  const booksLastMonth = recentBooks?.length || 0
  const booksPerMonth = booksLastMonth

  return {
    averageSessionLength,
    totalSessions,
    booksPerMonth,
    pagesPerDay: 0, // We don't track pages yet
  }
}
