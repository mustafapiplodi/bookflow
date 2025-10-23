'use client'

import { useEffect, useState } from 'react'
import { Play, Pause, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSessionStore } from '@/lib/stores/session-store'
import { useCreateSession, useEndSession } from '@/hooks/use-sessions'
import { SessionEndDialog } from './session-end-dialog'

interface SessionTimerProps {
  bookId: string
  bookTitle: string
}

export function SessionTimer({ bookId, bookTitle }: SessionTimerProps) {
  const [time, setTime] = useState(0)
  const [showEndDialog, setShowEndDialog] = useState(false)

  const {
    activeSessionId,
    bookId: activeBookId,
    isPaused,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    getElapsedTime,
  } = useSessionStore()

  const createSession = useCreateSession()
  const endSession = useEndSession()

  const isActive = activeSessionId && activeBookId === bookId

  // Update time every second
  useEffect(() => {
    if (!isActive || isPaused) return

    const interval = setInterval(() => {
      setTime(getElapsedTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, isPaused, getElapsedTime])

  // Update time immediately when paused state changes
  useEffect(() => {
    if (isActive) {
      setTime(getElapsedTime())
    }
  }, [isActive, isPaused, getElapsedTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleStart = async () => {
    try {
      const session = await createSession.mutateAsync({
        book_id: bookId,
      })
      startSession(session.id, bookId)
      setTime(0)
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const handlePause = () => {
    pauseSession()
  }

  const handleResume = () => {
    resumeSession()
  }

  const handleStop = () => {
    // Pause the timer when opening the dialog
    pauseSession()
    setShowEndDialog(true)
  }

  const handleEndSession = async (data: {
    session_mood?: 'happy' | 'neutral' | 'sad'
    key_insight?: string
  }) => {
    if (!activeSessionId) return

    try {
      const durationSeconds = getElapsedTime()
      await endSession.mutateAsync({
        id: activeSessionId,
        options: {
          duration: durationSeconds,
          ...data,
        },
      })
      stopSession()
      setTime(0)
      setShowEndDialog(false)
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }

  if (!isActive) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Ready to read?</h3>
          <p className="text-sm text-slate-600 mb-4">
            Start a reading session to track your time
          </p>
          <Button onClick={handleStart} size="lg" disabled={createSession.isPending}>
            <Play className="w-4 h-4 mr-2" />
            {createSession.isPending ? 'Starting...' : 'Start Reading'}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="text-center">
          <div className="text-4xl font-bold font-mono mb-4 text-primary">
            {formatTime(time)}
          </div>

          <div className="flex gap-2 justify-center">
            {isPaused ? (
              <Button onClick={handleResume} size="lg">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button onClick={handlePause} size="lg" variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleStop} size="lg" variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>

          <p className="text-sm text-slate-600 mt-4">
            Reading: <span className="font-medium">{bookTitle}</span>
          </p>
        </div>
      </Card>

      <SessionEndDialog
        open={showEndDialog}
        onOpenChange={(open) => {
          setShowEndDialog(open)
          // Resume timer if user cancels the dialog
          if (!open && isActive && isPaused) {
            resumeSession()
          }
        }}
        onSubmit={handleEndSession}
        durationSeconds={time}
        isPending={endSession.isPending}
      />
    </>
  )
}
