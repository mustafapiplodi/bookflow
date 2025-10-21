import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  BookOpen,
  Clock,
  BookMarked,
  TrendingUp,
  Plus,
  Play,
  FileText,
  Sparkles,
  Calendar,
  Target,
  Flame
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ReadingBookCard } from '@/components/dashboard/reading-book-card'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch comprehensive dashboard data
  const [
    { data: books },
    { data: readingBooks },
    { data: sessions },
    { data: recentNotes },
    { data: activeSession },
    { data: wantToReadBooks },
    { data: pinnedNotes }
  ] = await Promise.all([
    // All books for stats
    supabase
      .from('books')
      .select('id, title, status, rating')
      .eq('user_id', user.id),

    // Currently reading books with progress
    supabase
      .from('books')
      .select('id, title, author, cover_url, current_page, total_pages, updated_at')
      .eq('user_id', user.id)
      .eq('status', 'reading')
      .order('updated_at', { ascending: false })
      .limit(3),

    // Recent sessions for stats
    supabase
      .from('reading_sessions')
      .select('duration_minutes, pages_read, start_time, end_time, books(title)')
      .eq('user_id', user.id)
      .not('end_time', 'is', null)
      .order('start_time', { ascending: false }),

    // Recent notes
    supabase
      .from('notes')
      .select('id, title, content, note_type, created_at, books(title)')
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(5),

    // Active reading session
    supabase
      .from('reading_sessions')
      .select('id, book_id, start_time, books(id, title, author)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single(),

    // Want to read books for recommendations
    supabase
      .from('books')
      .select('id, title, author, cover_url, rating')
      .eq('user_id', user.id)
      .eq('status', 'want_to_read')
      .order('created_at', { ascending: false })
      .limit(3),

    // Pinned notes for quick access
    supabase
      .from('notes')
      .select('id, title, content, note_type, books(title)')
      .eq('user_id', user.id)
      .eq('is_pinned', true)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(3)
  ])

  // Calculate stats
  const totalBooks = books?.length || 0
  const readingCount = books?.filter(b => b.status === 'reading').length || 0
  const completedCount = books?.filter(b => b.status === 'completed').length || 0
  const avgRating = books && books.length > 0
    ? (books.reduce((sum, b) => sum + (b.rating || 0), 0) / books.filter(b => b.rating).length).toFixed(1)
    : '0.0'

  // Time-based stats
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  const lastWeekStart = new Date(now)
  lastWeekStart.setDate(now.getDate() - 14)

  // This month's stats
  const thisMonthSessions = sessions?.filter(s => new Date(s.start_time) >= monthStart) || []
  const totalMinutesThisMonth = thisMonthSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
  const totalHoursThisMonth = Math.floor(totalMinutesThisMonth / 60)
  const totalPagesThisMonth = thisMonthSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0)

  // This week vs last week
  const thisWeekSessions = sessions?.filter(s => new Date(s.start_time) >= weekStart) || []
  const lastWeekSessions = sessions?.filter(s => {
    const startTime = new Date(s.start_time)
    return startTime >= lastWeekStart && startTime < weekStart
  }) || []
  const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
  const lastWeekMinutes = lastWeekSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
  const weeklyChange = lastWeekMinutes > 0
    ? Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100)
    : thisWeekMinutes > 0 ? 100 : 0

  // Reading streak (consecutive days with at least one session)
  const last30Days = new Date(now)
  last30Days.setDate(now.getDate() - 30)
  const recentSessions = sessions?.filter(s => new Date(s.start_time) >= last30Days) || []
  const uniqueDays = new Set(recentSessions.map(s => new Date(s.start_time).toDateString()))
  const readingDays = uniqueDays.size

  // Calculate current streak
  let currentStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)
    const dateStr = checkDate.toDateString()
    if (uniqueDays.has(dateStr)) {
      currentStreak++
    } else if (i > 0) { // Allow grace for today
      break
    }
  }

  // Recent activity - combine sessions and notes
  const recentActivity = [
    ...(sessions?.slice(0, 5).map(s => ({
      type: 'session' as const,
      time: s.end_time || s.start_time,
      // @ts-ignore
      bookTitle: s.books?.title,
      duration: s.duration_minutes,
      pages: s.pages_read
    })) || []),
    ...(recentNotes?.map(n => ({
      type: 'note' as const,
      time: n.created_at,
      // @ts-ignore
      bookTitle: n.books?.title,
      noteType: n.note_type,
      title: n.title
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)

  // Empty state
  const isEmpty = totalBooks === 0

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          {isEmpty
            ? "Let's start your reading journey by adding your first book."
            : "Here's your reading overview and what's happening with your books."
          }
        </p>
      </div>

      {isEmpty ? (
        /* Empty State - First Time User */
        <div className="grid gap-6">
          <Card className="border-dashed">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Your Library Awaits</CardTitle>
              <CardDescription className="text-base mt-2">
                Start building your personal reading collection and unlock powerful features like reading sessions, note-taking, and analytics.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Link href="/books">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Your First Book
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-lg">Track Reading Time</CardTitle>
                <CardDescription className="text-sm">
                  Log sessions and see how much time you spend reading
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle className="text-lg">Take Smart Notes</CardTitle>
                <CardDescription className="text-sm">
                  Capture insights with 12 note types and rich formatting
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-lg">View Analytics</CardTitle>
                <CardDescription className="text-sm">
                  Visualize your reading habits and progress over time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      ) : (
        /* Main Dashboard - Existing User */
        <div className="space-y-8">
          {/* Active Reading Session Alert */}
          {activeSession && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Reading Session Active</CardTitle>
                      <CardDescription className="text-green-700">
                        {/* @ts-ignore */}
                        {activeSession.books?.title} • Started {formatDistanceToNow(new Date(activeSession.start_time), { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </div>
                  <Link href={`/books/${activeSession.book_id}`}>
                    <Button size="sm" variant="default">
                      Continue Reading
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase font-medium">Total Books</CardDescription>
                <CardTitle className="text-3xl">{totalBooks}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {readingCount} reading
                  </div>
                  <div className="flex items-center gap-1">
                    <BookMarked className="h-3.5 w-3.5" />
                    {completedCount} done
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase font-medium">This Month</CardDescription>
                <CardTitle className="text-3xl">{totalHoursThisMonth}h {totalMinutesThisMonth % 60}m</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {totalPagesThisMonth} pages read
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase font-medium">Current Streak</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  {currentStreak}
                  {currentStreak > 0 && <span className="text-2xl">🔥</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {currentStreak === 0 ? 'Start today!' : currentStreak === 1 ? 'Day streak' : 'Days in a row'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase font-medium">Avg Rating</CardDescription>
                <CardTitle className="text-3xl">{avgRating} ⭐</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  {books?.filter(b => b.rating).length || 0} rated
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Currently Reading & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Currently Reading Books */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Continue Reading
                    </CardTitle>
                    <Link href="/books?filter=reading">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {readingBooks && readingBooks.length > 0 ? (
                    <div className="space-y-4">
                      {readingBooks.map((book) => (
                        <ReadingBookCard key={book.id} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No books in progress</p>
                      <Link href="/books">
                        <Button variant="link" size="sm" className="mt-2">
                          Browse your library
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reading Streak & Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Reading Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold text-orange-500">{currentStreak} 🔥</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentStreak === 0 ? 'Start your streak today!' : currentStreak === 1 ? 'Day streak' : 'Days streak'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold">{readingDays}</div>
                        <p className="text-xs text-muted-foreground">days last month</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">This Week vs Last Week</span>
                        {weeklyChange > 0 ? (
                          <Badge variant="default" className="gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +{weeklyChange}%
                          </Badge>
                        ) : weeklyChange < 0 ? (
                          <Badge variant="secondary" className="gap-1">
                            ↓ {Math.abs(weeklyChange)}%
                          </Badge>
                        ) : (
                          <Badge variant="outline">→ 0%</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 rounded bg-primary/10">
                          <div className="font-semibold">{Math.floor(thisWeekMinutes / 60)}h {thisWeekMinutes % 60}m</div>
                          <div className="text-xs text-muted-foreground">This week</div>
                        </div>
                        <div className="p-2 rounded bg-muted">
                          <div className="font-semibold">{Math.floor(lastWeekMinutes / 60)}h {lastWeekMinutes % 60}m</div>
                          <div className="text-xs text-muted-foreground">Last week</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to Read Next */}
              {wantToReadBooks && wantToReadBooks.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        What to Read Next
                      </CardTitle>
                      <Link href="/books">
                        <Button variant="ghost" size="sm">View All</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {wantToReadBooks.slice(0, 3).map((book) => (
                        <Link key={book.id} href={`/books/${book.id}`}>
                          <div className="flex gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                            {book.cover_url ? (
                              <img
                                src={book.cover_url}
                                alt={book.title}
                                className="w-12 h-16 object-cover rounded shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-amber-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">{book.title}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
                              <Button size="sm" variant="ghost" className="h-6 px-2 mt-1 text-xs">
                                Start Reading →
                              </Button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Recent Activity & Pinned Notes */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity && recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.type === 'session' ? 'bg-blue-100' : 'bg-purple-100'
                            }`}>
                              {activity.type === 'session' ? (
                                <Clock className="h-4 w-4 text-blue-600" />
                              ) : (
                                <FileText className="h-4 w-4 text-purple-600" />
                              )}
                            </div>
                            {idx < recentActivity.length - 1 && (
                              <div className="w-px h-full bg-border mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="font-medium line-clamp-1">
                              {activity.type === 'session' ? (
                                <>Read {activity.pages || 0} pages</>
                              ) : (
                                <>{activity.title || 'New note'}</>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {activity.bookTitle}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No recent activity</p>
                      <p className="text-xs mt-1">Start reading to see your activity here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pinned Notes */}
              {pinnedNotes && pinnedNotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        📌 Pinned Notes
                      </CardTitle>
                      <Link href="/notes">
                        <Button variant="ghost" size="sm">View All</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pinnedNotes.map((note) => {
                        const noteTypeIcons: Record<string, string> = {
                          idea: '💡', argument: '⚖️', action: '✅', quote: '💬',
                          question: '❓', connection: '🔗', disagreement: '❌', insight: '✨',
                          data: '📊', example: '📝', reflection: '🤔', definition: '📖'
                        }
                        const plainContent = note.content.replace(/<[^>]*>/g, '')

                        return (
                          <div key={note.id} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-start gap-2">
                              <span className="text-sm">{noteTypeIcons[note.note_type]}</span>
                              <div className="flex-1 min-w-0">
                                {note.title && (
                                  <h4 className="text-sm font-medium line-clamp-1">{note.title}</h4>
                                )}
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                  {plainContent}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {/* @ts-ignore */}
                                  {note.books?.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
