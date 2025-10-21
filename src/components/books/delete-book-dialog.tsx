'use client'

import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { deleteBook } from '@/lib/api/books'
import { toast } from 'sonner'

interface DeleteBookDialogProps {
  bookId: string | null
  bookTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onBookDeleted?: () => void
}

export function DeleteBookDialog({ bookId, bookTitle, open, onOpenChange, userId, onBookDeleted }: DeleteBookDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!bookId) return

    setIsLoading(true)

    try {
      await deleteBook(supabase, bookId, userId)

      toast.success('Book deleted successfully!')
      onOpenChange(false)
      onBookDeleted?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete book')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Book</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <strong>{bookTitle}</strong>?
            This will also delete all related notes, reading sessions, and other data.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
