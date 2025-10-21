'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Link2,
  X,
  Search,
} from 'lucide-react'
import { NoteType, noteTypeIcons, noteTypeLabels, createNote, getNotes, Note } from '@/lib/api/notes'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface InlineNoteEditorProps {
  userId: string
  bookId: string
  sessionId: string
  currentPage?: number
  onNoteSaved?: () => void
}

const NOTE_TYPES: { type: NoteType; label: string; icon: string; description: string }[] = [
  { type: 'idea', label: 'Idea', icon: '💡', description: 'Creative thoughts and concepts' },
  { type: 'quote', label: 'Quote', icon: '💬', description: 'Direct quotations' },
  { type: 'action', label: 'Action', icon: '✅', description: 'Actionable takeaways' },
  { type: 'question', label: 'Question', icon: '❓', description: 'Questions to explore' },
  { type: 'insight', label: 'Insight', icon: '✨', description: 'Key realizations' },
  { type: 'argument', label: 'Argument', icon: '⚖️', description: 'Logical reasoning' },
  { type: 'connection', label: 'Connection', icon: '🔗', description: 'Links to other ideas' },
  { type: 'disagreement', label: 'Disagree', icon: '❌', description: 'Points of disagreement' },
  { type: 'data', label: 'Data', icon: '📊', description: 'Statistics and facts' },
  { type: 'example', label: 'Example', icon: '📝', description: 'Concrete examples' },
  { type: 'reflection', label: 'Reflection', icon: '🤔', description: 'Personal reflections' },
  { type: 'definition', label: 'Definition', icon: '📖', description: 'Key definitions' },
]

export function InlineNoteEditor({
  userId,
  bookId,
  sessionId,
  currentPage,
  onNoteSaved,
}: InlineNoteEditorProps) {
  const [selectedType, setSelectedType] = useState<NoteType>('idea')
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState('')
  const [linkedNoteIds, setLinkedNoteIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Note[]>([])
  const [allNotes, setAllNotes] = useState<Note[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type your note here...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] px-4 py-3',
      },
    },
  })

  // Load all notes when connection type is selected
  useEffect(() => {
    if (selectedType === 'connection') {
      loadAllNotes()
    }
  }, [selectedType, userId])

  // Search notes as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allNotes.filter((note) => {
      const title = note.title?.toLowerCase() || ''
      const content = note.content?.toLowerCase() || ''
      const bookTitle = note.books?.title?.toLowerCase() || ''
      return (
        title.includes(query) ||
        content.includes(query) ||
        bookTitle.includes(query)
      )
    })
    setSearchResults(filtered.slice(0, 5)) // Limit to 5 results
  }, [searchQuery, allNotes])

  const loadAllNotes = async () => {
    setIsSearching(true)
    try {
      const { data, error } = await getNotes(userId, { isArchived: false })
      if (error) throw error
      setAllNotes(data || [])
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleLinkNote = (noteId: string) => {
    if (!linkedNoteIds.includes(noteId)) {
      setLinkedNoteIds([...linkedNoteIds, noteId])
    }
    setSearchQuery('')
    setSearchResults([])
  }

  const handleUnlinkNote = (noteId: string) => {
    setLinkedNoteIds(linkedNoteIds.filter((id) => id !== noteId))
  }

  const handleSave = async () => {
    if (!content.trim() || !editor) {
      toast.error('Please write something first')
      return
    }

    setIsSaving(true)
    try {
      const noteData: any = {
        book_id: bookId,
        session_id: sessionId,
        content: content,
        note_type: selectedType,
        page_number: currentPage,
      }

      // Add linked note IDs if it's a connection note
      if (selectedType === 'connection' && linkedNoteIds.length > 0) {
        noteData.linked_note_ids = linkedNoteIds
      }

      const { error } = await createNote(userId, noteData)

      if (error) {
        throw new Error(error.message)
      }

      const linkedMsg = linkedNoteIds.length > 0 ? ` with ${linkedNoteIds.length} linked note${linkedNoteIds.length > 1 ? 's' : ''}` : ''
      toast.success(`${noteTypeLabels[selectedType]} saved${linkedMsg}!`)
      editor.commands.clearContent()
      setContent('')
      setLinkedNoteIds([])
      setSearchQuery('')
      onNoteSaved?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save note')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleQuickSave = (type: NoteType) => {
    setSelectedType(type)
    // Give a tiny delay to update state before saving
    setTimeout(() => {
      handleSave()
    }, 100)
  }

  if (!editor) return null

  return (
    <Card className="border-2 border-primary/20">
      <div className="p-4 space-y-4">
        {/* Quick Note Type Buttons */}
        <div>
          <p className="text-sm font-medium mb-2">Quick Note Type:</p>
          <div className="flex flex-wrap gap-2">
            {NOTE_TYPES.slice(0, 6).map((noteType) => (
              <Button
                key={noteType.type}
                variant={selectedType === noteType.type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(noteType.type)}
                className="gap-1"
              >
                <span>{noteType.icon}</span>
                <span className="hidden sm:inline">{noteType.label}</span>
              </Button>
            ))}
          </div>

          {/* More Note Types (collapsed) */}
          <details className="mt-2">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              More note types...
            </summary>
            <div className="flex flex-wrap gap-2 mt-2">
              {NOTE_TYPES.slice(6).map((noteType) => (
                <Button
                  key={noteType.type}
                  variant={selectedType === noteType.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(noteType.type)}
                  className="gap-1"
                >
                  <span>{noteType.icon}</span>
                  <span className="hidden sm:inline">{noteType.label}</span>
                </Button>
              ))}
            </div>
          </details>
        </div>

        {/* Selected Type Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            <span className="mr-1">{noteTypeIcons[selectedType]}</span>
            {noteTypeLabels[selectedType]}
          </Badge>
          {currentPage && (
            <span className="text-xs text-muted-foreground">Page {currentPage}</span>
          )}
        </div>

        {/* Link Notes Section (only for connection type) */}
        {selectedType === 'connection' && (
          <div className="space-y-3">
            <Separator />
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Link2 className="h-4 w-4" />
                Link to Other Notes (Optional)
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Connect this note to related notes from any book to build your knowledge graph
              </p>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes to link..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <Card className="mt-2 p-2 max-h-48 overflow-y-auto">
                  {searchResults.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => handleLinkNote(note.id)}
                      disabled={linkedNoteIds.includes(note.id)}
                      className="w-full text-left p-2 rounded hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{noteTypeIcons[note.note_type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {note.title || 'Untitled Note'}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {note.books?.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </Card>
              )}

              {/* Linked Notes */}
              {linkedNoteIds.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Linked Notes ({linkedNoteIds.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {linkedNoteIds.map((noteId) => {
                      const note = allNotes.find((n) => n.id === noteId)
                      if (!note) return null
                      return (
                        <Badge key={noteId} variant="outline" className="gap-2 pr-1">
                          <span>{noteTypeIcons[note.note_type]}</span>
                          <span className="max-w-[150px] truncate">
                            {note.title || note.books?.title || 'Untitled'}
                          </span>
                          <button
                            onClick={() => handleUnlinkNote(noteId)}
                            className="hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            <Separator />
          </div>
        )}

        {/* Mini Toolbar */}
        <div className="flex gap-1 border-b pb-2">
          <Button
            type="button"
            variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor */}
        <div className="border rounded-lg bg-background">
          <EditorContent editor={editor} />
        </div>

        {/* Actions and Tip */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Click the buttons above to select your note type, then start writing
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                editor.commands.clearContent()
                setContent('')
              }}
              disabled={isSaving || !content.trim()}
            >
              Clear
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !content.trim()}
              size="sm"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
