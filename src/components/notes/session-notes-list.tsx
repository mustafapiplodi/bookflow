'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash, StickyNote } from 'lucide-react'
import { getSessionNotes, deleteNote, Note, noteTypeIcons, noteTypeLabels, noteTypeColors } from '@/lib/api/notes'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface SessionNotesListProps {
  userId: string
  sessionId: string
  refreshKey?: number
}

export function SessionNotesList({ userId, sessionId, refreshKey }: SessionNotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [sessionId, refreshKey])

  const fetchNotes = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await getSessionNotes(sessionId, userId)

      if (error) {
        throw new Error(error.message)
      }

      setNotes(data || [])
    } catch (error: any) {
      console.error('Failed to fetch session notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (noteId: string) => {
    if (!confirm('Delete this note?')) return

    try {
      const { error } = await deleteNote(noteId, userId)

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Note deleted')
      fetchNotes()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete note')
    }
  }

  const getPlainTextPreview = (html: string, maxLength: number = 100) => {
    const text = html.replace(/<[^>]*>/g, '')
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes This Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <StickyNote className="h-8 w-8 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Notes This Session</span>
          <Badge variant="secondary">{notes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <StickyNote className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs mt-1">Start taking notes while you read!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative border rounded-lg p-3 hover:border-primary/50 transition-colors"
              >
                {/* Note Type Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className={noteTypeColors[note.note_type]}>
                    <span className="mr-1">{noteTypeIcons[note.note_type]}</span>
                    {noteTypeLabels[note.note_type]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash className="h-3 w-3 text-destructive" />
                  </Button>
                </div>

                {/* Note Content */}
                <div
                  className="prose prose-sm max-w-none text-sm"
                  dangerouslySetInnerHTML={{
                    __html: getPlainTextPreview(note.content),
                  }}
                />

                {/* Metadata */}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  {note.page_number && <span>Page {note.page_number}</span>}
                  <span>•</span>
                  <span>{format(new Date(note.created_at), 'HH:mm')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
