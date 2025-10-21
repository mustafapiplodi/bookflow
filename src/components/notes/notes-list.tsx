'use client'

import { useEffect, useState } from 'react'
import { StickyNote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NoteCard } from './note-card'
import { EditNoteDialog } from './edit-note-dialog'
import { DeleteNoteDialog } from './delete-note-dialog'
import {
  getNotes,
  toggleNotePin,
  toggleNoteArchive,
  Note,
} from '@/lib/api/notes'
import { toast } from 'sonner'

interface NotesListProps {
  userId: string
  bookId?: string
  showBookInfo?: boolean
  onRefresh?: () => void
  searchQuery?: string
  noteType?: string
}

export function NotesList({
  userId,
  bookId,
  showBookInfo = false,
  onRefresh,
  searchQuery = '',
  noteType = 'all',
}: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showArchived, setShowArchived] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [userId, bookId, showArchived])

  useEffect(() => {
    filterNotes()
  }, [notes, searchQuery, noteType])

  const fetchNotes = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await getNotes(userId, {
        bookId,
        isArchived: showArchived,
      })

      if (error) {
        throw new Error(error.message)
      }

      setNotes(data || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch notes')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterNotes = () => {
    let filtered = [...notes]

    // Filter by search query (from parent)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (note) =>
          note.title?.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Filter by note type (from parent)
    if (noteType && noteType !== 'all') {
      filtered = filtered.filter((note) => note.note_type === noteType)
    }

    setFilteredNotes(filtered)
  }

  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    try {
      const { error } = await toggleNotePin(noteId, userId, isPinned)

      if (error) {
        throw new Error(error.message)
      }

      toast.success(isPinned ? 'Note pinned' : 'Note unpinned')
      fetchNotes()
      onRefresh?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update note')
      console.error(error)
    }
  }

  const handleToggleArchive = async (noteId: string, isArchived: boolean) => {
    try {
      const { error } = await toggleNoteArchive(noteId, userId, isArchived)

      if (error) {
        throw new Error(error.message)
      }

      toast.success(isArchived ? 'Note archived' : 'Note unarchived')
      fetchNotes()
      onRefresh?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update note')
      console.error(error)
    }
  }

  const handleDeleteSuccess = () => {
    toast.success('Note deleted successfully')
    setDeletingNoteId(null)
    fetchNotes()
    onRefresh?.()
  }

  const handleEditSuccess = () => {
    setEditingNote(null)
    fetchNotes()
    onRefresh?.()
  }

  // Separate pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter((note) => note.is_pinned)
  const unpinnedNotes = filteredNotes.filter((note) => !note.is_pinned)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <StickyNote className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Show Archived Toggle */}
      <div className="flex items-center justify-between">
        <Tabs
          value={showArchived ? 'archived' : 'active'}
          onValueChange={(value) => setShowArchived(value === 'archived')}
        >
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <StickyNote className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              {searchQuery || noteType !== 'all'
                ? 'No notes found matching your filters'
                : showArchived
                ? 'No archived notes yet'
                : 'No notes yet'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Pinned Notes
                </h3>
                <Badge variant="secondary">{pinnedNotes.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    showBookInfo={showBookInfo}
                    onEdit={setEditingNote}
                    onDelete={setDeletingNoteId}
                    onTogglePin={handleTogglePin}
                    onToggleArchive={handleToggleArchive}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notes */}
          {unpinnedNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    All Notes
                  </h3>
                  <Badge variant="secondary">{unpinnedNotes.length}</Badge>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    showBookInfo={showBookInfo}
                    onEdit={setEditingNote}
                    onDelete={setDeletingNoteId}
                    onTogglePin={handleTogglePin}
                    onToggleArchive={handleToggleArchive}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {editingNote && (
        <EditNoteDialog
          note={editingNote}
          userId={userId}
          open={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Dialog */}
      {deletingNoteId && (
        <DeleteNoteDialog
          noteId={deletingNoteId}
          userId={userId}
          open={!!deletingNoteId}
          onOpenChange={(open) => !open && setDeletingNoteId(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}
