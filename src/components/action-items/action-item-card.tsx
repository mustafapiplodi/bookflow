'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit,
  BookOpen,
  AlertCircle,
  XCircle,
  FileText,
  Tag,
  Plus,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { updateActionItem } from '@/lib/api/action-items'
import { createClient } from '@/lib/supabase/client'
import type { ActionItemWithBook, ActionPriority, ActionStatus, Subtask } from '@/lib/api/action-items'

interface ActionItemCardProps {
  actionItem: ActionItemWithBook
  onStatusChange: (id: string, status: ActionStatus) => void
  onEdit: (actionItem: ActionItemWithBook) => void
  onDelete: (id: string) => void
}

const priorityConfig = {
  high: { label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
}

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, color: 'text-muted-foreground', buttonLabel: 'Start' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-600', buttonLabel: 'Pause' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-600', buttonLabel: 'Reactivate' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-gray-600', buttonLabel: 'Resume' },
}

export function ActionItemCard({ actionItem, onStatusChange, onEdit, onDelete }: ActionItemCardProps) {
  const router = useRouter()
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [newSubtaskText, setNewSubtaskText] = useState('')
  const StatusIcon = statusConfig[actionItem.status].icon
  const isOverdue = actionItem.due_date && new Date(actionItem.due_date) < new Date() && actionItem.status !== 'completed'
  const isRecurring = actionItem.is_recurring

  // Calculate subtask progress
  const subtasks = actionItem.subtasks || []
  const completedSubtasks = subtasks.filter(st => st.completed).length
  const totalSubtasks = subtasks.length
  const hasSubtasks = totalSubtasks > 0

  // Determine next status based on current status
  const getNextStatus = (): ActionStatus => {
    switch (actionItem.status) {
      case 'todo':
        return 'in_progress'
      case 'in_progress':
        return 'todo' // Pause means go back to todo
      case 'completed':
        return 'todo'
      case 'cancelled':
        return 'todo'
      default:
        return 'todo'
    }
  }

  const getQuickAction = () => {
    const nextStatus = getNextStatus()
    return {
      label: statusConfig[actionItem.status].buttonLabel,
      status: nextStatus,
    }
  }

  async function toggleSubtask(subtaskId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const updatedSubtasks = subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )

    await updateActionItem(user.id, actionItem.id, {
      subtasks: updatedSubtasks,
    })

    // Trigger refresh
    window.dispatchEvent(new Event('action-items-updated'))
  }

  async function addSubtask() {
    if (!newSubtaskText.trim()) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

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

      // Trigger refresh
      window.dispatchEvent(new Event('action-items-updated'))
    } catch (error) {
      toast.error('Failed to add sub-task')
    }
  }

  return (
    <Card className={cn(
      'transition-all hover:shadow-md',
      actionItem.status === 'completed' && 'opacity-60'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <StatusIcon className={cn('h-5 w-5', statusConfig[actionItem.status].color)} />
              <h3
                className={cn(
                  'font-semibold leading-none cursor-pointer hover:underline',
                  actionItem.status === 'completed' && 'line-through'
                )}
                onClick={() => router.push(`/action-items/${actionItem.id}`)}
              >
                {actionItem.title}
              </h3>
            </div>
            {actionItem.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {actionItem.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/action-items/${actionItem.id}`)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(actionItem)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(actionItem.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {actionItem.priority && (
            <Badge variant="secondary" className={priorityConfig[actionItem.priority].color}>
              {priorityConfig[actionItem.priority].label}
            </Badge>
          )}

          {actionItem.due_date && (
            <Badge variant={isOverdue ? 'destructive' : 'outline'} className="gap-1">
              {isOverdue && <AlertCircle className="h-3 w-3" />}
              Due: {format(new Date(actionItem.due_date), 'MMM d')}
            </Badge>
          )}

          {actionItem.category && (
            <Badge variant="secondary" className="gap-1">
              <Tag className="h-3 w-3" />
              {actionItem.category}
            </Badge>
          )}

          {isRecurring && (
            <Badge variant="outline" className="gap-1 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
              🔄 Recurring
            </Badge>
          )}

          <Badge
            variant="outline"
            className="gap-1 cursor-pointer hover:bg-accent"
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            <CheckCircle2 className="h-3 w-3" />
            {hasSubtasks ? `${completedSubtasks}/${totalSubtasks} tasks` : 'Add sub-tasks'}
          </Badge>

          <Badge variant="outline" className={cn('gap-1', statusConfig[actionItem.status].color)}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig[actionItem.status].label}
          </Badge>
        </div>

        {/* Subtasks List (Collapsible) */}
        {showSubtasks && (
          <div className="space-y-2 pt-2">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => toggleSubtask(subtask.id)}
                />
                <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                  {subtask.text}
                </span>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Input
                placeholder="Add a sub-task..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                    addSubtask()
                  }
                }}
                className="text-sm h-8"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubtask}
                disabled={!newSubtaskText.trim()}
                className="h-8 px-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Implementation Notes Preview */}
        {actionItem.implementation_notes && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2">{actionItem.implementation_notes}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-0">
        {/* Book Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{actionItem.book.title}</span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 w-full">
          <Button
            size="sm"
            variant={actionItem.status === 'in_progress' ? 'default' : actionItem.status === 'completed' ? 'outline' : 'default'}
            onClick={() => {
              const action = getQuickAction()
              onStatusChange(actionItem.id, action.status)
            }}
            className="flex-1"
          >
            {actionItem.status === 'todo' && <Circle className="h-4 w-4 mr-1" />}
            {actionItem.status === 'in_progress' && <Clock className="h-4 w-4 mr-1" />}
            {actionItem.status === 'completed' && <Circle className="h-4 w-4 mr-1" />}
            {actionItem.status === 'cancelled' && <Circle className="h-4 w-4 mr-1" />}
            {getQuickAction().label}
          </Button>

          {actionItem.status === 'in_progress' && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onStatusChange(actionItem.id, 'completed')}
              className="flex-1"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}

          {actionItem.status !== 'cancelled' && actionItem.status !== 'completed' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onStatusChange(actionItem.id, 'cancelled')}
              className="px-3"
              title="Cancel"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(actionItem)}
            className="px-3"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(actionItem.id)}
            className="px-3 text-destructive hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
