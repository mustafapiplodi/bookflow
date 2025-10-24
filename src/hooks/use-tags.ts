import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as tagsApi from '@/lib/api/tags'

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getTags,
  })
}

export function useNoteTags(noteId: string) {
  return useQuery({
    queryKey: ['note-tags', noteId],
    queryFn: () => tagsApi.getNoteTags(noteId),
    enabled: !!noteId,
  })
}

export function useNotesByTag(tagName: string) {
  return useQuery({
    queryKey: ['notes-by-tag', tagName],
    queryFn: () => tagsApi.getNotesByTag(tagName),
    enabled: !!tagName,
  })
}

export function useAddTagToNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, tagName }: { noteId: string; tagName: string }) =>
      tagsApi.addTagToNote(noteId, tagName),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: ['note-tags', noteId] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['action-tags'] })
    },
  })
}

export function useRemoveTagFromNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ noteId, tagName }: { noteId: string; tagName: string }) =>
      tagsApi.removeTagFromNote(noteId, tagName),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: ['note-tags', noteId] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['action-tags'] })
    },
  })
}
