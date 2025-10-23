import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSessions,
  getSession,
  getActiveSession,
  createSession,
  updateSession,
  endSession,
  deleteSession,
} from '@/lib/api/sessions'
import { toast } from 'sonner'

export function useSessions(bookId?: string) {
  return useQuery({
    queryKey: ['sessions', bookId],
    queryFn: () => getSessions(bookId),
  })
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => getSession(id),
    enabled: !!id,
  })
}

export function useActiveSession() {
  return useQuery({
    queryKey: ['sessions', 'active'],
    queryFn: getActiveSession,
    refetchInterval: 5000, // Refetch every 5 seconds to keep it updated
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Reading session started!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to start session')
    },
  })
}

export function useUpdateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateSession(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update session')
    },
  })
}

export function useEndSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, options }: { id: string; options: any }) =>
      endSession(id, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Session completed!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to end session')
    },
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Session deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete session')
    },
  })
}
