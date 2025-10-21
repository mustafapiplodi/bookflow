import { createClient } from '@/lib/supabase/client'

export interface ReadingSession {
  id: string
  user_id: string
  book_id: string
  start_time: string
  end_time: string | null
  duration_minutes: number | null
  pages_read: number
  start_page: number | null
  end_page: number | null
  session_notes: string | null
  summary: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateSessionInput {
  book_id: string
  start_page?: number
  session_notes?: string
}

export interface UpdateSessionInput {
  end_page?: number
  pages_read?: number
  session_notes?: string
  summary?: string
}

export interface ManualSessionInput {
  book_id: string
  start_time: string
  end_time: string
  start_page?: number
  end_page?: number
  pages_read?: number
  session_notes?: string
  summary?: string
}

/**
 * Get all reading sessions for a user
 */
export async function getSessions(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reading_sessions')
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
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching sessions:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get sessions for a specific book
 */
export async function getBookSessions(bookId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reading_sessions')
    .select('*')
    .eq('book_id', bookId)
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching book sessions:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get active session for a user
 */
export async function getActiveSession(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reading_sessions')
    .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url,
        current_page,
        total_pages
      )
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching active session:', error)
    return { data: null, error }
  }

  return { data: data || null, error: null }
}

/**
 * Start a new reading session
 */
export async function startSession(userId: string, input: CreateSessionInput) {
  const supabase = createClient()

  // Check if there's already an active session
  const { data: existingSession } = await getActiveSession(userId)

  if (existingSession) {
    return {
      data: null,
      error: new Error('You already have an active reading session. Please end it first.')
    }
  }

  const { data, error } = await supabase
    .from('reading_sessions')
    .insert({
      user_id: userId,
      book_id: input.book_id,
      start_time: new Date().toISOString(),
      start_page: input.start_page,
      session_notes: input.session_notes || null,
      is_active: true
    })
    .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url,
        current_page,
        total_pages
      )
    `)
    .single()

  if (error) {
    console.error('Error starting session:', error)
    return { data: null, error }
  }

  // Update book status to 'reading' if not already
  await supabase
    .from('books')
    .update({
      status: 'reading',
      date_started: data.start_time
    })
    .eq('id', input.book_id)
    .is('date_started', null)

  return { data, error: null }
}

/**
 * End an active reading session
 */
export async function endSession(
  sessionId: string,
  userId: string,
  updates: UpdateSessionInput
) {
  const supabase = createClient()

  const endTime = new Date().toISOString()

  const { data, error } = await supabase
    .from('reading_sessions')
    .update({
      end_time: endTime,
      end_page: updates.end_page,
      pages_read: updates.pages_read,
      session_notes: updates.session_notes,
      summary: updates.summary,
      is_active: false
    })
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url
      )
    `)
    .single()

  if (error) {
    console.error('Error ending session:', error)
    return { data: null, error }
  }

  // Update book's current_page if end_page is provided
  if (updates.end_page) {
    await supabase
      .from('books')
      .update({ current_page: updates.end_page })
      .eq('id', data.book_id)
  }

  return { data, error: null }
}

/**
 * Pause an active session (set is_active to false but no end_time)
 */
export async function pauseSession(sessionId: string, userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reading_sessions')
    .update({ is_active: false })
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error pausing session:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Resume a paused session
 */
export async function resumeSession(sessionId: string, userId: string) {
  const supabase = createClient()

  // Check if there's another active session
  const { data: existingSession } = await getActiveSession(userId)

  if (existingSession && existingSession.id !== sessionId) {
    return {
      data: null,
      error: new Error('You already have an active reading session. Please end it first.')
    }
  }

  const { data, error } = await supabase
    .from('reading_sessions')
    .update({ is_active: true })
    .eq('id', sessionId)
    .eq('user_id', userId)
    .is('end_time', null) // Only resume if not ended
    .select()
    .single()

  if (error) {
    console.error('Error resuming session:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Create a manual session entry (for past sessions)
 */
export async function createManualSession(userId: string, input: ManualSessionInput) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reading_sessions')
    .insert({
      user_id: userId,
      book_id: input.book_id,
      start_time: input.start_time,
      end_time: input.end_time,
      start_page: input.start_page,
      end_page: input.end_page,
      pages_read: input.pages_read,
      session_notes: input.session_notes,
      summary: input.summary,
      is_active: false
    })
    .select(`
      *,
      books (
        id,
        title,
        author,
        cover_url
      )
    `)
    .single()

  if (error) {
    console.error('Error creating manual session:', error)
    return { data: null, error }
  }

  // Update book's current_page if end_page is provided and it's greater
  if (input.end_page) {
    const { data: book } = await supabase
      .from('books')
      .select('current_page')
      .eq('id', input.book_id)
      .single()

    if (book && (!book.current_page || input.end_page > book.current_page)) {
      await supabase
        .from('books')
        .update({ current_page: input.end_page })
        .eq('id', input.book_id)
    }
  }

  return { data, error: null }
}

/**
 * Update a session
 */
export async function updateSession(
  sessionId: string,
  userId: string,
  updates: Partial<ReadingSession>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reading_sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating session:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string, userId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('reading_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting session:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Get session statistics for a user
 */
export async function getSessionStats(userId: string, timeRange?: 'week' | 'month' | 'year' | 'all') {
  const supabase = createClient()

  let query = supabase
    .from('reading_sessions')
    .select('duration_minutes, pages_read, start_time')
    .eq('user_id', userId)
    .not('end_time', 'is', null)

  // Apply time range filter
  if (timeRange && timeRange !== 'all') {
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      default:
        startDate = new Date(0) // Beginning of time
    }

    query = query.gte('start_time', startDate.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching session stats:', error)
    return { data: null, error }
  }

  // Calculate statistics
  const totalSessions = data.length
  const totalMinutes = data.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
  const totalPages = data.reduce((sum, s) => sum + (s.pages_read || 0), 0)
  const avgMinutesPerSession = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0
  const avgPagesPerSession = totalSessions > 0 ? Math.round(totalPages / totalSessions) : 0

  return {
    data: {
      totalSessions,
      totalMinutes,
      totalPages,
      avgMinutesPerSession,
      avgPagesPerSession,
      totalHours: Math.floor(totalMinutes / 60)
    },
    error: null
  }
}
