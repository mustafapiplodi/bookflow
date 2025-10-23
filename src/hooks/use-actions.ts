import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getActions, createAction, completeAction, deleteAction } from '@/lib/api/actions'

export function useActions() {
  return useQuery({
    queryKey: ['actions'],
    queryFn: getActions,
  })
}

export function useCreateAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId: string) => createAction(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useCompleteAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      actionId,
      outcome,
    }: {
      actionId: string
      outcome?: string
    }) => completeAction(actionId, outcome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })
}

export function useDeleteAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (actionId: string) => deleteAction(actionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
