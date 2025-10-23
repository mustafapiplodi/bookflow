'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { MoreVertical, CheckSquare, Square, Trash2, Edit } from 'lucide-react'
import { useDeleteNote, useToggleActionItem } from '@/hooks/use-notes'
import { toast } from 'sonner'

interface NoteCardProps {
  note: {
    id: string
    content: string
    is_action_item: boolean | null
    created_at: string
    books?: {
      title: string
    } | null
  }
  onEdit?: () => void
  showBookTitle?: boolean
}

export function NoteCard({ note, onEdit, showBookTitle = false }: NoteCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const deleteNote = useDeleteNote()
  const toggleAction = useToggleActionItem()

  const handleDelete = async () => {
    try {
      await deleteNote.mutateAsync(note.id)
      toast.success('Note deleted')
      setShowDeleteDialog(false)
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  const handleToggleAction = async () => {
    try {
      await toggleAction.mutateAsync({
        id: note.id,
        isActionItem: !note.is_action_item,
      })
      toast.success(
        note.is_action_item ? 'Removed from actions' : 'Added to action items'
      )
      setShowMenu(false)
    } catch (error) {
      toast.error('Failed to update note')
    }
  }

  const handleDeleteClick = () => {
    setShowMenu(false)
    setShowDeleteDialog(true)
  }

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {showBookTitle && note.books && (
              <p className="text-xs text-slate-500 mb-1">
                {note.books.title}
              </p>
            )}
            <p className="text-slate-800 whitespace-pre-wrap break-words">
              {note.content}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <p className="text-xs text-slate-500">
                {format(new Date(note.created_at), 'MMM d, yyyy')}
              </p>
              {note.is_action_item && (
                <Badge variant="secondary" className="text-xs">
                  Action Item
                </Badge>
              )}
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit()
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={handleToggleAction}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center"
                  >
                    {note.is_action_item ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Remove from Actions
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Mark as Action
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
