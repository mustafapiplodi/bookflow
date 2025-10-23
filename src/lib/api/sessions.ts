import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type SessionInsert = Database['public']['Tables']['sessions']['Insert']
type SessionUpdate = Database['public']['Tables']['sessions']['Update']

export async function getSessions(bookId?: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let query = supabase
    .from('sessions')
    .select('*, books(id, title, author, cover_image_url)')
    .eq('user_id', user.id)
    .order('start_time', { ascending: false })

  if (bookId) {
    query = query.eq('book_id', bookId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getSession(id: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('sessions')
    .select('*, books(id, title, author, cover_image_url)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function getActiveSession() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('sessions')
    .select('*, books(id, title, author, cover_image_url)')
    .eq('user_id', user.id)
    .is('end_time', null)
    .order('start_time', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createSession(session: Omit<SessionInsert, 'user_id'>) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      ...session,
      user_id: user.id,
      start_time: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSession(id: string, updates: SessionUpdate) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function endSession(
  id: string,
  options: {
    duration: number // in seconds
    session_mood?: 'happy' | 'neutral' | 'sad'
    key_insight?: string
  }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Update session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .update({
      end_time: new Date().toISOString(),
      duration: options.duration,
      session_mood: options.session_mood,
      key_insight: options.key_insight,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (sessionError) throw sessionError

  // Update book's total reading time
  const { data: book } = await supabase
    .from('books')
    .select('total_reading_time')
    .eq('id', session.book_id)
    .single()

  if (book) {
    await supabase
      .from('books')
      .update({
        total_reading_time: (book.total_reading_time || 0) + options.duration,
      })
      .eq('id', session.book_id)
  }

  return session
}

export async function deleteSession(id: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}
