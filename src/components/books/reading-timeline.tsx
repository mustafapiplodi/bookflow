'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface ReadingTimelineProps {
  book: {
    created_at: string
    updated_at: string
    status: string
  }
  sessions: Array<{
    id: string
    start_time: string
    end_time: string | null
    duration_minutes: number | null
    pages_read: number | null
  }>
}

export function ReadingTimeline({ book, sessions }: ReadingTimelineProps) {
  const timeline = useMemo(() => {
    const events: Array<{
      date: Date
      type: 'started' | 'session' | 'completed'
      label: string
      description: string
    }> = []

    // Add book creation (started reading)
    events.push({
      date: new Date(book.created_at),
      type: 'started',
      label: 'Added to Library',
      description: 'Book added to collection',
    })

    // Add all sessions
    sessions.forEach(session => {
      if (session.end_time) {
        events.push({
          date: new Date(session.start_time),
          type: 'session',
          label: 'Reading Session',
          description: `${session.duration_minutes || 0} min • ${session.pages_read || 0} pages`,
        })
      }
    })

    // Add completion if book is completed
    if (book.status === 'completed') {
      events.push({
        date: new Date(book.updated_at),
        type: 'completed',
        label: 'Completed',
        description: 'Finished reading',
      })
    }

    // Sort by date
    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [book, sessions])

  const getEventColor = (type: string) => {
    switch (type) {
      case 'started':
        return 'bg-blue-500'
      case 'session':
        return 'bg-green-500'
      case 'completed':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'started':
        return '📚'
      case 'session':
        return '📖'
      case 'completed':
        return '🎉'
      default:
        return '📌'
    }
  }

  if (timeline.length <= 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reading Timeline
          </CardTitle>
          <CardDescription>Your reading journey for this book</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No reading sessions yet</p>
            <p className="text-xs mt-1">Start reading to build your timeline</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Reading Timeline
        </CardTitle>
        <CardDescription>
          {timeline.length} {timeline.length === 1 ? 'event' : 'events'} • Started {formatDistanceToNow(timeline[0].date, { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />

          {/* Timeline events */}
          <div className="space-y-6">
            {timeline.map((event, index) => (
              <div key={index} className="relative flex gap-4 group">
                {/* Event dot */}
                <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${getEventColor(event.type)} text-white flex-shrink-0 ring-4 ring-background transition-transform group-hover:scale-110`}>
                  <span className="text-sm">{getEventIcon(event.type)}</span>
                </div>

                {/* Event content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{event.label}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-medium">
                        {format(event.date, 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(event.date, 'h:mm a')}
                      </div>
                    </div>
                  </div>

                  {/* Additional context for sessions */}
                  {event.type === 'session' && (
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.description.split(' • ')[0]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {sessions.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{sessions.length}</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.floor(
                    sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60
                  )}h {sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) % 60}m
                </div>
                <div className="text-xs text-muted-foreground">Total Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">Pages Read</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {sessions.length > 0
                    ? Math.round(
                        sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / sessions.length
                      )
                    : 0}
                  m
                </div>
                <div className="text-xs text-muted-foreground">Avg Session</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
