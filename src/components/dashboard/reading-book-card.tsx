'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { getBookColor, getBookInitials } from '@/lib/utils/book-colors'

interface ReadingBookCardProps {
  book: {
    id: string
    title: string
    author: string | null
    cover_url: string | null
    current_page: number | null
    total_pages: number | null
  }
}

export function ReadingBookCard({ book }: ReadingBookCardProps) {
  const progress = book.total_pages && book.current_page
    ? Math.round((book.current_page / book.total_pages) * 100)
    : 0

  const bookColor = getBookColor(book.title)
  const bookInitials = getBookInitials(book.title)

  return (
    <Link href={`/books/${book.id}`} className="block">
      <div className="group flex gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-16 h-24 object-cover rounded shadow-sm group-hover:shadow-lg transition-shadow duration-200"
          />
        ) : (
          <div className={`w-16 h-24 bg-gradient-to-br ${bookColor.bg} rounded flex items-center justify-center transition-all duration-200 group-hover:scale-105`}>
            <span className={`text-2xl font-bold ${bookColor.text}`}>{bookInitials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
          <div className="mt-2 space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{book.current_page || 0} / {book.total_pages || 0} pages</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
