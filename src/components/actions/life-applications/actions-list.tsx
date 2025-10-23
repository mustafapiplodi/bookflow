'use client'

import { useActions } from '@/hooks/use-actions'
import { ActionCard } from './action-card'
import { Skeleton } from '@/components/ui/skeleton'

interface ActionsListProps {
  filter: 'all' | 'pending' | 'completed'
}

export function ActionsList({ filter }: ActionsListProps) {
  const { data: actions, isLoading } = useActions()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (!actions || actions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600">
        <p className="text-lg font-medium mb-2">No action items yet</p>
        <p className="text-sm">
          Mark notes as action items to start tracking your goals
        </p>
      </div>
    )
  }

  // Filter actions based on the selected tab
  const filteredActions = actions.filter((action) => {
    if (filter === 'all') return true
    if (filter === 'pending') return !action.is_completed
    if (filter === 'completed') return action.is_completed
    return true
  })

  if (filteredActions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600">
        <p className="text-lg font-medium mb-2">
          No {filter} actions
        </p>
        <p className="text-sm">
          {filter === 'completed'
            ? 'Complete some actions to see them here'
            : 'All actions have been completed!'}
        </p>
      </div>
    )
  }

  // Group actions by book
  const actionsByBook = filteredActions.reduce((acc, action) => {
    const bookTitle = action.note.books?.title || 'Unknown Book'
    if (!acc[bookTitle]) {
      acc[bookTitle] = []
    }
    acc[bookTitle].push(action)
    return acc
  }, {} as Record<string, typeof filteredActions>)

  return (
    <div className="space-y-8">
      {Object.entries(actionsByBook).map(([bookTitle, bookActions]) => (
        <div key={bookTitle}>
          <h3 className="text-lg font-semibold mb-3 text-slate-700">
            {bookTitle}
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({bookActions.length} {bookActions.length === 1 ? 'action' : 'actions'})
            </span>
          </h3>
          <div className="space-y-3">
            {bookActions.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
