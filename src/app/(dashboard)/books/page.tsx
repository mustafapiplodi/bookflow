'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Grid3x3, List, LayoutGrid, Library, Search, BookOpen, Clock, CheckCircle2, Pause, X, Download, Upload, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { searchBooks } from '@/lib/api/search'
import { AddBookDialog } from '@/components/books/add-book-dialog'
import { BookCard } from '@/components/books/book-card'
import { EditBookDialog } from '@/components/books/edit-book-dialog'
import { DeleteBookDialog } from '@/components/books/delete-book-dialog'
import { BooksPageSkeleton, BookCardSkeletonGrid } from '@/components/books/book-card-skeleton'
import { CommandPalette } from '@/components/search/command-palette'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Database } from '@/types/database'
import { toast } from 'sonner'

export interface BookFilters {
  status: string[]
  rating: number | null
  sortBy: 'title' | 'author' | 'created_at' | 'rating' | 'updated_at'
  sortOrder: 'asc' | 'desc'
}

type BookType = Database['public']['Tables']['books']['Row']

export default function BooksPage() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<BookType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<{ id: string; title: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(searchParams?.get('filter') || 'all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<BookFilters>({
    status: [],
    rating: null,
    sortBy: 'updated_at',
    sortOrder: 'desc',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchBooks()
      setCurrentPage(1) // Reset to page 1 when filters change
    }
  }, [userId, searchQuery, filters, activeTab])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserId(user.id)
  }

  const fetchBooks = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      // Determine status filter based on active tab
      let statusFilter = filters.status
      if (activeTab !== 'all' && !searchQuery) {
        statusFilter = [activeTab]
      }

      const { data, error } = await searchBooks(userId, {
        query: searchQuery,
        status: statusFilter,
        rating: filters.rating || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })

      if (error) {
        throw new Error(error.message)
      }

      setBooks(data || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch books')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate book counts by status
  const bookCounts = {
    all: books.length,
    want_to_read: books.filter(b => b.status === 'want_to_read').length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    paused: books.filter(b => b.status === 'paused').length,
  }

  // Get filtered books based on active tab
  const filteredBooks = activeTab === 'all'
    ? books
    : books.filter(b => b.status === activeTab)

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

  const handleEdit = (book: BookType) => {
    setSelectedBook(book)
    setEditDialogOpen(true)
  }

  const handleDelete = (bookId: string) => {
    const book = books.find(b => b.id === bookId)
    if (book) {
      setBookToDelete({ id: book.id, title: book.title })
      setDeleteDialogOpen(true)
    }
  }

  const handleBookClick = (book: BookType) => {
    router.push(`/books/${book.id}`)
  }

  if (isLoading) {
    return <BooksPageSkeleton />
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with Stats */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Library</h1>
            <p className="text-muted-foreground text-sm">
              {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
            </p>
          </div>
          <div className="flex items-center gap-2">
            {userId && <AddBookDialog userId={userId} onBookAdded={fetchBooks} />}
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => setActiveTab('all')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">All Books</p>
                  <p className="text-2xl font-bold">{bookCounts.all}</p>
                </div>
                <Library className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => setActiveTab('reading')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reading</p>
                  <p className="text-2xl font-bold">{bookCounts.reading}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => setActiveTab('completed')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Completed</p>
                  <p className="text-2xl font-bold">{bookCounts.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => setActiveTab('want_to_read')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Want to Read</p>
                  <p className="text-2xl font-bold">{bookCounts.want_to_read}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => setActiveTab('paused')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Paused</p>
                  <p className="text-2xl font-bold">{bookCounts.paused}</p>
                </div>
                <Pause className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* View and Sort Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: 'updated_at', sortOrder: 'desc'})}>
                Recently Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: 'created_at', sortOrder: 'desc'})}>
                Recently Added
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: 'title', sortOrder: 'asc'})}>
                Title (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: 'author', sortOrder: 'asc'})}>
                Author (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, sortBy: 'rating', sortOrder: 'desc'})}>
                Highest Rated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filters Popover */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {filters.rating !== null && (
                  <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Filter by</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm mb-2 block">Minimum Rating</Label>
                      <Select
                        value={filters.rating?.toString() || 'all'}
                        onValueChange={(value) => {
                          setFilters({
                            ...filters,
                            rating: value === 'all' ? null : parseInt(value)
                          })
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All ratings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All ratings</SelectItem>
                          <SelectItem value="5">5 stars</SelectItem>
                          <SelectItem value="4">4+ stars</SelectItem>
                          <SelectItem value="3">3+ stars</SelectItem>
                          <SelectItem value="2">2+ stars</SelectItem>
                          <SelectItem value="1">1+ stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {filters.rating !== null && (
                  <>
                    <Separator />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters({ ...filters, rating: null })
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* View Toggle */}
          <div className="flex rounded-lg border">
            <Button
              size="icon"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="h-9 w-9"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || filters.status.length > 0 || filters.rating || activeTab !== 'all') && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeTab !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {activeTab.replace('_', ' ')}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setActiveTab('all')} />
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </Badge>
          )}
          {filters.rating && (
            <Badge variant="secondary" className="gap-1">
              Rating: {filters.rating}+ stars
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({...filters, rating: null})} />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setActiveTab('all')
              setFilters({ status: [], rating: null, sortBy: 'updated_at', sortOrder: 'desc' })
            }}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <LayoutGrid className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || filters.status.length > 0 || filters.rating || activeTab !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start building your library by adding your first book'}
          </p>
          {userId && !searchQuery && filters.status.length === 0 && activeTab === 'all' && (
            <AddBookDialog userId={userId} onBookAdded={fetchBooks} />
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)} of {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {paginatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={handleBookClick}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-muted-foreground">...</span>
                    }
                    return null
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-9"
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Edit Dialog */}
      {userId && (
        <EditBookDialog
          book={selectedBook}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          userId={userId}
          onBookUpdated={fetchBooks}
        />
      )}

      {/* Delete Dialog */}
      {userId && bookToDelete && (
        <DeleteBookDialog
          bookId={bookToDelete.id}
          bookTitle={bookToDelete.title}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          userId={userId}
          onBookDeleted={fetchBooks}
        />
      )}
    </div>
  )
}
