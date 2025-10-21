import { createClient } from '@/lib/supabase/client'

export interface SearchResult {
  type: 'book' | 'note'
  id: string
  title: string
  subtitle?: string
  content?: string
  metadata?: {
    author?: string
    noteType?: string
    chapter?: string
    pageNumber?: number
    bookTitle?: string
  }
  url: string
  icon?: string
}

/**
 * Global search across books and notes
 */
export async function globalSearch(
  userId: string,
  query: string,
  options?: {
    types?: ('book' | 'note')[]
    limit?: number
  }
): Promise<{ data: SearchResult[] | null; error: any }> {
  if (!query || query.trim().length === 0) {
    return { data: [], error: null }
  }

  const supabase = createClient()
  const searchTypes = options?.types || ['book', 'note']
  const limit = options?.limit || 50
  const results: SearchResult[] = []

  try {
    // Search books
    if (searchTypes.includes('book')) {
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('id, title, author, cover_image_url')
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`)
        .limit(limit)

      if (booksError) throw booksError

      if (books) {
        books.forEach((book) => {
          results.push({
            type: 'book',
            id: book.id,
            title: book.title,
            subtitle: book.author,
            metadata: {
              author: book.author,
            },
            url: `/books/${book.id}`,
            icon: '📚',
          })
        })
      }
    }

    // Search notes
    if (searchTypes.includes('note')) {
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select(`
          id,
          title,
          content,
          note_type,
          chapter,
          page_number,
          books (
            id,
            title
          )
        `)
        .eq('user_id', userId)
        .eq('is_archived', false)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(limit)

      if (notesError) throw notesError

      if (notes) {
        notes.forEach((note: any) => {
          // Strip HTML for preview
          const plainContent = note.content.replace(/<[^>]*>/g, '').substring(0, 100)

          results.push({
            type: 'note',
            id: note.id,
            title: note.title || 'Untitled Note',
            subtitle: note.books?.title,
            content: plainContent,
            metadata: {
              noteType: note.note_type,
              chapter: note.chapter,
              pageNumber: note.page_number,
              bookTitle: note.books?.title,
            },
            url: `/books/${note.books?.id}?tab=notes`,
            icon: getNoteIcon(note.note_type),
          })
        })
      }
    }

    return { data: results, error: null }
  } catch (error: any) {
    console.error('Search error:', error)
    return { data: null, error }
  }
}

/**
 * Search books with advanced filters
 */
export async function searchBooks(
  userId: string,
  filters: {
    query?: string
    status?: string[]
    shelfId?: string
    rating?: number
    hasNotes?: boolean
    sortBy?: 'title' | 'author' | 'created_at' | 'rating' | 'updated_at'
    sortOrder?: 'asc' | 'desc'
  }
) {
  const supabase = createClient()

  let query = supabase
    .from('books')
    .select(`
      *,
      book_shelves(shelf_id, shelves(*))
    `)
    .eq('user_id', userId)

  // Text search
  if (filters.query && filters.query.trim().length > 0) {
    query = query.or(
      `title.ilike.%${filters.query}%,author.ilike.%${filters.query}%,isbn.ilike.%${filters.query}%`
    )
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    query = query.in('status', filters.status)
  }

  // Shelf filter
  if (filters.shelfId) {
    query = query.eq('book_shelves.shelf_id', filters.shelfId)
  }

  // Rating filter
  if (filters.rating) {
    query = query.gte('rating', filters.rating)
  }

  // Sort
  const sortBy = filters.sortBy || 'created_at'
  const sortOrder = filters.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  return { data, error }
}

/**
 * Search notes with advanced filters
 */
export async function searchNotes(
  userId: string,
  filters: {
    query?: string
    bookId?: string
    noteTypes?: string[]
    priority?: string[]
    isPinned?: boolean
    isArchived?: boolean
    hasChapter?: boolean
    sortBy?: 'created_at' | 'updated_at' | 'title'
    sortOrder?: 'asc' | 'desc'
  }
) {
  const supabase = createClient()

  let query = supabase
    .from('notes')
    .select(`
      *,
      books (
        id,
        title,
        author
      )
    `)
    .eq('user_id', userId)

  // Text search
  if (filters.query && filters.query.trim().length > 0) {
    query = query.or(`title.ilike.%${filters.query}%,content.ilike.%${filters.query}%`)
  }

  // Book filter
  if (filters.bookId) {
    query = query.eq('book_id', filters.bookId)
  }

  // Note type filter
  if (filters.noteTypes && filters.noteTypes.length > 0) {
    query = query.in('note_type', filters.noteTypes)
  }

  // Priority filter
  if (filters.priority && filters.priority.length > 0) {
    query = query.in('priority', filters.priority)
  }

  // Pinned filter
  if (filters.isPinned !== undefined) {
    query = query.eq('is_pinned', filters.isPinned)
  }

  // Archived filter
  if (filters.isArchived !== undefined) {
    query = query.eq('is_archived', filters.isArchived)
  } else {
    // By default, don't show archived
    query = query.eq('is_archived', false)
  }

  // Has chapter filter
  if (filters.hasChapter) {
    query = query.not('chapter', 'is', null)
  }

  // Sort
  const sortBy = filters.sortBy || 'created_at'
  const sortOrder = filters.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  return { data, error }
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const recent = localStorage.getItem('recent_searches')
    return recent ? JSON.parse(recent) : []
  } catch {
    return []
  }
}

/**
 * Save search to recent searches
 */
export function saveRecentSearch(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return

  try {
    const recent = getRecentSearches()
    const filtered = recent.filter((q) => q !== query)
    const updated = [query, ...filtered].slice(0, 10) // Keep last 10
    localStorage.setItem('recent_searches', JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save recent search:', error)
  }
}

/**
 * Clear recent searches
 */
export function clearRecentSearches() {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem('recent_searches')
  } catch (error) {
    console.error('Failed to clear recent searches:', error)
  }
}

// Helper function to get note icon
function getNoteIcon(noteType: string): string {
  const icons: Record<string, string> = {
    idea: '💡',
    argument: '⚖️',
    action: '✅',
    quote: '💬',
    question: '❓',
    connection: '🔗',
    disagreement: '❌',
    insight: '✨',
    data: '📊',
    example: '📝',
    reflection: '🤔',
    definition: '📖',
  }
  return icons[noteType] || '📝'
}
