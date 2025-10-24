import { useQuery } from '@tanstack/react-query'
import {
  getActionDrivenBooks,
  getReadingPatterns,
  getTopRatedBooks,
  getReadingVelocity,
} from '@/lib/api/insights'

export function useActionDrivenBooks(limit: number = 5) {
  return useQuery({
    queryKey: ['insights', 'action-books', limit],
    queryFn: () => getActionDrivenBooks(limit),
  })
}

export function useReadingPatterns() {
  return useQuery({
    queryKey: ['insights', 'reading-patterns'],
    queryFn: getReadingPatterns,
  })
}

export function useTopRatedBooks(limit: number = 5) {
  return useQuery({
    queryKey: ['insights', 'top-rated', limit],
    queryFn: () => getTopRatedBooks(limit),
  })
}

export function useReadingVelocity() {
  return useQuery({
    queryKey: ['insights', 'velocity'],
    queryFn: getReadingVelocity,
  })
}
