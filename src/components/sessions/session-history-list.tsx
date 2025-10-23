'use client'

import { useSessions } from '@/hooks/use-sessions'
import { formatDistanceToNow } from 'date-fns'
import { Clock, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface SessionHistoryListProps {
  bookId: string
}

export function SessionHistoryList({ bookId }: SessionHistoryListProps) {
  const { data: sessions, isLoading } = useSessions(bookId)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 h-24 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-600">
        No sessions yet. Start reading to track your sessions.
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return secs > 0 ? `${hours}h ${minutes}m ${secs}s` : `${hours}h ${minutes}m`
    }
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`
  }

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'happy':
        return '😊'
      case 'neutral':
        return '😐'
      case 'sad':
        return '😕'
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isActive = !session.end_time

        return (
          <Card key={session.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  {isActive ? (
                    <span className="font-semibold text-primary animate-pulse">
                      Session in progress...
                    </span>
                  ) : (
                    <span className="font-semibold">
                      {formatDuration(session.duration || 0)}
                    </span>
                  )}
                  {session.session_mood && (
                    <span className="text-lg">{getMoodEmoji(session.session_mood)}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(session.start_time), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {session.key_insight && (
                  <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                    <p className="text-slate-700 italic">"{session.key_insight}"</p>
                  </div>
                )}

                {session.focus_mode_used && (
                  <div className="mt-2">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      Focus Mode
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
