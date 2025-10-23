'use client'

import { useNotes } from '@/hooks/use-notes'
import { NoteCard } from './note-card'
import { Skeleton } from '@/components/ui/skeleton'

interface NotesListProps {
  bookId?: string
  showBookTitles?: boolean
}

export function NotesList({ bookId, showBookTitles = false }: NotesListProps) {
  const { data: notes, isLoading } = useNotes(bookId)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8 text-slate-600">
        No notes yet. Start taking notes during your reading sessions.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          showBookTitle={showBookTitles}
        />
      ))}
    </div>
  )
}
