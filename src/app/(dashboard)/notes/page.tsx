'use client'

import { useState, useMemo } from 'react'
import { NotesList } from '@/components/notes/notes-list'
import { TagFilter } from '@/components/notes/tag-filter'
import { NoteSearch } from '@/components/notes/note-search'
import { useNotesByTag } from '@/hooks/use-tags'
import { useNotes } from '@/hooks/use-notes'
import { NoteCard } from '@/components/notes/note-card'

export default function NotesPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: taggedNotes, isLoading: isLoadingTagged } = useNotesByTag(selectedTag || '')
  const { data: allNotes, isLoading: isLoadingAll } = useNotes()

  // Filter notes by search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery) return null

    const notes = selectedTag ? taggedNotes : allNotes
    if (!notes) return []

    const query = searchQuery.toLowerCase()
    return notes.filter((note: any) =>
      note.content.toLowerCase().includes(query) ||
      note.books?.title.toLowerCase().includes(query)
    )
  }, [searchQuery, selectedTag, taggedNotes, allNotes])

  const isLoading = selectedTag ? isLoadingTagged : isLoadingAll
  const displayNotes = searchQuery ? filteredNotes : (selectedTag ? taggedNotes : null)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notes</h1>
        <p className="text-slate-600">
          All your reading notes in one place
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <NoteSearch onSearch={setSearchQuery} />
        <TagFilter selectedTag={selectedTag} onSelectTag={setSelectedTag} />
      </div>

      {searchQuery || selectedTag ? (
        <div className="space-y-4">
          {searchQuery && (
            <h2 className="text-lg font-semibold text-slate-700">
              Search results for "{searchQuery}"
              {selectedTag && ` in tag "${selectedTag}"`}
            </h2>
          )}
          {!searchQuery && selectedTag && (
            <h2 className="text-lg font-semibold text-slate-700">
              Notes tagged with "{selectedTag}"
            </h2>
          )}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : displayNotes && displayNotes.length > 0 ? (
            <div className="space-y-4">
              {displayNotes.map((note: any) => (
                <NoteCard key={note.id} note={note} showBookTitle />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">
              {searchQuery ? 'No notes found matching your search' : 'No notes found with this tag'}
            </p>
          )}
        </div>
      ) : (
        <NotesList showBookTitles />
      )}
    </div>
  )
}
