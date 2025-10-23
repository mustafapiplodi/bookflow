'use client'

import { useBooks } from '@/hooks/use-books'
import { BookCard } from './book-card'
import { BookOpen } from 'lucide-react'

interface BooksGridProps {
  status: string
}

export function BooksGrid({ status }: BooksGridProps) {
  const { data: books, isLoading } = useBooks(status)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 h-64 rounded-lg mb-3" />
            <div className="bg-slate-200 h-4 w-3/4 rounded mb-2" />
            <div className="bg-slate-200 h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No books yet</h3>
        <p className="text-slate-600 max-w-sm">
          {status === 'reading' && "Start tracking your current reads by adding a book."}
          {status === 'want_to_read' && "Add books you'd like to read in the future."}
          {status === 'finished' && "Books you've completed will appear here."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
