'use client'

import { useQuery } from '@tanstack/react-query'
import { Tag as TagIcon, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface ActionTagFilterProps {
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
}

interface TagWithCount {
  tag_name: string
  count: number
}

async function fetchActionTags() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Get all action item note IDs
  const { data: actionNotes } = await supabase
    .from('notes')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_action_item', true)

  if (!actionNotes || actionNotes.length === 0) {
    return []
  }

  const actionNoteIds = actionNotes.map(note => note.id)

  // Get tags for these action notes
  const { data: noteTags } = await supabase
    .from('note_tags')
    .select('tag_name')
    .in('note_id', actionNoteIds)

  if (!noteTags) {
    return []
  }

  // Count occurrences of each tag
  const tagCounts = noteTags.reduce((acc, { tag_name }) => {
    acc[tag_name] = (acc[tag_name] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Convert to array and sort by count
  const tagArray = Object.entries(tagCounts)
    .map(([tag_name, count]) => ({ tag_name, count }))
    .sort((a, b) => b.count - a.count)

  return tagArray
}

export function ActionTagFilter({ selectedTag, onSelectTag }: ActionTagFilterProps) {
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['action-tags'],
    queryFn: fetchActionTags,
  })

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap">
        <div className="h-7 w-20 bg-slate-200 rounded animate-pulse" />
        <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-7 w-16 bg-slate-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TagIcon className="w-4 h-4 text-slate-600" />
        <h3 className="text-sm font-medium text-slate-700">Filter by Tag</h3>
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
            key={tag.tag_name}
            variant={selectedTag === tag.tag_name ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => onSelectTag(tag.tag_name)}
          >
            <TagIcon className="w-3 h-3 mr-1" />
            {tag.tag_name}
            <span className="ml-1 text-xs opacity-60">({tag.count})</span>
          </Badge>
        ))}
      </div>
    </div>
  )
}
