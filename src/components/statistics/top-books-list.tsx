'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { BookOpen, Clock, FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface TopBooksListProps {
  books: Array<{
    id: string
    title: string
    author: string
    readingTime: number
    noteCount: number
  }>
  isLoading?: boolean
}

export function TopBooksList({ books, isLoading }: TopBooksListProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (books.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Most Read Books
        </h3>
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-400 dark:text-slate-600" />
          <p>No reading data yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Start tracking your reading sessions to see statistics
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Most Read Books
      </h3>
      <div className="space-y-3">
        {books.map((book, index) => (
          <Link
            key={book.id}
            href={`/library/${book.id}`}
            className="block group"
          >
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-lg font-bold text-slate-400">
                  #{index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                  {book.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {book.author}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(book.readingTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{book.noteCount}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
