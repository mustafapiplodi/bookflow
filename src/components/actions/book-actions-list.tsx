'use client'

import { useActions } from '@/hooks/use-actions'
import { ActionCard } from './action-card'
import { Skeleton } from '@/components/ui/skeleton'

interface BookActionsListProps {
  bookId: string
}

export function BookActionsList({ bookId }: BookActionsListProps) {
  const { data: actions, isLoading } = useActions()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  // Filter actions by book
  const bookActions = actions?.filter(
    (action) => action.note.books?.id === bookId
  ) || []

  if (bookActions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-600">
        No action items yet. Mark notes as actions to track them here.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookActions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
    </div>
  )
}
