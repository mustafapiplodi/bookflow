'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { NoteEditor } from './note-editor'
import { createNote, NoteType, NotePriority, noteTypeLabels, noteTypeIcons } from '@/lib/api/notes'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const noteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  note_type: z.enum([
    'idea',
    'argument',
    'action',
    'quote',
    'question',
    'connection',
    'disagreement',
    'insight',
    'data',
    'example',
    'reflection',
    'definition',
  ]),
  chapter: z.string().optional(),
  page_number: z.coerce.number().optional(),
  section: z.string().optional(),
  tags: z.string().optional(),
  priority: z.enum(['urgent', 'important', 'interesting', 'none']).optional(),
  is_private: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
  color: z.string().optional(),
})

type NoteFormValues = z.infer<typeof noteSchema>

interface AddNoteDialogProps {
  userId: string
  bookId: string
  sessionId?: string
  books?: Array<{ id: string; title: string; author: string }>
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function AddNoteDialog({
  userId,
  bookId,
  sessionId,
  books,
  onSuccess,
  trigger,
}: AddNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editorContent, setEditorContent] = useState('')
  const [selectedBookId, setSelectedBookId] = useState(bookId)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note_type: 'idea',
      priority: 'none',
      is_private: false,
      is_pinned: false,
    },
  })

  const selectedType = watch('note_type')

  // Show book selector if no bookId provided and books list is available
  const showBookSelector = !bookId && books && books.length > 0

  const onSubmit = async (data: NoteFormValues) => {
    // Validate book selection if book selector is shown
    if (showBookSelector && !selectedBookId) {
      toast.error('Please select a book for this note')
      return
    }

    setIsLoading(true)

    try {
      const tags = data.tags ? data.tags.split(',').map((t) => t.trim()) : undefined

      const { error } = await createNote(userId, {
        book_id: selectedBookId || bookId,
        session_id: sessionId,
        title: data.title,
        content: editorContent,
        note_type: data.note_type,
        chapter: data.chapter,
        page_number: data.page_number,
        section: data.section,
        tags,
        priority: data.priority,
        is_private: data.is_private,
        is_pinned: data.is_pinned,
        color: data.color,
      })

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Note created successfully!')
      setOpen(false)
      reset()
      setEditorContent('')
      setSelectedBookId(bookId)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create note')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Capture your thoughts, insights, and ideas from your reading.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Book Selector (only shown when called from notes page) */}
          {showBookSelector && (
            <div className="space-y-2">
              <Label htmlFor="book_id">Book *</Label>
              <Select
                value={selectedBookId}
                onValueChange={setSelectedBookId}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a book..." />
                </SelectTrigger>
                <SelectContent>
                  {books?.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{book.title}</span>
                        <span className="text-xs text-muted-foreground">{book.author}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Note Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="note_type">Note Type *</Label>
            <Select
              defaultValue="idea"
              onValueChange={(value) => setValue('note_type', value as NoteType)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(noteTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <span>{noteTypeIcons[value as NoteType]}</span>
                      <span>{label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Give your note a title..."
              {...register('title')}
              disabled={isLoading}
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label>Content *</Label>
            <NoteEditor
              content={editorContent}
              onChange={setEditorContent}
              placeholder="Start writing your note..."
              editable={!isLoading}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Chapter */}
            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Input
                id="chapter"
                placeholder="e.g., Chapter 5"
                {...register('chapter')}
                disabled={isLoading}
              />
            </div>

            {/* Page Number */}
            <div className="space-y-2">
              <Label htmlFor="page_number">Page Number</Label>
              <Input
                id="page_number"
                type="number"
                placeholder="e.g., 42"
                {...register('page_number')}
                disabled={isLoading}
              />
            </div>

            {/* Section */}
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                placeholder="e.g., Introduction"
                {...register('section')}
                disabled={isLoading}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                defaultValue="none"
                onValueChange={(value) => setValue('priority', value as NotePriority)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="interesting">Interesting</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Separate tags with commas (e.g., motivation, productivity)"
              {...register('tags')}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter tags separated by commas
            </p>
          </div>

          {/* Options */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('is_pinned')}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">Pin this note</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('is_private')}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">Private note</span>
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
