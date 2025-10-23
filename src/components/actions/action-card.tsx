'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, BookOpen } from 'lucide-react'
import { CompleteActionDialog } from './complete-action-dialog'

interface ActionCardProps {
  action: {
    id: string
    content: string
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
  const isCompleted = action.is_completed

  const handleCompleteClick = () => {
    if (!isCompleted) {
      setShowCompleteDialog(true)
    }
  }

  return (
    <>
      <Card className={`p-4 hover:shadow-md transition-shadow ${isCompleted ? 'bg-slate-50' : ''}`}>
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 flex-shrink-0 ${isCompleted ? 'text-green-600' : 'text-slate-400'}`}
            onClick={handleCompleteClick}
            disabled={isCompleted || false}
          >
            {isCompleted ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            {action.note.books && (
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-3 w-3 text-slate-500" />
                <p className="text-xs text-slate-500">
                  {action.note.books.title}
                </p>
              </div>
            )}

            <p className={`text-slate-800 whitespace-pre-wrap break-words ${isCompleted ? 'line-through text-slate-500' : ''}`}>
              {action.note.content}
            </p>

            {action.outcome && (
              <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-xs font-semibold text-green-800 mb-1">Outcome:</p>
                <p className="text-sm text-green-700">{action.outcome}</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <p className="text-xs text-slate-500">
                Created {format(new Date(action.created_at), 'MMM d, yyyy')}
              </p>
              {isCompleted && action.completed_at && (
                <>
                  <span className="text-xs text-slate-400">•</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Completed {format(new Date(action.completed_at), 'MMM d, yyyy')}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      <CompleteActionDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        actionId={action.id}
        actionContent={action.note.content}
      />
    </>
  )
}
