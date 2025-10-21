'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { createBook } from '@/lib/api/books'
import { toast } from 'sonner'

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
  status: z.enum(['want_to_read', 'reading', 'completed', 'paused', 'abandoned']).default('want_to_read'),
})

type BookFormValues = z.infer<typeof bookSchema>

interface AddBookDialogProps {
  userId: string
  onBookAdded?: () => void
}

export function AddBookDialog({ userId, onBookAdded }: AddBookDialogProps) {
  const [open, setOpen] = useState(false)
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
    defaultValues: {
      status: 'want_to_read',
    },
  })

  const onSubmit = async (data: BookFormValues) => {
    setIsLoading(true)

    try {
      await createBook(supabase, {
        ...data,
        user_id: userId,
        current_page: data.current_page || 0,
      })

      toast.success('Book added successfully!')
      reset()
      setOpen(false)
      onBookAdded?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add book')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Add a new book to your library. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="The Great Gatsby"
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
                placeholder="F. Scott Fitzgerald"
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
                placeholder="978-3-16-148410-0"
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
                placeholder="180"
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
                placeholder="0"
                defaultValue="0"
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
                placeholder="Scribner"
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
                placeholder="1925"
                {...register('publication_year')}
                disabled={isLoading}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                placeholder="English"
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
                placeholder="4.5"
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
                defaultValue="want_to_read"
                onValueChange={(value) => setValue('status', value as any)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
