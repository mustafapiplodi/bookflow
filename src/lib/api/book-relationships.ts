import { createClient } from '@/lib/supabase/client'

export type RelationshipType = 'similar_to' | 'contradicts' | 'builds_on' | 'referenced_in'

export interface BookRelationship {
  id: string
  user_id: string
  book_id: string
  related_book_id: string
  relationship_type: RelationshipType
  strength: number | null
  notes: string | null
  created_at: string
}

export interface BookRelationshipWithBook extends BookRelationship {
  related_book: {
    id: string
    title: string
    author: string
    cover_url: string | null
  }
}

export interface CreateRelationshipData {
  book_id: string
  related_book_id: string
  relationship_type: RelationshipType
  strength?: number
  notes?: string
}

export const relationshipTypeConfig = {
  similar_to: {
    label: 'Similar To',
    description: 'Books with similar themes or ideas',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: '🔗',
  },
  contradicts: {
    label: 'Contradicts',
    description: 'Books with opposing viewpoints',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: '⚡',
  },
  builds_on: {
    label: 'Builds On',
    description: 'Books that expand on concepts',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: '🏗️',
  },
  referenced_in: {
    label: 'Referenced In',
    description: 'Books that reference each other',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: '📖',
  },
}

/**
 * Get all relationships for a specific book
 */
export async function getBookRelationships(
  userId: string,
  bookId: string
): Promise<BookRelationshipWithBook[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('book_relationships')
    .select(`
      *,
      related_book:books!book_relationships_related_book_id_fkey(
        id,
        title,
        author,
        cover_url
      )
    `)
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data as any) || []
}

/**
 * Get all books related to a specific book (bidirectional)
 */
export async function getAllRelatedBooks(
  userId: string,
  bookId: string
): Promise<BookRelationshipWithBook[]> {
  const supabase = createClient()

  // Get relationships where this book is the source
  const { data: outgoing, error: outgoingError } = await supabase
    .from('book_relationships')
    .select(`
      *,
      related_book:books!book_relationships_related_book_id_fkey(
        id,
        title,
        author,
        cover_url
      )
    `)
    .eq('user_id', userId)
    .eq('book_id', bookId)

  if (outgoingError) throw outgoingError

  // Get relationships where this book is the target
  const { data: incoming, error: incomingError } = await supabase
    .from('book_relationships')
    .select(`
      *,
      related_book:books!book_relationships_book_id_fkey(
        id,
        title,
        author,
        cover_url
      )
    `)
    .eq('user_id', userId)
    .eq('related_book_id', bookId)

  if (incomingError) throw incomingError

  // Combine and deduplicate
  const allRelationships = [...(outgoing || []), ...(incoming || [])]
  return (allRelationships as any) || []
}

/**
 * Create a new book relationship
 */
export async function createBookRelationship(
  userId: string,
  data: CreateRelationshipData
): Promise<BookRelationship> {
  const supabase = createClient()

  // Check if relationship already exists
  const { data: existing } = await supabase
    .from('book_relationships')
    .select('id')
    .eq('user_id', userId)
    .eq('book_id', data.book_id)
    .eq('related_book_id', data.related_book_id)
    .eq('relationship_type', data.relationship_type)
    .maybeSingle()

  if (existing) {
    throw new Error('This relationship already exists')
  }

  const { data: relationship, error } = await supabase
    .from('book_relationships')
    .insert({
      user_id: userId,
      book_id: data.book_id,
      related_book_id: data.related_book_id,
      relationship_type: data.relationship_type,
      strength: data.strength || null,
      notes: data.notes || null,
    })
    .select()
    .single()

  if (error) throw error
  return relationship
}

/**
 * Update a book relationship
 */
export async function updateBookRelationship(
  userId: string,
  relationshipId: string,
  data: Partial<CreateRelationshipData>
): Promise<BookRelationship> {
  const supabase = createClient()

  const updateData: any = {}
  if (data.relationship_type !== undefined) updateData.relationship_type = data.relationship_type
  if (data.strength !== undefined) updateData.strength = data.strength
  if (data.notes !== undefined) updateData.notes = data.notes

  const { data: relationship, error } = await supabase
    .from('book_relationships')
    .update(updateData)
    .eq('id', relationshipId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return relationship
}

/**
 * Delete a book relationship
 */
export async function deleteBookRelationship(
  userId: string,
  relationshipId: string
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('book_relationships')
    .delete()
    .eq('id', relationshipId)
    .eq('user_id', userId)

  if (error) throw error
}

/**
 * Get relationship statistics for a user
 */
export async function getRelationshipStats(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('book_relationships')
    .select('relationship_type')
    .eq('user_id', userId)

  if (error) throw error

  const stats = {
    total: data.length,
    similar_to: data.filter((r) => r.relationship_type === 'similar_to').length,
    contradicts: data.filter((r) => r.relationship_type === 'contradicts').length,
    builds_on: data.filter((r) => r.relationship_type === 'builds_on').length,
    referenced_in: data.filter((r) => r.relationship_type === 'referenced_in').length,
  }

  return stats
}

/**
 * Get books that could be related (suggestions based on common tags, authors, etc.)
 */
export async function getSuggestedRelatedBooks(
  userId: string,
  bookId: string,
  limit = 5
): Promise<any[]> {
  const supabase = createClient()

  // Get the current book details
  const { data: currentBook } = await supabase
    .from('books')
    .select('author, genre')
    .eq('id', bookId)
    .single()

  if (!currentBook) return []

  // Get books by the same author or genre (excluding current book and already related books)
  const { data: existingRelationships } = await supabase
    .from('book_relationships')
    .select('related_book_id')
    .eq('user_id', userId)
    .eq('book_id', bookId)

  const excludedIds = [bookId, ...(existingRelationships?.map((r) => r.related_book_id) || [])]

  const { data: suggestions, error } = await supabase
    .from('books')
    .select('id, title, author, cover_url, genre')
    .eq('user_id', userId)
    .not('id', 'in', `(${excludedIds.join(',')})`)
    .or(`author.eq.${currentBook.author},genre.eq.${currentBook.genre}`)
    .limit(limit)

  if (error) return []
  return suggestions || []
}
