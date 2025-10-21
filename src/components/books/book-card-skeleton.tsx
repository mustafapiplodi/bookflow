import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface BookCardSkeletonProps {
  viewMode?: 'grid' | 'list'
}

export function BookCardSkeleton({ viewMode = 'grid' }: BookCardSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Cover skeleton */}
            <Skeleton className="w-20 h-28 flex-shrink-0 rounded-md" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              <div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Actions skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      {/* Cover Image Skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      <CardHeader className="pb-3">
        {/* Title Skeleton */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        {/* Author Skeleton */}
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Progress Bar Skeleton */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Rating Skeleton */}
        <Skeleton className="h-4 w-16" />

        {/* Genre Skeleton */}
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )
}

export function BookCardSkeletonGrid({ count = 8, viewMode = 'grid' }: { count?: number, viewMode?: 'grid' | 'list' }) {
  return (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

export function BooksPageSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Search and Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Skeleton className="h-10 flex-1" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Books Grid */}
      <BookCardSkeletonGrid count={8} viewMode="grid" />
    </div>
  )
}
