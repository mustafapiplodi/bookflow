import { Database } from '@/types/database'

type Book = Database['public']['Tables']['books']['Row']
type BookInsert = Database['public']['Tables']['books']['Insert']
type BookUpdate = Database['public']['Tables']['books']['Update']

export async function getBooks(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Book[]
}

export async function getBookById(supabase: any, bookId: string, userId: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as Book
}

export async function getBooksByShelves(supabase: any, userId: string, shelfIds: string[]) {
  const { data, error } = await supabase
    .from('book_shelves')
    .select(`
      book_id,
      books (*)
    `)
    .in('shelf_id', shelfIds)
    .eq('books.user_id', userId)

  if (error) throw error
  return data
}

export async function createBook(supabase: any, book: BookInsert) {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()

  if (error) throw error
  return data as Book
}

export async function updateBook(supabase: any, bookId: string, updates: BookUpdate, userId: string) {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', bookId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Book
}

export async function deleteBook(supabase: any, bookId: string, userId: string) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function addBookToShelf(supabase: any, bookId: string, shelfId: string) {
  const { data, error } = await supabase
    .from('book_shelves')
    .insert({ book_id: bookId, shelf_id: shelfId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeBookFromShelf(supabase: any, bookId: string, shelfId: string) {
  const { error } = await supabase
    .from('book_shelves')
    .delete()
    .eq('book_id', bookId)
    .eq('shelf_id', shelfId)

  if (error) throw error
}

export async function getBookShelves(supabase: any, bookId: string) {
  const { data, error } = await supabase
    .from('book_shelves')
    .select(`
      shelf_id,
      shelves (*)
    `)
    .eq('book_id', bookId)

  if (error) throw error
  return data
}

export async function uploadBookCover(supabase: any, userId: string, bookId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${bookId}.${fileExt}`
  const filePath = `book-covers/${fileName}`

  const { data, error } = await supabase.storage
    .from('book-covers')
    .upload(filePath, file, { upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('book-covers')
    .getPublicUrl(filePath)

  return publicUrl
}
