'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Star, BookOpen } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

interface TopRatedBooksProps {
  books: Array<{
    id: string
    title: string
    author: string
    rating: number
    dateFinished: string | null
    readingTime: number
  }>
  isLoading?: boolean
}

export function TopRatedBooks({ books, isLoading }: TopRatedBooksProps) {
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
          <Star className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-900">
            Top-Rated Books
          </h3>
        </div>
        <div className="text-center py-8 text-slate-600">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p>No rated books yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Rate your finished books to see your favorites
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-slate-900">
          Top-Rated Books
        </h3>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        Your highest-rated reading experiences
      </p>

      <div className="space-y-3">
        {books.map((book, index) => (
          <Link
            key={book.id}
            href={`/library/${book.id}`}
            className="block group"
          >
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="flex-shrink-0 w-8 text-center">
                <span className="text-lg font-bold text-amber-500">
                  #{index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {book.title}
                </h4>
                <p className="text-sm text-slate-600 truncate mb-2">
                  {book.author}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {book.dateFinished && (
                    <span>Finished {format(new Date(book.dateFinished), 'MMM yyyy')}</span>
                  )}
                  <span>•</span>
                  <span>{formatTime(book.readingTime)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < book.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
