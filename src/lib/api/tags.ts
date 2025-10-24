import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type TagInsert = Database['public']['Tables']['tags']['Insert']
type NoteTagInsert = Database['public']['Tables']['note_tags']['Insert']

export async function getTags() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .order('usage_count', { ascending: false })

  if (error) throw error
  return data
}

export async function getOrCreateTag(tagName: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if tag exists
  const { data: existingTag } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .eq('tag_name', tagName.toLowerCase().trim())
    .maybeSingle()

  if (existingTag) {
    // Increment usage count
    const { data, error } = await supabase
      .from('tags')
      .update({ usage_count: (existingTag.usage_count || 0) + 1 })
      .eq('id', existingTag.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create new tag
  const { data, error } = await supabase
    .from('tags')
    .insert({
      user_id: user.id,
      tag_name: tagName.toLowerCase().trim(),
      usage_count: 1,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function addTagToNote(noteId: string, tagName: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get or create the tag
  const tag = await getOrCreateTag(tagName)

  // Check if note already has this tag
  const { data: existingNoteTag } = await supabase
    .from('note_tags')
    .select('*')
    .eq('note_id', noteId)
    .eq('tag_name', tag.tag_name)
    .maybeSingle()

  if (existingNoteTag) {
    return existingNoteTag
  }

  // Add tag to note
  const { data, error } = await supabase
    .from('note_tags')
    .insert({
      note_id: noteId,
      tag_name: tag.tag_name,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeTagFromNote(noteId: string, tagName: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Remove tag from note
  const { error } = await supabase
    .from('note_tags')
    .delete()
    .eq('note_id', noteId)
    .eq('tag_name', tagName.toLowerCase().trim())

  if (error) throw error

  // Decrement usage count on the tag
  const { data: tag } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .eq('tag_name', tagName.toLowerCase().trim())
    .maybeSingle()

  if (tag && tag.usage_count && tag.usage_count > 0) {
    await supabase
      .from('tags')
      .update({ usage_count: tag.usage_count - 1 })
      .eq('id', tag.id)
  }
}

export async function getNoteTags(noteId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('note_tags')
    .select('*')
    .eq('note_id', noteId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getNotesByTag(tagName: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('note_tags')
    .select('note_id, notes(*, books(id, title, author))')
    .eq('tag_name', tagName.toLowerCase().trim())

  if (error) throw error
  return data.map(item => item.notes).filter(Boolean)
}
