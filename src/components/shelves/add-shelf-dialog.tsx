'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { createShelf } from '@/lib/api/shelves'
import { toast } from 'sonner'

const shelfSchema = z.object({
  name: z.string().min(1, 'Shelf name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
})

type ShelfFormValues = z.infer<typeof shelfSchema>

interface AddShelfDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onShelfAdded?: () => void
}

export function AddShelfDialog({ userId, open, onOpenChange, onShelfAdded }: AddShelfDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShelfFormValues>({
    resolver: zodResolver(shelfSchema),
  })

  const onSubmit = async (data: ShelfFormValues) => {
    setIsLoading(true)

    try {
      await createShelf(supabase, {
        name: data.name,
        description: data.description || null,
        user_id: userId,
        is_default: false,
        book_count: 0,
      })

      toast.success('Shelf created successfully!')
      reset()
      onOpenChange(false)
      onShelfAdded?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create shelf')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Shelf</DialogTitle>
          <DialogDescription>
            Create a custom shelf to organize your books.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Shelf Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Science Fiction, Book Club"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description for this shelf..."
              rows={3}
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
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
              Create Shelf
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
