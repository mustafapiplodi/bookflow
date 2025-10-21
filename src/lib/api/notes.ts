import { createClient } from '@/lib/supabase/client'

export type NoteType =
  | 'idea'
  | 'argument'
  | 'action'
  | 'quote'
  | 'question'
  | 'connection'
  | 'disagreement'
  | 'insight'
  | 'data'
  | 'example'
  | 'reflection'
  | 'definition'

export type NotePriority = 'urgent' | 'important' | 'interesting' | 'none'

export interface Note {
  id: string
  user_id: string
  book_id: string
  session_id: string | null
  title: string | null
  content: string
  note_type: NoteType
  chapter: string | null
  page_number: number | null
  section: string | null
  tags: string[] | null
  priority: NotePriority
  is_private: boolean
  is_pinned: boolean
  is_archived: boolean
  color: string | null
  parent_note_id: string | null
  linked_note_ids: string[] | null
  created_at: string
  updated_at: string
}

export interface CreateNoteInput {
  book_id: string
  session_id?: string
  title?: string
  content: string
  note_type: NoteType
  chapter?: string
  page_number?: number
  section?: string
  tags?: string[]
  priority?: NotePriority
  is_private?: boolean
  is_pinned?: boolean
  color?: string
  linked_note_ids?: string[]
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  note_type?: NoteType
  chapter?: string
  page_number?: number
  section?: string
  tags?: string[]
  priority?: NotePriority
  is_private?: boolean
  is_pinned?: boolean
  is_archived?: boolean
  color?: string
}

/**
 * Get all notes for a user
 */
export async function getNotes(userId: string, filters?: {
  bookId?: string
  noteType?: NoteType
  isPinned?: boolean
  isArchived?: boolean
}) {
  const supabase = createClient()

  let query = supabase
    .from('notes')
    .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url
      )
    `)
    .eq('user_id', userId)

  if (filters?.bookId) {
    query = query.eq('book_id', filters.bookId)
  }

  if (filters?.noteType) {
    query = query.eq('note_type', filters.noteType)
  }

  if (filters?.isPinned !== undefined) {
    query = query.eq('is_pinned', filters.isPinned)
  }

  if (filters?.isArchived !== undefined) {
    query = query.eq('is_archived', filters.isArchived)
  } else {
    // By default, don't show archived notes
    query = query.eq('is_archived', false)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching notes:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get a single note by ID
 */
export async function getNoteById(noteId: string, userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notes')
    .select(`
      *,
      books (
        id,
        title,
        author
      )
    `)
    .eq('id', noteId)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching note:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get notes for a specific book
 */
export async function getBookNotes(bookId: string, userId: string) {
  return getNotes(userId, { bookId })
}

/**
 * Get notes for a specific session
 */
export async function getSessionNotes(sessionId: string, userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching session notes:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Create a new note
 */
export async function createNote(userId: string, input: CreateNoteInput) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: userId,
      book_id: input.book_id,
      session_id: input.session_id || null,
      title: input.title || null,
      content: input.content,
      note_type: input.note_type,
      chapter: input.chapter || null,
      page_number: input.page_number || null,
      section: input.section || null,
      tags: input.tags || null,
      priority: input.priority || 'none',
      is_private: input.is_private || false,
      is_pinned: input.is_pinned || false,
      color: input.color || null,
      linked_note_ids: input.linked_note_ids || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating note:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Update a note
 */
export async function updateNote(
  noteId: string,
  userId: string,
  updates: UpdateNoteInput
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating note:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string, userId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting note:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Toggle note pin status
 */
export async function toggleNotePin(noteId: string, userId: string, isPinned: boolean) {
  return updateNote(noteId, userId, { is_pinned: isPinned })
}

/**
 * Toggle note archive status
 */
export async function toggleNoteArchive(noteId: string, userId: string, isArchived: boolean) {
  return updateNote(noteId, userId, { is_archived: isArchived })
}

/**
 * Search notes by content
 */
export async function searchNotes(userId: string, searchQuery: string) {
  const supabase = createClient()

  const { data, error } = await supabase
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
    .eq('is_archived', false)
    .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching notes:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get note type labels for display
 */
export const noteTypeLabels: Record<NoteType, string> = {
  idea: 'Idea',
  argument: 'Argument',
  action: 'Action',
  quote: 'Quote',
  question: 'Question',
  connection: 'Connection',
  disagreement: 'Disagreement',
  insight: 'Insight',
  data: 'Data',
  example: 'Example',
  reflection: 'Reflection',
  definition: 'Definition',
}

/**
 * Get note type colors for badges
 */
export const noteTypeColors: Record<NoteType, string> = {
  idea: 'bg-purple-100 text-purple-800',
  argument: 'bg-red-100 text-red-800',
  action: 'bg-green-100 text-green-800',
  quote: 'bg-blue-100 text-blue-800',
  question: 'bg-yellow-100 text-yellow-800',
  connection: 'bg-indigo-100 text-indigo-800',
  disagreement: 'bg-orange-100 text-orange-800',
  insight: 'bg-pink-100 text-pink-800',
  data: 'bg-cyan-100 text-cyan-800',
  example: 'bg-teal-100 text-teal-800',
  reflection: 'bg-violet-100 text-violet-800',
  definition: 'bg-gray-100 text-gray-800',
}

/**
 * Get note type icons
 */
export const noteTypeIcons: Record<NoteType, string> = {
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
