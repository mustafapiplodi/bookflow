import { useQuery } from '@tanstack/react-query'
import {
  getOverviewStats,
  getDailyReadingTime,
  getMonthlyBooksFinished,
  getTopBooks,
} from '@/lib/api/statistics'

export function useOverviewStats() {
  return useQuery({
    queryKey: ['statistics', 'overview'],
    queryFn: getOverviewStats,
  })
}

export function useDailyReadingTime(days: number = 7) {
  return useQuery({
    queryKey: ['statistics', 'daily-reading', days],
    queryFn: () => getDailyReadingTime(days),
  })
}

export function useMonthlyBooksFinished(months: number = 6) {
  return useQuery({
    queryKey: ['statistics', 'monthly-books', months],
    queryFn: () => getMonthlyBooksFinished(months),
  })
}

export function useTopBooks(limit: number = 5) {
  return useQuery({
    queryKey: ['statistics', 'top-books', limit],
    queryFn: () => getTopBooks(limit),
  })
}
