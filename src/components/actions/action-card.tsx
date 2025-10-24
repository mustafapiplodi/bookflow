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
import { CheckCircle, Circle, BookOpen, MoreVertical, Square, Trash2, Edit, Save, X } from 'lucide-react'
import { CompleteActionDialog } from './complete-action-dialog'
import { useDeleteAction } from '@/hooks/use-actions'
import { useToggleActionItem, useUpdateNote } from '@/hooks/use-notes'
import { toast } from 'sonner'
import { RichTextEditor } from '../notes/rich-text-editor'
import { NoteTags } from '../notes/note-tags'

interface ActionCardProps {
  action: {
    id: string
    note_id: string
    is_completed: boolean | null
    completed_at: string | null
    outcome: string | null
    created_at: string
    note: {
      content: string
      books?: {
        id: string
        title: string
      } | null
    }
  }
}

export function ActionCard({ action }: ActionCardProps) {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(action.note.content)

  const isCompleted = action.is_completed
  const deleteAction = useDeleteAction()
  const toggleAction = useToggleActionItem()
  const updateNote = useUpdateNote()

  const handleCompleteClick = () => {
    if (!isCompleted) {
      setShowCompleteDialog(true)
    }
  }

  const handleUnmarkAction = async () => {
    try {
      await toggleAction.mutateAsync({
        id: action.note_id,
        isActionItem: false,
      })
      toast.success('Removed from actions')
      setShowMenu(false)
    } catch (error) {
      toast.error('Failed to remove action')
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setShowMenu(false)
  }

  const handleSaveEdit = async () => {
    // Check if content is empty (only has empty paragraph tags)
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editContent
    const textContent = tempDiv.textContent || tempDiv.innerText || ''

    if (!textContent.trim()) {
      toast.error('Content cannot be empty')
      return
    }

    try {
      await updateNote.mutateAsync({
        id: action.note_id,
        updates: { content: editContent }
      })
      toast.success('Action updated')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update action')
    }
  }

  const handleCancelEdit = () => {
    setEditContent(action.note.content)
    setIsEditing(false)
  }

  const handleDeleteClick = () => {
    setShowMenu(false)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    try {
      await deleteAction.mutateAsync(action.id)
      toast.success('Action deleted')
      setShowDeleteDialog(false)
    } catch (error) {
      toast.error('Failed to delete action')
    }
  }

  return (
    <>
      <Card className={`p-4 hover:shadow-md transition-shadow ${isCompleted ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : ''}`}>
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            {action.note.books && (
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {action.note.books.title}
                </p>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-2">
                <RichTextEditor
                  content={editContent}
                  onChange={setEditContent}
                  placeholder="Edit your action..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={updateNote.isPending}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    {updateNote.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={updateNote.isPending}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`text-slate-800 dark:text-slate-200 prose prose-sm max-w-none dark:prose-invert ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}
                dangerouslySetInnerHTML={{ __html: action.note.content }}
              />
            )}

            {action.outcome && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">Outcome:</p>
                <p className="text-sm text-green-700 dark:text-green-300">{action.outcome}</p>
              </div>
            )}

            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Created {format(new Date(action.created_at), 'MMM d, yyyy')}
                </p>
                {isCompleted && action.completed_at && (
                  <>
                    <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                    <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Completed {format(new Date(action.completed_at), 'MMM d, yyyy')}
                    </Badge>
                  </>
                )}
              </div>
              <NoteTags noteId={action.note_id} editable={!isEditing && !isCompleted} />
            </div>
          </div>

          {/* Mark Complete Button & Three dots menu */}
          {!isEditing && (
            <div className="flex items-start gap-2 flex-shrink-0">
              {isCompleted ? (
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-700 dark:hover:text-green-300 hover:border-green-300 dark:hover:border-green-700 transition-colors"
                  onClick={handleCompleteClick}
                >
                  <Circle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
              )}

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
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
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                    <button
                      onClick={handleEditClick}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center dark:text-slate-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleUnmarkAction}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center dark:text-slate-200"
                      disabled={toggleAction.isPending}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Remove from Actions
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </>
              )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <CompleteActionDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        actionId={action.id}
        actionContent={action.note.content}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this action? This action cannot be undone.
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
