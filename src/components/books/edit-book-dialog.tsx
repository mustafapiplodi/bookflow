'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { updateBook } from '@/lib/api/books'
import { toast } from 'sonner'
import { Database } from '@/types/database'

type BookType = Database['public']['Tables']['books']['Row']

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().optional(),
  genre: z.string().optional(),
  total_pages: z.coerce.number().min(1, 'Total pages must be at least 1').optional(),
  current_page: z.coerce.number().min(0, 'Current page must be at least 0').optional(),
  publisher: z.string().optional(),
  publication_year: z.coerce.number().optional(),
  language: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  status: z.enum(['want_to_read', 'reading', 'completed', 'paused', 'abandoned']),
})

type BookFormValues = z.infer<typeof bookSchema>

interface EditBookDialogProps {
  book: BookType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onBookUpdated?: () => void
}

export function EditBookDialog({ book, open, onOpenChange, userId, onBookUpdated }: EditBookDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  })

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        author: book.author,
        isbn: book.isbn || undefined,
        genre: book.genre || undefined,
        total_pages: book.total_pages || undefined,
        current_page: book.current_page,
        publisher: book.publisher || undefined,
        publication_year: book.publication_year || undefined,
        language: book.language || undefined,
        rating: book.rating || undefined,
        status: book.status,
      })
    }
  }, [book, reset])

  const onSubmit = async (data: BookFormValues) => {
    if (!book) return

    setIsLoading(true)

    try {
      await updateBook(supabase, book.id, data, userId)

      toast.success('Book updated successfully!')
      onOpenChange(false)
      onBookUpdated?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update book')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the details of your book.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                {...register('author')}
                disabled={isLoading}
              />
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author.message}</p>
              )}
            </div>

            {/* ISBN */}
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                {...register('isbn')}
                disabled={isLoading}
              />
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                placeholder="Fiction, Non-Fiction, Biography, etc."
                {...register('genre')}
                disabled={isLoading}
              />
            </div>

            {/* Total Pages */}
            <div className="space-y-2">
              <Label htmlFor="total_pages">Total Pages</Label>
              <Input
                id="total_pages"
                type="number"
                {...register('total_pages')}
                disabled={isLoading}
              />
              {errors.total_pages && (
                <p className="text-sm text-destructive">{errors.total_pages.message}</p>
              )}
            </div>

            {/* Current Page */}
            <div className="space-y-2">
              <Label htmlFor="current_page">Current Page</Label>
              <Input
                id="current_page"
                type="number"
                {...register('current_page')}
                disabled={isLoading}
              />
              {errors.current_page && (
                <p className="text-sm text-destructive">{errors.current_page.message}</p>
              )}
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                {...register('publisher')}
                disabled={isLoading}
              />
            </div>

            {/* Publication Year */}
            <div className="space-y-2">
              <Label htmlFor="publication_year">Publication Year</Label>
              <Input
                id="publication_year"
                type="number"
                {...register('publication_year')}
                disabled={isLoading}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                {...register('language')}
                disabled={isLoading}
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register('rating')}
                disabled={isLoading}
              />
              {errors.rating && (
                <p className="text-sm text-destructive">{errors.rating.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={book?.status}
                onValueChange={(value) => setValue('status', value as any)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="want_to_read">Want to Read</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
