'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Clock, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ActionItemWithBook } from '@/lib/api/action-items'

interface PriorityMatrixViewProps {
  actionItems: ActionItemWithBook[]
}

// Eisenhower Matrix: Urgent/Important Grid
// For simplicity:
// - High priority + has due date = Urgent & Important (Do First)
// - High priority + no due date = Not Urgent but Important (Schedule)
// - Medium/Low priority + has due date = Urgent but Not Important (Delegate)
// - Medium/Low priority + no due date = Not Urgent & Not Important (Eliminate)

export function PriorityMatrixView({ actionItems }: PriorityMatrixViewProps) {
  const router = useRouter()

  const { doFirst, schedule, delegate, eliminate } = useMemo(() => {
    const activeItems = actionItems.filter(
      (item) => item.status !== 'completed' && item.status !== 'cancelled'
    )

    const doFirst: ActionItemWithBook[] = []
    const schedule: ActionItemWithBook[] = []
    const delegate: ActionItemWithBook[] = []
    const eliminate: ActionItemWithBook[] = []

    activeItems.forEach((item) => {
      const isHighPriority = item.priority === 'high'
      const hasDeadline = !!item.due_date
      const isOverdue = item.due_date && new Date(item.due_date) < new Date()

      // High priority with deadline = Urgent & Important
      if (isHighPriority && hasDeadline) {
        doFirst.push(item)
      }
      // High priority without deadline = Important but Not Urgent
      else if (isHighPriority && !hasDeadline) {
        schedule.push(item)
      }
      // Lower priority with deadline = Urgent but Not Important
      else if (!isHighPriority && hasDeadline) {
        delegate.push(item)
      }
      // Lower priority without deadline = Neither Urgent nor Important
      else {
        eliminate.push(item)
      }
    })

    return { doFirst, schedule, delegate, eliminate }
  }, [actionItems])

  function QuadrantCard({
    title,
    description,
    items,
    color,
    icon: Icon,
  }: {
    title: string
    description: string
    items: ActionItemWithBook[]
    color: string
    icon: any
  }) {
    return (
      <Card className={cn('h-full', color)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Badge variant="secondary" className="w-fit mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No items in this quadrant</p>
          ) : (
            items.map((item) => {
              const isOverdue = item.due_date && new Date(item.due_date) < new Date()

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/action-items/${item.id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="line-clamp-1">{item.book.title}</span>
                      </div>
                      {item.due_date && (
                        <div className="flex items-center gap-1 text-xs">
                          {isOverdue ? (
                            <Badge variant="destructive" className="text-xs h-5">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs h-5">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(item.due_date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    {item.status === 'in_progress' && (
                      <Badge variant="secondary" className="text-xs">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Matrix Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Eisenhower Priority Matrix</h2>
        <p className="text-muted-foreground">
          Organize your action items by urgency and importance
        </p>
      </div>

      {/* The Matrix - 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quadrant 1: Urgent & Important - DO FIRST */}
        <QuadrantCard
          title="Do First"
          description="Urgent & Important - Tackle these immediately"
          items={doFirst}
          color="border-red-300 dark:border-red-800"
          icon={AlertCircle}
        />

        {/* Quadrant 2: Not Urgent but Important - SCHEDULE */}
        <QuadrantCard
          title="Schedule"
          description="Important but Not Urgent - Plan these carefully"
          items={schedule}
          color="border-blue-300 dark:border-blue-800"
          icon={Clock}
        />

        {/* Quadrant 3: Urgent but Not Important - DELEGATE */}
        <QuadrantCard
          title="Delegate"
          description="Urgent but Not Important - Consider delegating or simplifying"
          items={delegate}
          color="border-yellow-300 dark:border-yellow-800"
          icon={Clock}
        />

        {/* Quadrant 4: Not Urgent & Not Important - ELIMINATE */}
        <QuadrantCard
          title="Eliminate"
          description="Neither Urgent nor Important - Reconsider if needed"
          items={eliminate}
          color="border-gray-300 dark:border-gray-700"
          icon={Circle}
        />
      </div>

      {/* Legend */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">How items are categorized:</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
            <div>
              <strong>Do First:</strong> High priority items with deadlines
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
            <div>
              <strong>Schedule:</strong> High priority items without deadlines
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1" />
            <div>
              <strong>Delegate:</strong> Lower priority items with deadlines
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 mt-1" />
            <div>
              <strong>Eliminate:</strong> Lower priority items without deadlines
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
