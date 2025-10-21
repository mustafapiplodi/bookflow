'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Loader2,
} from 'lucide-react'
import { NoteType, noteTypeIcons, noteTypeLabels, createNote } from '@/lib/api/notes'
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

  const handleSave = async () => {
    if (!content.trim() || !editor) {
      toast.error('Please write something first')
      return
    }

    setIsSaving(true)
    try {
      const { error } = await createNote(userId, {
        book_id: bookId,
        session_id: sessionId,
        content: content,
        note_type: selectedType,
        page_number: currentPage,
      })

      if (error) {
        throw new Error(error.message)
      }

      toast.success(`${noteTypeLabels[selectedType]} saved!`)
      editor.commands.clearContent()
      setContent('')
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
