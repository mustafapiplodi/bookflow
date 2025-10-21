'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { NoteEditor } from './note-editor'
import { updateNote, Note, NoteType, NotePriority, noteTypeLabels, noteTypeIcons } from '@/lib/api/notes'
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
})

type NoteFormValues = z.infer<typeof noteSchema>

interface EditNoteDialogProps {
  note: Note
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditNoteDialog({
  note,
  userId,
  open,
  onOpenChange,
  onSuccess,
}: EditNoteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [editorContent, setEditorContent] = useState(note.content)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
  })

  useEffect(() => {
    if (note) {
      reset({
        title: note.title || undefined,
        content: note.content,
        note_type: note.note_type,
        chapter: note.chapter || undefined,
        page_number: note.page_number || undefined,
        section: note.section || undefined,
        tags: note.tags?.join(', ') || undefined,
        priority: note.priority,
        is_private: note.is_private,
        is_pinned: note.is_pinned,
      })
      setEditorContent(note.content)
    }
  }, [note, reset])

  const onSubmit = async (data: NoteFormValues) => {
    setIsLoading(true)

    try {
      const tags = data.tags ? data.tags.split(',').map((t) => t.trim()) : undefined

      const { error } = await updateNote(note.id, userId, {
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
      })

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Note updated successfully!')
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update note')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Update your note content and metadata.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Note Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="note_type">Note Type *</Label>
            <Select
              defaultValue={note.note_type}
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
                defaultValue={note.priority}
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
              placeholder="Separate tags with commas"
              {...register('tags')}
              disabled={isLoading}
            />
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
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
