import { createClient } from '@/lib/supabase/client'

export type ActionPriority = 'high' | 'medium' | 'low'
export type ActionStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled'

export interface Subtask {
  id: string
  text: string
  completed: boolean
  order: number
}

export interface ActionItem {
  id: string
  user_id: string
  book_id: string
  note_id: string | null
  title: string
  description: string | null
  priority: ActionPriority
  status: ActionStatus
  due_date: string | null
  completed_at: string | null
  implementation_notes: string | null
  category: string | null
  is_recurring: boolean
  recurrence_pattern: string | null
  subtasks: Subtask[]
  created_at: string
  updated_at: string
}

export interface ActionItemWithBook extends ActionItem {
  book: {
    id: string
    title: string
    author: string
    cover_url: string | null
  }
}

export interface CreateActionItemData {
  book_id: string
  note_id?: string | null
  title: string
  description?: string | null
  priority?: ActionPriority
  status?: ActionStatus
  due_date?: string | null
  category?: string | null
  is_recurring?: boolean
  recurrence_pattern?: string | null
}

export interface UpdateActionItemData {
  title?: string
  description?: string | null
  priority?: ActionPriority | null
  status?: ActionStatus
  due_date?: string | null
  completed_at?: string | null
  implementation_notes?: string | null
  category?: string | null
  is_recurring?: boolean
  recurrence_pattern?: string | null
  subtasks?: Subtask[]
}

/**
 * Get all action items (from action_items table, with fallback to notes)
 */
export async function getActionItems(userId: string): Promise<ActionItemWithBook[]> {
  const supabase = createClient()

  // First try to get from action_items table
  const { data: actionItemsData, error: itemsError } = await supabase
    .from('action_items')
    .select(`
      *,
      books(id, title, author, cover_url)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!itemsError && actionItemsData && actionItemsData.length > 0) {
    // Transform the data to match our type
    return actionItemsData.map(item => ({
      ...item,
      book: item.books
    })) as any
  }

  // Fallback: Get action-type notes (legacy behavior)
  const { data: actionNotesData, error: notesError } = await supabase
    .from('notes')
    .select(`
      *,
      books(id, title, author, cover_url)
    `)
    .eq('user_id', userId)
    .eq('note_type', 'action')
    .order('created_at', { ascending: false })

  if (notesError) throw notesError

  // Transform action notes to action items
  const actionNotes = (actionNotesData || []).map(note => {
    // Map note priority to action priority
    let priority: ActionPriority | null = null
    if (note.priority === 'urgent') priority = 'high'
    else if (note.priority === 'important') priority = 'medium'
    else if (note.priority === 'interesting') priority = 'low'

    return {
      id: note.id,
      user_id: note.user_id,
      book_id: note.book_id,
      note_id: note.id,
      title: note.title || 'Untitled Action',
      description: note.content?.replace(/<[^>]*>/g, '').substring(0, 200) || null,
      priority,
      status: note.is_archived ? 'completed' : 'todo' as ActionStatus,
      due_date: null,
      completed_at: note.is_archived ? note.updated_at : null,
      implementation_notes: null,
      category: null,
      is_recurring: false,
      recurrence_pattern: null,
      subtasks: [],
      created_at: note.created_at,
      updated_at: note.updated_at,
      book: note.books,
    }
  })

  return actionNotes as any
}

/**
 * Get action items filtered by status
 */
export async function getActionItemsByStatus(
  userId: string,
  status: ActionStatus
): Promise<ActionItemWithBook[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('action_items')
    .select(`
      *,
      books(id, title, author, cover_url)
    `)
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Transform the data to match our type
  return (data || []).map(item => ({
    ...item,
    book: item.books
  })) as any
}

/**
 * Get action items for a specific book
 */
export async function getActionItemsByBook(
  userId: string,
  bookId: string
): Promise<ActionItemWithBook[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('action_items')
    .select(`
      *,
      books(id, title, author, cover_url)
    `)
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Transform the data to match our type
  return (data || []).map(item => ({
    ...item,
    book: item.books
  })) as any
}

/**
 * Get a single action item by ID
 */
export async function getActionItem(
  userId: string,
  actionItemId: string
): Promise<ActionItemWithBook | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('action_items')
    .select(`
      *,
      books(id, title, author, cover_url)
    `)
    .eq('id', actionItemId)
    .eq('user_id', userId)
    .single()

  if (error) throw error

  if (!data) return null

  // Transform the data to match our type
  return {
    ...data,
    book: data.books
  } as any
}

/**
 * Create a new action item
 */
export async function createActionItem(
  userId: string,
  data: CreateActionItemData
): Promise<ActionItem> {
  const supabase = createClient()

  const { data: actionItem, error } = await supabase
    .from('action_items')
    .insert({
      user_id: userId,
      ...data,
    })
    .select()
    .single()

  if (error) throw error
  return actionItem
}

/**
 * Update an action item
 * Since we're using the notes table for action items, we update notes
 * But we also need to actually use the action_items table for real features
 */
export async function updateActionItem(
  userId: string,
  actionItemId: string,
  data: UpdateActionItemData
): Promise<ActionItem> {
  const supabase = createClient()

  // First try to update action_items table directly by ID
  const { data: existingActionItem } = await supabase
    .from('action_items')
    .select('id')
    .eq('id', actionItemId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existingActionItem) {
    // Update the action_items table directly
    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.priority !== undefined) updateData.priority = data.priority
    if (data.status !== undefined) {
      updateData.status = data.status
      if (data.status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }
    }
    if (data.due_date !== undefined) updateData.due_date = data.due_date
    if (data.implementation_notes !== undefined) updateData.implementation_notes = data.implementation_notes
    if (data.category !== undefined) updateData.category = data.category
    if (data.is_recurring !== undefined) updateData.is_recurring = data.is_recurring
    if (data.recurrence_pattern !== undefined) updateData.recurrence_pattern = data.recurrence_pattern
    if (data.subtasks !== undefined) updateData.subtasks = data.subtasks

    const { data: updated, error } = await supabase
      .from('action_items')
      .update(updateData)
      .eq('id', actionItemId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return updated as ActionItem
  } else {
    // Fallback: Update note (legacy behavior)
    const noteUpdate: any = {}

    if (data.title) noteUpdate.title = data.title
    if (data.description) noteUpdate.content = data.description

    // Map priority
    if (data.priority) {
      if (data.priority === 'high') noteUpdate.priority = 'urgent'
      else if (data.priority === 'medium') noteUpdate.priority = 'important'
      else if (data.priority === 'low') noteUpdate.priority = 'interesting'
    }

    // If status is completed, archive the note; if todo/in_progress, unarchive it
    if (data.status === 'completed' || data.status === 'cancelled') {
      noteUpdate.is_archived = true
    } else {
      noteUpdate.is_archived = false
    }

    const { data: note, error } = await supabase
      .from('notes')
      .update(noteUpdate)
      .eq('id', actionItemId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      id: note.id,
      user_id: note.user_id,
      book_id: note.book_id,
      note_id: note.id,
      title: note.title || 'Untitled Action',
      description: note.content,
      priority: data.priority || null,
      status: data.status || 'todo',
      due_date: null,
      completed_at: noteUpdate.is_archived ? new Date().toISOString() : null,
      implementation_notes: data.implementation_notes || null,
      category: data.category || null,
      is_recurring: data.is_recurring || false,
      recurrence_pattern: data.recurrence_pattern || null,
      subtasks: data.subtasks || [],
      created_at: note.created_at,
      updated_at: note.updated_at,
    } as any
  }
}

/**
 * Delete an action item (deletes the underlying note)
 */
export async function deleteActionItem(
  userId: string,
  actionItemId: string
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', actionItemId)
    .eq('user_id', userId)

  if (error) throw error
}

/**
 * Get action item statistics (from action-type notes)
 */
export async function getActionItemStats(userId: string) {
  const supabase = createClient()

  // Get action-type notes
  const { data: actionNotesData, error: notesError } = await supabase
    .from('notes')
    .select('priority, is_archived')
    .eq('user_id', userId)
    .eq('note_type', 'action')

  if (notesError) throw notesError

  const activeNotes = (actionNotesData || []).filter(note => !note.is_archived)
  const completedNotes = (actionNotesData || []).filter(note => note.is_archived)

  const stats = {
    total: activeNotes.length,
    todo: activeNotes.length, // All active notes are "to do"
    inProgress: 0, // We don't track this separately
    completed: completedNotes.length,
    cancelled: 0,
    highPriority: activeNotes.filter((note) => note.priority === 'urgent').length,
    mediumPriority: activeNotes.filter((note) => note.priority === 'important').length,
    lowPriority: activeNotes.filter((note) => note.priority === 'interesting').length,
  }

  return stats
}
