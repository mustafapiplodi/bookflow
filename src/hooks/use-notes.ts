import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, getNote, createNote, updateNote, deleteNote, toggleActionItem } from '@/lib/api/notes'
import { Database } from '@/types/database'

type NoteInsert = Database['public']['Tables']['notes']['Insert']
type NoteUpdate = Database['public']['Tables']['notes']['Update']

export function useNotes(bookId?: string) {
  return useQuery({
    queryKey: bookId ? ['notes', bookId] : ['notes'],
    queryFn: () => getNotes(bookId),
  })
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => getNote(id),
    enabled: !!id,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (note: Omit<NoteInsert, 'user_id'>) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: NoteUpdate }) =>
      updateNote(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useToggleActionItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActionItem }: { id: string; isActionItem: boolean }) =>
      toggleActionItem(id, isActionItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['actions'] })
      queryClient.invalidateQueries({ queryKey: ['action-tags'] })
    },
  })
}
