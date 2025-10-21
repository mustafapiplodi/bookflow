import { Database } from '@/types/database'

type Shelf = Database['public']['Tables']['shelves']['Row']
type ShelfInsert = Database['public']['Tables']['shelves']['Insert']
type ShelfUpdate = Database['public']['Tables']['shelves']['Update']

export async function getShelves(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('shelves')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('name', { ascending: true })

  if (error) throw error
  return data as Shelf[]
}

export async function getShelfById(supabase: any, shelfId: string, userId: string) {
  const { data, error } = await supabase
    .from('shelves')
    .select('*')
    .eq('id', shelfId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as Shelf
}

export async function createShelf(supabase: any, shelf: ShelfInsert) {
  const { data, error } = await supabase
    .from('shelves')
    .insert(shelf)
    .select()
    .single()

  if (error) throw error
  return data as Shelf
}

export async function updateShelf(supabase: any, shelfId: string, updates: ShelfUpdate, userId: string) {
  const { data, error } = await supabase
    .from('shelves')
    .update(updates)
    .eq('id', shelfId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Shelf
}

export async function deleteShelf(supabase: any, shelfId: string, userId: string) {
  const { error } = await supabase
    .from('shelves')
    .delete()
    .eq('id', shelfId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function getShelfWithBooks(supabase: any, shelfId: string, userId: string) {
  const { data, error } = await supabase
    .from('shelves')
    .select(`
      *,
      book_shelves (
        books (*)
      )
    `)
    .eq('id', shelfId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getBookCountByShelf(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('shelves')
    .select(`
      id,
      name,
      book_shelves (count)
    `)
    .eq('user_id', userId)

  if (error) throw error
  return data
}
