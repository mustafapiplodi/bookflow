'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface SessionEndDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    session_mood?: 'happy' | 'neutral' | 'sad'
    key_insight?: string
  }) => void
  durationSeconds: number // in seconds
  isPending: boolean
}

export function SessionEndDialog({
  open,
  onOpenChange,
  onSubmit,
  durationSeconds,
  isPending,
}: SessionEndDialogProps) {
  const [selectedMood, setSelectedMood] = useState<'happy' | 'neutral' | 'sad' | null>(null)
  const [keyInsight, setKeyInsight] = useState('')

  // Format duration nicely
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}${secs > 0 ? ` and ${secs} second${secs !== 1 ? 's' : ''}` : ''}`
    } else {
      return `${secs} second${secs !== 1 ? 's' : ''}`
    }
  }

  const handleSubmit = () => {
    onSubmit({
      session_mood: selectedMood || undefined,
      key_insight: keyInsight || undefined,
    })
    // Reset form
    setSelectedMood(null)
    setKeyInsight('')
  }

  const moods = [
    { value: 'happy' as const, emoji: '😊', label: 'Great!' },
    { value: 'neutral' as const, emoji: '😐', label: 'Okay' },
    { value: 'sad' as const, emoji: '😕', label: 'Meh' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Complete! 🎉</DialogTitle>
          <DialogDescription>
            You read for {formatDuration(durationSeconds)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Mood selector */}
          <div className="space-y-2">
            <Label>How was this session?</Label>
            <div className="flex gap-2 justify-center">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    selectedMood === mood.value
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs text-slate-600">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Key insight */}
          <div className="space-y-2">
            <Label htmlFor="key-insight">
              Capture one key insight (optional)
            </Label>
            <Textarea
              id="key-insight"
              placeholder="What stood out to you in this session?"
              value={keyInsight}
              onChange={(e) => setKeyInsight(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Saving...' : 'Done'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
