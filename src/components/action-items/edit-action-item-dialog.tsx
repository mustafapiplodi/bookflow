'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Edit, Plus, X, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { updateActionItem, type ActionItemWithBook, type ActionPriority, type ActionStatus, type Subtask } from '@/lib/api/action-items'
import { createClient } from '@/lib/supabase/client'

const PREDEFINED_CATEGORIES = [
  'Habit',
  'Exercise',
  'Mindset',
  'Business',
  'Personal',
  'Health',
  'Finance',
  'Learning',
  'Productivity',
  'Relationships',
]

const formSchema = z.object({
  book_id: z.string().min(1, 'Book is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']).nullable(),
  status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']).default('todo'),
  due_date: z.date().optional().nullable(),
  category: z.string().optional(),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z.string().optional(),
  implementation_notes: z.string().optional(),
})

interface EditActionItemDialogProps {
  actionItem: ActionItemWithBook | null
  books: Array<{ id: string; title: string; author: string }>
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionItemUpdated: () => void
}

export function EditActionItemDialog({
  actionItem,
  books,
  open,
  onOpenChange,
  onActionItemUpdated,
}: EditActionItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [newSubtaskText, setNewSubtaskText] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      book_id: '',
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      category: '',
      is_recurring: false,
      recurrence_pattern: '',
      implementation_notes: '',
    },
  })

  // Update form when actionItem changes
  useEffect(() => {
    if (actionItem) {
      form.reset({
        book_id: actionItem.book_id,
        title: actionItem.title,
        description: actionItem.description || '',
        priority: actionItem.priority || 'medium',
        status: actionItem.status,
        due_date: actionItem.due_date ? new Date(actionItem.due_date) : undefined,
        category: actionItem.category || 'none',
        is_recurring: actionItem.is_recurring || false,
        recurrence_pattern: actionItem.recurrence_pattern || '',
        implementation_notes: actionItem.implementation_notes || '',
      })
      setSubtasks(actionItem.subtasks || [])
    }
  }, [actionItem, form])

  function addSubtask() {
    if (!newSubtaskText.trim()) return
    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      text: newSubtaskText.trim(),
      completed: false,
      order: subtasks.length,
    }
    setSubtasks([...subtasks, newSubtask])
    setNewSubtaskText('')
  }

  function toggleSubtask(id: string) {
    setSubtasks(subtasks.map(st =>
      st.id === id ? { ...st, completed: !st.completed } : st
    ))
  }

  function deleteSubtask(id: string) {
    setSubtasks(subtasks.filter(st => st.id !== id))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!actionItem) return

    try {
      setIsSubmitting(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('You must be logged in to update action items')
        return
      }

      await updateActionItem(user.id, actionItem.id, {
        title: values.title,
        description: values.description || null,
        priority: values.priority as ActionPriority,
        status: values.status as ActionStatus,
        category: values.category === 'none' ? null : values.category || null,
        is_recurring: values.is_recurring,
        recurrence_pattern: values.recurrence_pattern || null,
        implementation_notes: values.implementation_notes || null,
        subtasks: subtasks,
      })

      toast.success('Action item updated successfully')
      onOpenChange(false)
      onActionItemUpdated()
    } catch (error) {
      console.error('Error updating action item:', error)
      toast.error('Failed to update action item')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!actionItem) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Action Item</DialogTitle>
          <DialogDescription>
            Update your action item details
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-4">
            <FormField
              control={form.control}
              name="book_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title} by {book.author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What do you want to do?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about this action..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || 'medium'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {PREDEFINED_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurrence_pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrence</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''} disabled={!form.watch('is_recurring')}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Make this recurring</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Automatically create next occurrence when completed
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Subtasks Section */}
            <div className="space-y-3">
              <Label>Sub-tasks</Label>
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => toggleSubtask(subtask.id)}
                    />
                    <span className={subtask.completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
                      {subtask.text}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => deleteSubtask(subtask.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
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
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSubtask}
                    disabled={!newSubtaskText.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="implementation_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Implementation Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add steps, checkpoints, or implementation details..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Action Item'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
