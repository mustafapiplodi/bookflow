'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Book } from '@/types/database'
import { BookOpen, MoreVertical, Trash2, Edit } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteBook } from '@/hooks/use-books'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteBook = useDeleteBook()

  function handleDelete() {
    deleteBook.mutate(book.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className="group relative">
        <Link href={`/library/${book.id}`}>
          <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg mb-3 overflow-hidden relative hover:shadow-lg transition-shadow">
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
            )}
          </div>
        </Link>

        {/* Actions dropdown */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/library/${book.id}/edit`} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link href={`/library/${book.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-1">{book.author}</p>
          {book.rating && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xs">
                  {i < book.rating! ? '⭐' : '☆'}
                </span>
              ))}
            </div>
          )}
        </Link>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete book?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{book.title}" and all associated notes, sessions, and actions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
