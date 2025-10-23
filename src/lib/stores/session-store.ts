import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  // Active session
  activeSessionId: string | null
  bookId: string | null
  startTime: number | null // timestamp
  isPaused: boolean
  pausedDuration: number // total paused time in seconds
  pausedAt: number | null // timestamp when paused

  // Actions
  startSession: (sessionId: string, bookId: string) => void
  pauseSession: () => void
  resumeSession: () => void
  stopSession: () => void
  getElapsedTime: () => number // in seconds
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      activeSessionId: null,
      bookId: null,
      startTime: null,
      isPaused: false,
      pausedDuration: 0,
      pausedAt: null,

      startSession: (sessionId: string, bookId: string) => {
        set({
          activeSessionId: sessionId,
          bookId,
          startTime: Date.now(),
          isPaused: false,
          pausedDuration: 0,
          pausedAt: null,
        })
      },

      pauseSession: () => {
        set({
          isPaused: true,
          pausedAt: Date.now(),
        })
      },

      resumeSession: () => {
        const state = get()
        if (state.pausedAt) {
          const pauseDuration = Date.now() - state.pausedAt
          set({
            isPaused: false,
            pausedDuration: state.pausedDuration + pauseDuration,
            pausedAt: null,
          })
        }
      },

      stopSession: () => {
        set({
          activeSessionId: null,
          bookId: null,
          startTime: null,
          isPaused: false,
          pausedDuration: 0,
          pausedAt: null,
        })
      },

      getElapsedTime: () => {
        const state = get()
        if (!state.startTime) return 0

        const now = state.isPaused && state.pausedAt ? state.pausedAt : Date.now()
        const elapsed = now - state.startTime - state.pausedDuration

        return Math.floor(elapsed / 1000) // return in seconds
      },
    }),
    {
      name: 'session-storage',
    }
  )
)
