'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, Square, Clock, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { startSession, endSession, pauseSession, resumeSession, getActiveSession } from '@/lib/api/sessions'

interface Book {
  id: string
  title: string
  author: string
  cover_url: string | null
  current_page: number | null
  total_pages: number | null
}

interface ActiveSession {
  id: string
  book_id: string
  start_time: string
  start_page: number | null
  is_active: boolean
  books: Book
}

interface SessionTimerProps {
  userId: string
  bookId?: string
  book?: Book
  onSessionEnd?: () => void
}

export function SessionTimer({ userId, bookId, book, onSessionEnd }: SessionTimerProps) {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [startPage, setStartPage] = useState<string>('')
  const [endPage, setEndPage] = useState<string>('')
  const [sessionNotes, setSessionNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load active session on mount
  useEffect(() => {
    loadActiveSession()
  }, [userId])

  // Timer effect
  useEffect(() => {
    if (!activeSession || !activeSession.is_active) return

    const startTime = new Date(activeSession.start_time).getTime()

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTime) / 1000)
      setElapsedSeconds(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSession])

  const loadActiveSession = async () => {
    const { data } = await getActiveSession(userId)
    if (data) {
      setActiveSession(data as ActiveSession)
      const startTime = new Date(data.start_time).getTime()
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedSeconds(elapsed)
    }
  }

  const handleStartSession = async () => {
    if (!bookId && !book?.id) {
      toast.error('Please select a book to start a session')
      return
    }

    setIsLoading(true)

    const { data, error } = await startSession(userId, {
      book_id: bookId || book!.id,
      start_page: startPage ? parseInt(startPage) : undefined,
      session_notes: sessionNotes || undefined
    })

    if (error) {
      toast.error(error.message || 'Failed to start session')
      setIsLoading(false)
      return
    }

    setActiveSession(data as ActiveSession)
    setElapsedSeconds(0)
    toast.success('Reading session started!')
    setIsLoading(false)
  }

  const handlePauseSession = async () => {
    if (!activeSession) return

    setIsLoading(true)

    const { error } = await pauseSession(activeSession.id, userId)

    if (error) {
      toast.error('Failed to pause session')
      setIsLoading(false)
      return
    }

    setActiveSession({ ...activeSession, is_active: false })
    toast.info('Session paused')
    setIsLoading(false)
  }

  const handleResumeSession = async () => {
    if (!activeSession) return

    setIsLoading(true)

    const { error } = await resumeSession(activeSession.id, userId)

    if (error) {
      toast.error(error.message || 'Failed to resume session')
      setIsLoading(false)
      return
    }

    setActiveSession({ ...activeSession, is_active: true })
    toast.success('Session resumed')
    setIsLoading(false)
  }

  const handleEndSession = async () => {
    if (!activeSession) return

    setIsLoading(true)

    const pagesRead = endPage && activeSession.start_page
      ? parseInt(endPage) - activeSession.start_page
      : endPage ? parseInt(endPage) : 0

    const { error } = await endSession(activeSession.id, userId, {
      end_page: endPage ? parseInt(endPage) : undefined,
      pages_read: pagesRead > 0 ? pagesRead : undefined,
      session_notes: sessionNotes || undefined
    })

    if (error) {
      toast.error('Failed to end session')
      setIsLoading(false)
      return
    }

    toast.success(`Session ended! ${formatTime(elapsedSeconds)} recorded`)
    setActiveSession(null)
    setElapsedSeconds(0)
    setStartPage('')
    setEndPage('')
    setSessionNotes('')
    setIsLoading(false)

    onSessionEnd?.()
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const currentBook = activeSession?.books || book

  // Calculate reading progress
  const progressPercentage = currentBook?.total_pages && currentBook?.current_page
    ? (currentBook.current_page / currentBook.total_pages) * 100
    : 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Reading Timer
        </CardTitle>
        {currentBook && (
          <CardDescription>
            <span className="font-medium">{currentBook.title}</span> by {currentBook.author}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        {activeSession && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="text-6xl font-bold font-mono text-primary tabular-nums">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-sm text-muted-foreground">
              {activeSession.is_active ? 'Session in progress' : 'Session paused'}
            </div>
          </div>
        )}

        {/* Book Progress */}
        {currentBook?.total_pages && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reading Progress</span>
              <span className="font-medium">
                {currentBook.current_page || 0} / {currentBook.total_pages} pages
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Session Controls */}
        {!activeSession ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-page">Starting Page (Optional)</Label>
              <Input
                id="start-page"
                type="number"
                placeholder={currentBook?.current_page?.toString() || '0'}
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-notes">Session Notes (Optional)</Label>
              <Textarea
                id="session-notes"
                placeholder="What are you planning to focus on?"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleStartSession}
              disabled={isLoading || (!bookId && !book)}
              className="w-full"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Reading Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* End Page Input */}
            <div className="space-y-2">
              <Label htmlFor="end-page">Ending Page</Label>
              <Input
                id="end-page"
                type="number"
                placeholder="Page you're stopping at..."
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                min={activeSession.start_page || 0}
              />
              <p className="text-xs text-muted-foreground">
                Enter the page number where you're ending your reading session
              </p>
            </div>

            {/* Session Notes */}
            <div className="space-y-2">
              <Label htmlFor="session-notes-active">Session Notes</Label>
              <Textarea
                id="session-notes-active"
                placeholder="Add notes about this reading session..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              {activeSession.is_active ? (
                <Button
                  onClick={handlePauseSession}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={handleResumeSession}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}

              <Button
                onClick={handleEndSession}
                disabled={isLoading}
                variant="default"
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {activeSession && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Started</p>
              <p className="text-sm font-medium">
                {new Date(activeSession.start_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {activeSession.start_page && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Start Page</p>
                <p className="text-sm font-medium">{activeSession.start_page}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
