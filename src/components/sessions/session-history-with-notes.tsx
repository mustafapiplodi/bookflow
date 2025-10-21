'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Clock, BookOpen, Trash2, ChevronDown, ChevronUp, StickyNote } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
import { getSessionNotes, Note, noteTypeIcons, noteTypeLabels, noteTypeColors } from '@/lib/api/notes'

interface SessionWithBook extends ReadingSession {
  books?: {
    id: string
    title: string
    author: string
    cover_url: string | null
  }
}

interface SessionHistoryWithNotesProps {
  userId: string
  bookId?: string
  limit?: number
  showBookInfo?: boolean
}

export function SessionHistoryWithNotes({
  userId,
  bookId,
  limit,
  showBookInfo = true,
}: SessionHistoryWithNotesProps) {
  const [sessions, setSessions] = useState<SessionWithBook[]>([])
  const [sessionNotes, setSessionNotes] = useState<Record<string, Note[]>>({})
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [userId, bookId])

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
    sessionsData = sessionsData.filter((s) => !s.is_active && s.end_time)

    // Apply limit if specified
    if (limit) {
      sessionsData = sessionsData.slice(0, limit)
    }

    setSessions(sessionsData)

    // Load notes for each session
    const notesMap: Record<string, Note[]> = {}
    for (const session of sessionsData) {
      const { data: notes } = await getSessionNotes(session.id, userId)
      if (notes && notes.length > 0) {
        notesMap[session.id] = notes
      }
    }
    setSessionNotes(notesMap)

    setIsLoading(false)
  }

  const handleDeleteSession = async (sessionId: string) => {
    const { error } = await deleteSession(sessionId, userId)

    if (error) {
      toast.error('Failed to delete session')
      return
    }

    toast.success('Session deleted')
    setSessions(sessions.filter((s) => s.id !== sessionId))
  }

  const toggleSessionExpanded = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions)
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId)
    } else {
      newExpanded.add(sessionId)
    }
    setExpandedSessions(newExpanded)
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

  const getPlainTextPreview = (html: string, maxLength: number = 150) => {
    const text = html.replace(/<[^>]*>/g, '')
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
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

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>Your past reading sessions will appear here</CardDescription>
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
        <CardTitle>Session History</CardTitle>
        <CardDescription>
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session, index) => {
            const notes = sessionNotes[session.id] || []
            const hasNotes = notes.length > 0
            const isExpanded = expandedSessions.has(session.id)

            return (
              <div key={session.id}>
                <div className="space-y-3">
                  {/* Session Header */}
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

                        {hasNotes && (
                          <Badge variant="secondary" className="gap-1">
                            <StickyNote className="h-3 w-3" />
                            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
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
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Expand/Collapse Notes Button */}
                      {hasNotes && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSessionExpanded(session.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide Notes
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              View Notes
                            </>
                          )}
                        </Button>
                      )}

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this reading session
                              {hasNotes && ` and its ${notes.length} note(s)`}. This action cannot be
                              undone.
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
                  </div>

                  {/* Expanded Notes */}
                  {hasNotes && isExpanded && (
                    <div className="ml-4 pl-4 border-l-2 border-primary/20 space-y-2">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="border rounded-lg p-3 bg-muted/30 space-y-2"
                        >
                          {/* Note Type Badge */}
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={noteTypeColors[note.note_type]}>
                              <span className="mr-1">{noteTypeIcons[note.note_type]}</span>
                              {noteTypeLabels[note.note_type]}
                            </Badge>
                            {note.page_number && (
                              <span className="text-xs text-muted-foreground">
                                Page {note.page_number}
                              </span>
                            )}
                          </div>

                          {/* Note Content */}
                          {note.title && (
                            <p className="font-medium text-sm">{note.title}</p>
                          )}
                          <div
                            className="prose prose-sm max-w-none text-sm"
                            dangerouslySetInnerHTML={{
                              __html: getPlainTextPreview(note.content),
                            }}
                          />

                          {/* Timestamp */}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(note.created_at), 'p')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {index < sessions.length - 1 && <Separator className="mt-4" />}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
