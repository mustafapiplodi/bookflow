'use client'

import { useState, useEffect } from 'react'
import { format, subDays, startOfDay } from 'date-fns'
import { Clock, BookOpen, Trash2, FileText, Filter, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { getBookSessions, getSessions, deleteSession, ReadingSession } from '@/lib/api/sessions'
import { createClient } from '@/lib/supabase/client'

interface SessionWithBook extends ReadingSession {
  books?: {
    id: string
    title: string
    author: string
    cover_url: string | null
  }
}

interface SessionHistoryProps {
  userId: string
  bookId?: string
  limit?: number
  showBookInfo?: boolean
}

export function SessionHistory({ userId, bookId, limit, showBookInfo = true }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<SessionWithBook[]>([])
  const [filteredSessions, setFilteredSessions] = useState<SessionWithBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [books, setBooks] = useState<Array<{id: string, title: string}>>([])
  const [selectedBookId, setSelectedBookId] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    loadSessions()
    if (!bookId) {
      loadBooks()
    }
  }, [userId, bookId])

  useEffect(() => {
    applyFilters()
  }, [sessions, selectedBookId, dateRange])

  const loadBooks = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('books')
      .select('id, title')
      .eq('user_id', userId)
      .order('title')

    setBooks(data || [])
  }

  const applyFilters = () => {
    let filtered = [...sessions]

    // Filter by book
    if (selectedBookId !== 'all') {
      filtered = filtered.filter(s => s.book_id === selectedBookId)
    }

    // Filter by date range
    const now = new Date()
    switch (dateRange) {
      case 'today':
        filtered = filtered.filter(s =>
          startOfDay(new Date(s.start_time)).getTime() === startOfDay(now).getTime()
        )
        break
      case 'week':
        const weekAgo = subDays(now, 7)
        filtered = filtered.filter(s => new Date(s.start_time) >= weekAgo)
        break
      case 'month':
        const monthAgo = subDays(now, 30)
        filtered = filtered.filter(s => new Date(s.start_time) >= monthAgo)
        break
      default:
        // 'all' - no date filtering
        break
    }

    setFilteredSessions(filtered)
  }

  const loadSessions = async () => {
    setIsLoading(true)

    const { data, error } = bookId
      ? await getBookSessions(bookId)
      : await getSessions(userId)

    if (error) {
      toast.error('Failed to load sessions')
      setIsLoading(false)
      return
    }

    let sessionsData = (data || []) as SessionWithBook[]

    // Filter out active sessions
    sessionsData = sessionsData.filter(s => !s.is_active && s.end_time)

    // Apply limit if specified
    if (limit) {
      sessionsData = sessionsData.slice(0, limit)
    }

    setSessions(sessionsData)
    setIsLoading(false)
  }

  const handleDeleteSession = async (sessionId: string) => {
    const { error } = await deleteSession(sessionId, userId)

    if (error) {
      toast.error('Failed to delete session')
      return
    }

    toast.success('Session deleted')
    setSessions(sessions.filter(s => s.id !== sessionId))
  }

  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return '0m'

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading sessions...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasActiveFilters = selectedBookId !== 'all' || dateRange !== 'all'
  const clearFilters = () => {
    setSelectedBookId('all')
    setDateRange('all')
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>
            Your past reading sessions will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No sessions yet. Start your first reading session!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Session History</CardTitle>
            <CardDescription>
              {filteredSessions.length} of {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          {!bookId && (
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {(selectedBookId !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Filter sessions</h4>
                    <div className="space-y-3">
                      {/* Book Filter */}
                      <div>
                        <label className="text-sm mb-2 block">Book</label>
                        <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                          <SelectTrigger>
                            <SelectValue placeholder="All books" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All books</SelectItem>
                            {books.map(book => (
                              <SelectItem key={book.id} value={book.id}>
                                {book.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date Range Filter */}
                      <div>
                        <label className="text-sm mb-2 block">Date Range</label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                          <SelectTrigger>
                            <SelectValue placeholder="All time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Last 7 days</SelectItem>
                            <SelectItem value="month">Last 30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <>
                      <Separator />
                      <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                        Clear Filters
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No sessions match your filters
            </p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session, index) => (
            <div key={session.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  {/* Book Info */}
                  {showBookInfo && session.books && (
                    <div className="flex items-center gap-2">
                      {session.books.cover_url && (
                        <img
                          src={session.books.cover_url}
                          alt={session.books.title}
                          className="w-8 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{session.books.title}</p>
                        <p className="text-xs text-muted-foreground">{session.books.author}</p>
                      </div>
                    </div>
                  )}

                  {/* Session Details */}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(session.duration_minutes)}
                    </Badge>

                    {session.pages_read && session.pages_read > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <BookOpen className="h-3 w-3" />
                        {session.pages_read} pages
                      </Badge>
                    )}

                    {session.start_page && session.end_page && (
                      <span className="text-xs text-muted-foreground">
                        pp. {session.start_page}-{session.end_page}
                      </span>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(session.start_time), 'PPP')} •{' '}
                    {format(new Date(session.start_time), 'p')} -{' '}
                    {session.end_time && format(new Date(session.end_time), 'p')}
                  </div>

                  {/* Notes */}
                  {session.session_notes && (
                    <div className="bg-muted/50 rounded-lg p-3 mt-2">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-muted-foreground">{session.session_notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {session.summary && (
                    <div className="text-sm text-muted-foreground italic">
                      "{session.summary}"
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this reading session. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteSession(session.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {index < filteredSessions.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
