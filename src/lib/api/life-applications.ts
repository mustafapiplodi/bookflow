import { createClient } from '@/lib/supabase/client'

export interface LifeApplication {
  id: string
  user_id: string
  book_id: string
  note_id: string | null
  action_item_id: string | null
  concept: string
  situation: string
  outcome: string | null
  date_applied: string
  effectiveness_rating: number | null
  would_use_again: boolean | null
  created_at: string
  updated_at: string
}

export interface LifeApplicationWithBook extends LifeApplication {
  book: {
    id: string
    title: string
    author: string
    cover_url: string | null
  }
}

export interface CreateLifeApplicationData {
  book_id: string
  note_id?: string | null
  action_item_id?: string | null
  concept: string
  situation: string
  outcome?: string | null
  date_applied?: string
  effectiveness_rating?: number | null
  would_use_again?: boolean | null
}

export interface UpdateLifeApplicationData {
  concept?: string
  situation?: string
  outcome?: string | null
  date_applied?: string
  effectiveness_rating?: number | null
  would_use_again?: boolean | null
}

/**
 * Get all life applications for a user
 */
export async function getLifeApplications(userId: string): Promise<LifeApplicationWithBook[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('life_applications')
    .select(`
      *,
      books(id, title, author, cover_url)
    `)
    .eq('user_id', userId)
    .order('date_applied', { ascending: false })

  if (error) throw error

  return (data || []).map(item => ({
    ...item,
    book: item.books
  })) as any
}

/**
 * Get life applications for a specific book
 */
export async function getLifeApplicationsByBook(
  userId: string,
  bookId: string
): Promise<LifeApplicationWithBook[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('life_applications')
    .select(`
      *,
      books(id, title, author, cover_url)
    `)
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .order('date_applied', { ascending: false })

  if (error) throw error

  return (data || []).map(item => ({
    ...item,
    book: item.books
  })) as any
}

/**
 * Get a single life application by ID
 */
export async function getLifeApplication(
  userId: string,
  applicationId: string
): Promise<LifeApplicationWithBook | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('life_applications')
    .select(`
      *,
      books(id, title, author, cover_url)
    `)
    .eq('id', applicationId)
    .eq('user_id', userId)
    .single()

  if (error) throw error

  if (!data) return null

  return {
    ...data,
    book: data.books
  } as any
}

/**
 * Create a new life application
 */
export async function createLifeApplication(
  userId: string,
  data: CreateLifeApplicationData
): Promise<LifeApplication> {
  const supabase = createClient()

  const { data: application, error } = await supabase
    .from('life_applications')
    .insert({
      user_id: userId,
      ...data,
      date_applied: data.date_applied || new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) throw error
  return application
}

/**
 * Update a life application
 */
export async function updateLifeApplication(
  userId: string,
  applicationId: string,
  data: UpdateLifeApplicationData
): Promise<LifeApplication> {
  const supabase = createClient()

  const { data: application, error } = await supabase
    .from('life_applications')
    .update(data)
    .eq('id', applicationId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return application
}

/**
 * Delete a life application
 */
export async function deleteLifeApplication(
  userId: string,
  applicationId: string
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('life_applications')
    .delete()
    .eq('id', applicationId)
    .eq('user_id', userId)

  if (error) throw error
}

/**
 * Get life application statistics
 */
export async function getLifeApplicationStats(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('life_applications')
    .select('book_id, effectiveness_rating, would_use_again, books(title)')
    .eq('user_id', userId)

  if (error) throw error

  const applications = data || []
  const withRatings = applications.filter(app => app.effectiveness_rating !== null)

  // Calculate average effectiveness
  const avgEffectiveness = withRatings.length > 0
    ? withRatings.reduce((sum, app) => sum + (app.effectiveness_rating || 0), 0) / withRatings.length
    : 0

  // Count would use again
  const wouldUseAgainCount = applications.filter(app => app.would_use_again === true).length

  // Count by book
  const bookCounts: Record<string, { count: number; title: string }> = {}
  applications.forEach(app => {
    if (!bookCounts[app.book_id]) {
      bookCounts[app.book_id] = {
        count: 0,
        title: (app.books as any)?.title || 'Unknown'
      }
    }
    bookCounts[app.book_id].count++
  })

  // Find most applied book
  const mostAppliedBook = Object.entries(bookCounts)
    .sort(([, a], [, b]) => b.count - a.count)[0]

  return {
    total: applications.length,
    avgEffectiveness: Math.round(avgEffectiveness * 10) / 10,
    wouldUseAgainCount,
    wouldUseAgainPercentage: applications.length > 0
      ? Math.round((wouldUseAgainCount / applications.length) * 100)
      : 0,
    mostAppliedBook: mostAppliedBook ? {
      id: mostAppliedBook[0],
      title: mostAppliedBook[1].title,
      count: mostAppliedBook[1].count
    } : null,
    totalBooks: Object.keys(bookCounts).length
  }
}
