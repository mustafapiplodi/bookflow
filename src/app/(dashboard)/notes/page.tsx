'use client'

import { NotesList } from '@/components/notes/notes-list'

export default function NotesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notes</h1>
        <p className="text-slate-600">
          All your reading notes in one place
        </p>
      </div>

      <NotesList showBookTitles />
    </div>
  )
}
