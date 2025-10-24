'use client'

import { Tag as TagIcon, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTags } from '@/hooks/use-tags'

interface TagFilterProps {
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
}

export function TagFilter({ selectedTag, onSelectTag }: TagFilterProps) {
  const { data: tags, isLoading } = useTags()

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap">
        <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-7 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-7 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    )
  }

  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TagIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Tag</h3>
        {selectedTag && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSelectTag(null)}
            className="h-6 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTag === tag.tag_name ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => onSelectTag(tag.tag_name)}
          >
            <TagIcon className="w-3 h-3 mr-1" />
            {tag.tag_name}
            <span className="ml-1 text-xs opacity-60">({tag.usage_count})</span>
          </Badge>
        ))}
      </div>
    </div>
  )
}
