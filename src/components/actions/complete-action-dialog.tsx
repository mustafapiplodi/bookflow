'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useCompleteAction } from '@/hooks/use-actions'
import { toast } from 'sonner'

interface CompleteActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionId: string
  actionContent: string
}

export function CompleteActionDialog({
  open,
  onOpenChange,
  actionId,
  actionContent,
}: CompleteActionDialogProps) {
  const [outcome, setOutcome] = useState('')
  const completeAction = useCompleteAction()

  const handleComplete = async () => {
    try {
      await completeAction.mutateAsync({
        actionId,
        outcome: outcome.trim() || undefined,
      })
      toast.success('Action completed! Well done!')
      setOutcome('')
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to complete action')
    }
  }

  const handleCancel = () => {
    setOutcome('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Complete Action Item</DialogTitle>
          <DialogDescription>
            Share how applying this insight impacted your life
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 bg-slate-50 rounded-md">
            <p className="text-sm font-medium text-slate-700 mb-1">Action:</p>
            <p className="text-sm text-slate-600">{actionContent}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome">
              Outcome <span className="text-slate-500 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="outcome"
              placeholder="What happened when you applied this? How did it help you?"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-slate-500">
              Recording outcomes helps you remember which books had the biggest impact
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={completeAction.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={completeAction.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {completeAction.isPending ? 'Completing...' : 'Mark as Complete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
