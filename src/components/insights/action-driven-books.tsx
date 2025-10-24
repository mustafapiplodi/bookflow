'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { CheckSquare, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

interface ActionDrivenBooksProps {
  books: Array<{
    id: string
    title: string
    author: string
    totalActions: number
    completedActions: number
    completionRate: number
  }>
  isLoading?: boolean
}

export function ActionDrivenBooks({ books, isLoading }: ActionDrivenBooksProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (books.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Action-Driven Books
          </h3>
        </div>
        <div className="text-center py-8 text-slate-600">
          <CheckSquare className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p>No action items yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Mark notes as actions to see which books drive the most change
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Action-Driven Books
        </h3>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        Books that inspire the most action items
      </p>

      <div className="space-y-4">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/library/${book.id}`}
            className="block group"
          >
            <div className="p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {book.title}
                  </h4>
                  <p className="text-sm text-slate-600 truncate">
                    {book.author}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {book.totalActions}
                  </p>
                  <p className="text-xs text-slate-500">actions</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-medium text-slate-900">
                    {book.completedActions}/{book.totalActions} completed
                  </span>
                </div>
                <Progress value={book.completionRate} className="h-2" />
                <p className="text-xs text-slate-500 text-right">
                  {Math.round(book.completionRate)}% completion rate
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
