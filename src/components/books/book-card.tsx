'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Book, Edit, MoreVertical, Trash } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Database } from '@/types/database'
import { getBookColor, getBookInitials } from '@/lib/utils/book-colors'

type BookType = Database['public']['Tables']['books']['Row']

interface BookCardProps {
  book: BookType
  onEdit?: (book: BookType) => void
  onDelete?: (bookId: string) => void
  onClick?: (book: BookType) => void
  viewMode?: 'grid' | 'list'
}

const statusColors = {
  want_to_read: 'default',
  reading: 'secondary',
  completed: 'default',
  paused: 'outline',
  abandoned: 'destructive',
} as const

const statusLabels = {
  want_to_read: 'Want to Read',
  reading: 'Reading',
  completed: 'Completed',
  paused: 'Paused',
  abandoned: 'Abandoned',
}

export function BookCard({ book, onEdit, onDelete, onClick, viewMode = 'grid' }: BookCardProps) {
  const [imageError, setImageError] = useState(false)

  const progress = book.total_pages
    ? Math.round((book.current_page / book.total_pages) * 100)
    : 0

  const bookColor = getBookColor(book.title)
  const bookInitials = getBookInitials(book.title)

  // Check if book was added in the last 7 days
  const isRecentlyAdded = () => {
    const createdDate = new Date(book.created_at)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  // List view layout
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary">
        <div className="flex items-center gap-4 p-4">
          {/* Cover Image - smaller in list view */}
          <button
            className="relative flex h-24 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => onClick?.(book)}
            aria-label={`View details for ${book.title} by ${book.author}`}
            tabIndex={0}
          >
            {book.cover_image_url && !imageError ? (
              <Image
                src={book.cover_image_url}
                alt={`Cover of ${book.title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={() => setImageError(true)}
                priority={false}
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${bookColor.bg} flex items-center justify-center`}>
                <span className={`text-xl font-bold ${bookColor.text}`} aria-hidden="true">{bookInitials}</span>
              </div>
            )}
          </button>

          {/* Book Info */}
          <div className="flex flex-1 items-center gap-4 min-w-0">
            <button
              className="flex-1 min-w-0 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary rounded p-1 -m-1"
              onClick={() => onClick?.(book)}
              aria-label={`View ${book.title}`}
              tabIndex={0}
            >
              <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant={statusColors[book.status]} className="text-xs">
                  {statusLabels[book.status]}
                </Badge>
                {isRecentlyAdded() && (
                  <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                    NEW
                  </Badge>
                )}
                {book.genre && (
                  <span className="text-xs text-muted-foreground">{book.genre}</span>
                )}
              </div>
            </button>

            {/* Progress - only show for reading books */}
            {book.status === 'reading' && book.total_pages && (
              <div className="flex-shrink-0 w-32" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Reading progress: ${progress}%`}>
                <div className="space-y-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {progress}% • {book.current_page}/{book.total_pages}
                  </div>
                </div>
              </div>
            )}

            {/* Rating */}
            {book.rating && (
              <div className="flex-shrink-0 text-sm font-medium" aria-label={`Rating: ${book.rating} out of 5 stars`}>
                ⭐ {book.rating}
              </div>
            )}

            {/* Actions Menu */}
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8" aria-label={`More actions for ${book.title}`}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(book)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete?.(book.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid view layout (original)
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary">
      <div className="relative">
        {/* Cover Image */}
        <button
          className="relative flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
          onClick={() => onClick?.(book)}
          aria-label={`View details for ${book.title} by ${book.author}`}
          tabIndex={0}
        >
          {book.cover_image_url && !imageError ? (
            <Image
              src={book.cover_image_url}
              alt={`Cover of ${book.title}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${bookColor.bg} flex items-center justify-center`}>
              <span className={`text-4xl font-bold ${bookColor.text}`} aria-hidden="true">{bookInitials}</span>
            </div>
          )}
        </button>

        {/* Actions Menu */}
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8" aria-label={`More actions for ${book.title}`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(book)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete?.(book.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          <Badge variant={statusColors[book.status]}>
            {statusLabels[book.status]}
          </Badge>
          {isRecentlyAdded() && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              NEW
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
        <CardDescription className="line-clamp-1">{book.author}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Progress */}
        {book.status === 'reading' && book.total_pages && (
          <div className="space-y-1" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Reading progress: ${progress}%`}>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Page {book.current_page} of {book.total_pages}
            </div>
          </div>
        )}

        {/* Rating */}
        {book.rating && (
          <div className="flex items-center text-sm" aria-label={`Rating: ${book.rating} out of 5 stars`}>
            <span className="text-muted-foreground">Rating:</span>
            <span className="ml-2 font-medium">{book.rating}/5</span>
          </div>
        )}

        {/* Genre */}
        {book.genre && (
          <div className="text-xs text-muted-foreground">
            {book.genre}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
