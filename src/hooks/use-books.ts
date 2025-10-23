import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBooks, getBook, createBook, updateBook, deleteBook } from '@/lib/api/books'
import { toast } from 'sonner'

export function useBooks(status?: string) {
  return useQuery({
    queryKey: ['books', status],
    queryFn: () => getBooks(status),
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => getBook(id),
    enabled: !!id,
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book added successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add book')
    },
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateBook(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update book')
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete book')
    },
  })
}
