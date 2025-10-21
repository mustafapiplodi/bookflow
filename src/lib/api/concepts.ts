import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface Concept {
  id: string
  user_id: string
  name: string
  description: string | null
  category: string | null
  created_at: string
  updated_at: string
}

export interface BookConcept {
  id: string
  book_id: string
  concept_id: string
  notes: string | null
  created_at: string
  concepts?: Concept
  books?: {
    id: string
    title: string
    author: string
    cover_url: string | null
  }
}

export interface ConceptWithBooks extends Concept {
  book_concepts: {
    book_id: string
    books: {
      id: string
      title: string
      author: string
      cover_image_url: string | null
    }
  }[]
}

/**
 * Get all concepts for a user with their associated books
 */
export async function getConcepts(userId: string) {
  const supabase = createBrowserClient()

  try {
    const { data, error } = await supabase
      .from('concepts')
      .select(`
        *,
        book_concepts (
          book_id,
          books (
            id,
            title,
            author,
            cover_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) throw error

    return { data: data as ConceptWithBooks[], error: null }
  } catch (error: any) {
    console.error('Error fetching concepts:', error)
    return { data: null, error }
  }
}

/**
 * Get a single concept by ID with books
 */
export async function getConceptById(conceptId: string, userId: string) {
  const supabase = createBrowserClient()

  try {
    const { data, error } = await supabase
      .from('concepts')
      .select(`
        *,
        book_concepts (
          id,
          book_id,
          notes,
          books (
            id,
            title,
            author,
            cover_url
          )
        )
      `)
      .eq('id', conceptId)
      .eq('user_id', userId)
      .single()

    if (error) throw error

    return { data: data as ConceptWithBooks, error: null }
  } catch (error: any) {
    console.error('Error fetching concept:', error)
    return { data: null, error }
  }
}

/**
 * Get concepts for a specific book
 */
export async function getBookConcepts(bookId: string, userId: string) {
  const supabase = createBrowserClient()

  try {
    const { data, error } = await supabase
      .from('book_concepts')
      .select(`
        *,
        concepts (
          id,
          name,
          description,
          category
        )
      `)
      .eq('book_id', bookId)
      .eq('concepts.user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data: data as BookConcept[], error: null }
  } catch (error: any) {
    console.error('Error fetching book concepts:', error)
    return { data: null, error }
  }
}

/**
 * Create a new concept
 */
export async function createConcept(
  supabase: SupabaseClient,
  userId: string,
  data: {
    name: string
    description?: string
    category?: string
  }
) {
  try {
    const { data: concept, error } = await supabase
      .from('concepts')
      .insert({
        user_id: userId,
        name: data.name,
        description: data.description || null,
        category: data.category || null,
      })
      .select()
      .single()

    if (error) throw error

    return { data: concept as Concept, error: null }
  } catch (error: any) {
    console.error('Error creating concept:', error)
    return { data: null, error }
  }
}

/**
 * Update a concept
 */
export async function updateConcept(
  supabase: SupabaseClient,
  conceptId: string,
  userId: string,
  data: {
    name?: string
    description?: string
    category?: string
  }
) {
  try {
    const { data: concept, error } = await supabase
      .from('concepts')
      .update(data)
      .eq('id', conceptId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return { data: concept as Concept, error: null }
  } catch (error: any) {
    console.error('Error updating concept:', error)
    return { data: null, error }
  }
}

/**
 * Delete a concept
 */
export async function deleteConcept(
  supabase: SupabaseClient,
  conceptId: string,
  userId: string
) {
  try {
    const { error } = await supabase
      .from('concepts')
      .delete()
      .eq('id', conceptId)
      .eq('user_id', userId)

    if (error) throw error

    return { error: null }
  } catch (error: any) {
    console.error('Error deleting concept:', error)
    return { error }
  }
}

/**
 * Link a concept to a book
 */
export async function linkConceptToBook(
  supabase: SupabaseClient,
  bookId: string,
  conceptId: string,
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from('book_concepts')
      .insert({
        book_id: bookId,
        concept_id: conceptId,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error linking concept to book:', error)
    return { data: null, error }
  }
}

/**
 * Unlink a concept from a book
 */
export async function unlinkConceptFromBook(
  supabase: SupabaseClient,
  bookConceptId: string
) {
  try {
    const { error } = await supabase
      .from('book_concepts')
      .delete()
      .eq('id', bookConceptId)

    if (error) throw error

    return { error: null }
  } catch (error: any) {
    console.error('Error unlinking concept from book:', error)
    return { error }
  }
}

/**
 * Get knowledge graph data for visualization
 * Returns nodes (books and connection notes) and edges (note links)
 */
export async function getKnowledgeGraphData(userId: string, supabaseClient?: any) {
  const supabase = supabaseClient || createBrowserClient()

  try {
    // Get all books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select(`
        id,
        title,
        author,
        cover_url
      `)
      .eq('user_id', userId)

    if (booksError) throw booksError

    // Get all connection-type notes
    const { data: connectionNotes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('note_type', 'connection')
      .eq('is_archived', false)

    if (notesError) throw notesError

    // Get all linked note IDs from connection notes
    const allLinkedIds = new Set<string>()
    connectionNotes?.forEach((note: any) => {
      if (note.linked_note_ids && Array.isArray(note.linked_note_ids)) {
        note.linked_note_ids.forEach((id: string) => allLinkedIds.add(id))
      }
    })

    // Fetch all linked notes (of any type)
    let allNotes: any[] = []
    if (allLinkedIds.size > 0) {
      const { data: linkedNotes, error: linkedError } = await supabase
        .from('notes')
        .select('*')
        .in('id', Array.from(allLinkedIds))
        .eq('user_id', userId)
        .eq('is_archived', false)

      if (!linkedError && linkedNotes) {
        allNotes = [...(connectionNotes || []), ...linkedNotes]
      } else {
        allNotes = connectionNotes || []
      }
    } else {
      allNotes = connectionNotes || []
    }

    return {
      data: {
        books,
        connectionNotes,
        allNotes, // All notes including connection notes and their linked notes
      },
      error: null,
    }
  } catch (error: any) {
    console.error('Error fetching knowledge graph data:', error)
    return { data: null, error }
  }
}
