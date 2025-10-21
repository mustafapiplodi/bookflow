'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Edit, Trash, Upload, Book as BookIcon, X, ZoomIn, Link2, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getBookById, updateBook, uploadBookCover } from '@/lib/api/books'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { EditBookDialog } from '@/components/books/edit-book-dialog'
import { DeleteBookDialog } from '@/components/books/delete-book-dialog'
import { ReadingSessionPanel } from '@/components/sessions/reading-session-panel'
import { SessionHistoryWithNotes } from '@/components/sessions/session-history-with-notes'
import { NotesList } from '@/components/notes/notes-list'
import { ReadingTimeline } from '@/components/books/reading-timeline'
import { AddRelationshipDialog } from '@/components/books/relationships/add-relationship-dialog'
import { RelationshipsList } from '@/components/books/relationships/relationships-list'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Database } from '@/types/database'
import { toast } from 'sonner'
import { getBookColor, getBookInitials } from '@/lib/utils/book-colors'
import { getBookRelationships, type BookRelationshipWithBook } from '@/lib/api/book-relationships'

type BookType = Database['public']['Tables']['books']['Row']
type SessionType = Database['public']['Tables']['reading_sessions']['Row']

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

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<BookType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [relatedBooks, setRelatedBooks] = useState<BookType[]>([])
  const [sessions, setSessions] = useState<SessionType[]>([])
  const [relationships, setRelationships] = useState<BookRelationshipWithBook[]>([])
  const [addRelationshipOpen, setAddRelationshipOpen] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchBook()
    }
  }, [userId, params.id])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserId(user.id)
  }

  const fetchBook = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const data = await getBookById(supabase, params.id, userId)
      setBook(data)
      // Fetch related books, sessions, and relationships after getting the book
      fetchRelatedBooks(data)
      fetchSessions()
      fetchRelationships()
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch book')
      console.error(error)
      router.push('/books')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSessions = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('book_id', params.id)
        .eq('user_id', userId)
        .not('end_time', 'is', null)
        .order('start_time', { ascending: true })

      if (error) throw error
      setSessions(data || [])
    } catch (error: any) {
      console.error('Failed to fetch sessions:', error)
      // Don't show error toast as this is not critical
    }
  }

  const fetchRelatedBooks = async (currentBook: BookType) => {
    if (!userId) return

    try {
      // Fetch books by same author or same genre (excluding current book)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
        .neq('id', currentBook.id)
        .or(`author.eq.${currentBook.author},genre.eq.${currentBook.genre}`)
        .limit(4)

      if (error) throw error
      setRelatedBooks(data || [])
    } catch (error: any) {
      console.error('Failed to fetch related books:', error)
      // Don't show error toast as this is not critical
    }
  }

  const fetchRelationships = async () => {
    if (!userId) return

    try {
      const data = await getBookRelationships(userId, params.id)
      setRelationships(data)
    } catch (error: any) {
      console.error('Failed to fetch book relationships:', error)
      // Don't show error toast as this is not critical
    }
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !userId || !book) return

    const file = event.target.files[0]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const coverUrl = await uploadBookCover(supabase, userId, book.id, file)
      await updateBook(supabase, book.id, { cover_image_url: coverUrl }, userId)

      toast.success('Cover image uploaded successfully!')
      fetchBook()
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload cover image')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteSuccess = () => {
    toast.success('Book deleted successfully')
    router.push('/books')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="space-y-6">
          {/* Breadcrumbs skeleton */}
          <Skeleton className="h-5 w-48" />

          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>

          {/* Book details skeleton */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cover skeleton */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>

            {/* Info skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return null
  }

  const progress = book.total_pages
    ? Math.round((book.current_page / book.total_pages) * 100)
    : 0

  const bookColor = getBookColor(book.title)
  const bookInitials = getBookInitials(book.title)

  return (
    <div className="container mx-auto p-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Books', href: '/books' },
            { label: book.title }
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/books')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Book Details */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div
                className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted cursor-pointer group"
                onClick={() => book.cover_image_url && !imageError && setLightboxOpen(true)}
              >
                {book.cover_image_url && !imageError ? (
                  <>
                    <Image
                      src={book.cover_image_url}
                      alt={book.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={() => setImageError(true)}
                      priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center z-10">
                      <ZoomIn className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </>
                ) : (
                  <div className={`flex h-full items-center justify-center bg-gradient-to-br ${bookColor.bg}`}>
                    <span className={`text-6xl font-bold ${bookColor.text}`}>{bookInitials}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <input
                  type="file"
                  id="cover-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={uploading}
                />
                <label htmlFor="cover-upload">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Uploading...' : 'Upload Cover'}
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Status */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-4xl font-bold">{book.title}</h1>
              <Badge variant={statusColors[book.status]}>
                {statusLabels[book.status]}
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground">{book.author}</p>
          </div>

          {/* Progress */}
          {book.status === 'reading' && book.total_pages && (
            <Card>
              <CardHeader>
                <CardTitle>Reading Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Page {book.current_page} of {book.total_pages}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Book Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {book.isbn && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">ISBN</div>
                    <div>{book.isbn}</div>
                  </div>
                )}
                {book.publisher && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Publisher</div>
                    <div>{book.publisher}</div>
                  </div>
                )}
                {book.publication_year && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Publication Year</div>
                    <div>{book.publication_year}</div>
                  </div>
                )}
                {book.language && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Language</div>
                    <div>{book.language}</div>
                  </div>
                )}
                {book.rating && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Rating</div>
                    <div>{book.rating}/5</div>
                  </div>
                )}
                {book.total_pages && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total Pages</div>
                    <div>{book.total_pages}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Added on:</span>
                <span>{new Date(book.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last updated:</span>
                <span>{new Date(book.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Books */}
          {relatedBooks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Books</CardTitle>
                <CardDescription>
                  Books by {book.author} or in {book.genre || 'similar genres'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedBooks.map((relatedBook) => {
                    const relatedBookColor = getBookColor(relatedBook.title)
                    const relatedBookInitials = getBookInitials(relatedBook.title)
                    const isImageError = false

                    return (
                      <div
                        key={relatedBook.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => router.push(`/books/${relatedBook.id}`)}
                      >
                        <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                          {relatedBook.cover_image_url && !isImageError ? (
                            <Image
                              src={relatedBook.cover_image_url}
                              alt={relatedBook.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${relatedBookColor.bg} flex items-center justify-center`}>
                              <span className={`text-sm font-bold ${relatedBookColor.text}`}>
                                {relatedBookInitials}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{relatedBook.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{relatedBook.author}</p>
                          {relatedBook.genre && (
                            <p className="text-xs text-muted-foreground mt-0.5">{relatedBook.genre}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Book Relationships */}
      {userId && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Link2 className="h-6 w-6" />
              Book Relationships
            </h2>
            <Button onClick={() => setAddRelationshipOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Relationship
            </Button>
          </div>
          <RelationshipsList
            relationships={relationships}
            onRelationshipDeleted={fetchRelationships}
          />
        </div>
      )}

      {/* Reading Session with Inline Notes */}
      {userId && (
        <div className="mt-8 space-y-8">
          <Separator />
          <div>
            <h2 className="text-2xl font-bold mb-6">Reading Session</h2>
            <ReadingSessionPanel
              userId={userId}
              bookId={book.id}
              book={{
                id: book.id,
                title: book.title,
                author: book.author,
                cover_url: book.cover_image_url,
                current_page: book.current_page,
                total_pages: book.total_pages,
              }}
              onSessionEnd={fetchBook}
            />
          </div>

          <Separator />

          {/* Reading Timeline */}
          <div>
            <h2 className="text-2xl font-bold mb-6">📈 Reading Journey</h2>
            <ReadingTimeline
              book={{
                created_at: book.created_at,
                updated_at: book.updated_at,
                status: book.status
              }}
              sessions={sessions}
            />
          </div>

          <Separator />

          {/* Session History with Notes */}
          <div>
            <h2 className="text-2xl font-bold mb-6">📚 Reading History</h2>
            <SessionHistoryWithNotes userId={userId} bookId={book.id} showBookInfo={false} />
          </div>

          <Separator />

          {/* All Notes from This Book */}
          <div>
            <h2 className="text-2xl font-bold mb-6">📝 All Notes</h2>
            <NotesList userId={userId} bookId={book.id} showBookInfo={false} />
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {userId && (
        <EditBookDialog
          book={book}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          userId={userId}
          onBookUpdated={fetchBook}
        />
      )}

      {/* Delete Dialog */}
      {userId && (
        <DeleteBookDialog
          bookId={book.id}
          bookTitle={book.title}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          userId={userId}
          onBookDeleted={handleDeleteSuccess}
        />
      )}

      {/* Add Relationship Dialog */}
      {userId && (
        <AddRelationshipDialog
          bookId={book.id}
          bookTitle={book.title}
          open={addRelationshipOpen}
          onOpenChange={setAddRelationshipOpen}
          onRelationshipAdded={fetchRelationships}
        />
      )}

      {/* Cover Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-black/90">
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            {book.cover_image_url && !imageError ? (
              <Image
                src={book.cover_image_url}
                alt={book.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
