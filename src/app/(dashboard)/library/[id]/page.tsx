'use client'

import Link from 'next/link'
import { useBook } from '@/hooks/use-books'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Play, Clock, FileText, CheckSquare } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface BookDetailPageProps {
  params: { id: string }
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = params
  const { data: book, isLoading } = useBook(id)

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="flex gap-8">
          <Skeleton className="w-64 h-96 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="p-8">
        <Link href="/library">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-slate-600">Book not found</p>
        </div>
      </div>
    )
  }

  const statusColors = {
    reading: 'bg-blue-100 text-blue-700',
    want_to_read: 'bg-amber-100 text-amber-700',
    finished: 'bg-green-100 text-green-700',
  }

  const statusLabels = {
    reading: 'Reading',
    want_to_read: 'Want to Read',
    finished: 'Finished',
  }

  return (
    <div className="p-8">
      <Link href="/library">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
      </Link>

      <div className="grid lg:grid-cols-[300px,1fr] gap-8 mb-8">
        {/* Book Cover & Info */}
        <div>
          <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg overflow-hidden mb-4">
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-16 h-16 text-slate-400" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button className="w-full" size="lg">
              <Play className="w-4 h-4 mr-2" />
              Start Reading
            </Button>

            {book.rating && (
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    {i < book.rating! ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-slate-600 mb-3">{book.author}</p>
              <Badge className={statusColors[book.status as keyof typeof statusColors]}>
                {statusLabels[book.status as keyof typeof statusLabels]}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-lg bg-white border">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Reading Time</span>
              </div>
              <p className="text-2xl font-bold">
                {Math.floor((book.total_reading_time || 0) / 60)}h{' '}
                {(book.total_reading_time || 0) % 60}m
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Notes</span>
              </div>
              <p className="text-2xl font-bold">0</p>
            </div>

            <div className="p-4 rounded-lg bg-white border">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <CheckSquare className="w-4 h-4" />
                <span className="text-sm">Actions</span>
              </div>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>

          {book.one_sentence_takeaway && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Key Takeaway</p>
              <p className="text-blue-700">{book.one_sentence_takeaway}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Sessions, Notes, Actions */}
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList>
          <TabsTrigger value="sessions">Reading Sessions</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-6">
          <div className="text-center py-8 text-slate-600">
            No sessions yet. Start reading to track your sessions.
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="text-center py-8 text-slate-600">
            No notes yet. Take notes during your reading sessions.
          </div>
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <div className="text-center py-8 text-slate-600">
            No action items yet. Mark notes as actions to track them here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
