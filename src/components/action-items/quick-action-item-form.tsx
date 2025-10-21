'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { createActionItem, type ActionPriority } from '@/lib/api/action-items'

interface QuickActionItemFormProps {
  userId: string
  bookId: string
  sessionId?: string
  onActionItemCreated?: () => void
}

export function QuickActionItemForm({
  userId,
  bookId,
  sessionId,
  onActionItemCreated,
}: QuickActionItemFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<ActionPriority>('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    try {
      setIsSubmitting(true)

      await createActionItem(userId, {
        book_id: bookId,
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status: 'todo',
      })

      toast.success('Action item created!')

      // Reset form
      setTitle('')
      setDescription('')
      setPriority('medium')
      setIsExpanded(false)

      onActionItemCreated?.()
    } catch (error) {
      console.error('Error creating action item:', error)
      toast.error('Failed to create action item')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isExpanded) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={() => setIsExpanded(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Quick Add Action Item
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">✅ Quick Add Action Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-title">What do you want to do?</Label>
            <Input
              id="quick-title"
              placeholder="e.g., Implement daily meditation practice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-description">Description (Optional)</Label>
            <Textarea
              id="quick-description"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as ActionPriority)}>
              <SelectTrigger id="quick-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : 'Create Action Item'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsExpanded(false)
                setTitle('')
                setDescription('')
                setPriority('medium')
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
