'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  Tag,
  Trash2,
  Circle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  getActionItem,
  updateActionItem,
  deleteActionItem,
  type ActionItemWithBook,
  type ActionStatus,
  type Subtask,
} from '@/lib/api/action-items'
import { EditActionItemDialog } from '@/components/action-items/edit-action-item-dialog'

const priorityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
}

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, color: 'text-muted-foreground' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-600' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-600' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-gray-600' },
}

export default function ActionItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const actionItemId = params.id as string

  const [actionItem, setActionItem] = useState<ActionItemWithBook | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [books, setBooks] = useState<Array<{ id: string; title: string; author: string }>>([])
  const [newSubtaskText, setNewSubtaskText] = useState('')

  useEffect(() => {
    loadActionItem()
    loadBooks()
  }, [actionItemId])

  async function loadActionItem() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const data = await getActionItem(user.id, actionItemId)
      setActionItem(data)
    } catch (error) {
      console.error('Error loading action item:', error)
      toast.error('Failed to load action item')
      router.push('/action-items')
    } finally {
      setLoading(false)
    }
  }

  async function loadBooks() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('books')
        .select('id, title, author')
        .eq('user_id', user.id)
        .order('title')

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error('Error loading books:', error)
    }
  }

  async function handleStatusChange(status: ActionStatus) {
    if (!actionItem) return

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      await updateActionItem(user.id, actionItem.id, { status })
      toast.success('Status updated')
      loadActionItem()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  async function handleDelete() {
    if (!actionItem) return
    if (!confirm('Are you sure you want to delete this action item?')) return

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      await deleteActionItem(user.id, actionItem.id)
      toast.success('Action item deleted')
      router.push('/action-items')
    } catch (error) {
      console.error('Error deleting action item:', error)
      toast.error('Failed to delete action item')
    }
  }

  async function toggleSubtask(subtaskId: string) {
    if (!actionItem) return

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const subtasks = actionItem.subtasks || []
    const updatedSubtasks = subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )

    await updateActionItem(user.id, actionItem.id, {
      subtasks: updatedSubtasks,
    })

    loadActionItem()
  }

  async function addSubtask() {
    if (!newSubtaskText.trim() || !actionItem) return

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const subtasks = actionItem.subtasks || []
    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      text: newSubtaskText.trim(),
      completed: false,
      order: subtasks.length,
    }

    const updatedSubtasks = [...subtasks, newSubtask]

    try {
      await updateActionItem(user.id, actionItem.id, {
        subtasks: updatedSubtasks,
      })

      setNewSubtaskText('')
      toast.success('Sub-task added')
      loadActionItem()
    } catch (error) {
      toast.error('Failed to add sub-task')
    }
  }

  async function deleteSubtask(subtaskId: string) {
    if (!actionItem) return

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const subtasks = actionItem.subtasks || []
    const updatedSubtasks = subtasks.filter((st) => st.id !== subtaskId)

    await updateActionItem(user.id, actionItem.id, {
      subtasks: updatedSubtasks,
    })

    toast.success('Sub-task deleted')
    loadActionItem()
  }

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (!actionItem) {
    return (
      <div className="container max-w-5xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-muted-foreground">Action item not found</div>
          <Button onClick={() => router.push('/action-items')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Action Items
          </Button>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[actionItem.status].icon
  const isOverdue =
    actionItem.due_date &&
    new Date(actionItem.due_date) < new Date() &&
    actionItem.status !== 'completed'
  const subtasks = actionItem.subtasks || []
  const completedSubtasks = subtasks.filter((st) => st.completed).length
  const totalSubtasks = subtasks.length
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  return (
    <>
      <div className="container max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Button variant="ghost" onClick={() => router.push('/action-items')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <StatusIcon className={cn('h-8 w-8 mt-1', statusConfig[actionItem.status].color)} />
            <div className="flex-1">
              <h1
                className={cn(
                  'text-3xl font-bold',
                  actionItem.status === 'completed' && 'line-through text-muted-foreground'
                )}
              >
                {actionItem.title}
              </h1>
              {actionItem.description && (
                <p className="text-lg text-muted-foreground mt-2">{actionItem.description}</p>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className={cn('text-sm', statusConfig[actionItem.status].color)}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[actionItem.status].label}
            </Badge>

            {actionItem.priority && (
              <Badge variant="secondary" className={cn('text-sm', priorityConfig[actionItem.priority].color)}>
                {priorityConfig[actionItem.priority].label}
              </Badge>
            )}

            {actionItem.category && (
              <Badge variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" />
                {actionItem.category}
              </Badge>
            )}

            {actionItem.is_recurring && (
              <Badge
                variant="outline"
                className="gap-1 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"
              >
                🔄 Recurring
                {actionItem.recurrence_pattern && ` (${actionItem.recurrence_pattern})`}
              </Badge>
            )}

            {actionItem.due_date && (
              <Badge variant={isOverdue ? 'destructive' : 'outline'} className="gap-1">
                {isOverdue && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                Due: {format(new Date(actionItem.due_date), 'MMM d, yyyy')}
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {actionItem.status === 'todo' && (
              <Button onClick={() => handleStatusChange('in_progress')}>
                <Clock className="mr-2 h-4 w-4" />
                Start
              </Button>
            )}
            {actionItem.status === 'in_progress' && (
              <>
                <Button onClick={() => handleStatusChange('todo')} variant="outline">
                  <Circle className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button onClick={() => handleStatusChange('completed')}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete
                </Button>
              </>
            )}
            {actionItem.status === 'completed' && (
              <Button onClick={() => handleStatusChange('todo')} variant="outline">
                <Circle className="mr-2 h-4 w-4" />
                Reactivate
              </Button>
            )}
            {actionItem.status === 'cancelled' && (
              <Button onClick={() => handleStatusChange('todo')} variant="outline">
                <Circle className="mr-2 h-4 w-4" />
                Resume
              </Button>
            )}
            {actionItem.status !== 'cancelled' && actionItem.status !== 'completed' && (
              <Button onClick={() => handleStatusChange('cancelled')} variant="ghost">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sub-tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sub-tasks</span>
                  {totalSubtasks > 0 && (
                    <Badge variant="secondary">
                      {completedSubtasks}/{totalSubtasks} ({Math.round(progress)}%)
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {totalSubtasks > 0 && (
                  <>
                    {/* Progress Bar */}
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Subtask List */}
                    <div className="space-y-2">
                      {subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => toggleSubtask(subtask.id)}
                          />
                          <span
                            className={cn(
                              'flex-1',
                              subtask.completed && 'line-through text-muted-foreground'
                            )}
                          >
                            {subtask.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSubtask(subtask.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Add New Subtask */}
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Add a sub-task..."
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSubtask()
                      }
                    }}
                  />
                  <Button onClick={addSubtask} disabled={!newSubtaskText.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {totalSubtasks === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No sub-tasks yet. Add one above to get started.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Implementation Notes */}
            {actionItem.implementation_notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Implementation Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{actionItem.implementation_notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Book Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Book
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold">{actionItem.book.title}</div>
                  <div className="text-sm text-muted-foreground">by {actionItem.book.author}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => router.push(`/books/${actionItem.book_id}`)}
                  >
                    View Book
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="font-medium">
                    {format(new Date(actionItem.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="font-medium">
                    {format(new Date(actionItem.updated_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                {actionItem.completed_at && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                      <div className="font-medium">
                        {format(new Date(actionItem.completed_at), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditActionItemDialog
        actionItem={actionItem}
        books={books}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onActionItemUpdated={loadActionItem}
      />
    </>
  )
}
