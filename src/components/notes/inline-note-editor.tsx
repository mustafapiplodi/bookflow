'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'
import { useCreateNote } from '@/hooks/use-notes'
import { toast } from 'sonner'

interface InlineNoteEditorProps {
  bookId: string
  sessionId?: string | null
}

export function InlineNoteEditor({ bookId, sessionId }: InlineNoteEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')

  const createNote = useCreateNote()

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }

    try {
      await createNote.mutateAsync({
        book_id: bookId,
        session_id: sessionId,
        content: content.trim(),
      })
      toast.success('Note saved')
      setContent('')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to save note')
    }
  }

  const handleCancel = () => {
    setContent('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a note
      </Button>
    )
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">New Note</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          placeholder="Capture your thoughts, insights, or questions..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
          autoFocus
        />

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={createNote.isPending || !content.trim()}
            className="flex-1"
          >
            {createNote.isPending ? 'Saving...' : 'Save Note'}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={createNote.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  )
}
