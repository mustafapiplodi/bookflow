'use client'

import { useMemo, useEffect, useState } from 'react'
import { useActions } from '@/hooks/use-actions'
import { ActionCard } from './action-card'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'

interface ActionsListProps {
  filter: 'all' | 'pending' | 'completed'
  searchQuery?: string
  selectedTag?: string | null
}

export function ActionsList({ filter, searchQuery = '', selectedTag = null }: ActionsListProps) {
  const { data: actions, isLoading } = useActions()
  const [noteIdsWithTag, setNoteIdsWithTag] = useState<string[]>([])
  const [loadingTags, setLoadingTags] = useState(false)

  // Fetch note IDs that have the selected tag
  useEffect(() => {
    async function fetchNoteIdsWithTag() {
      if (!selectedTag) {
        setNoteIdsWithTag([])
        return
      }

      setLoadingTags(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('note_tags')
          .select('note_id')
          .eq('tag_name', selectedTag.toLowerCase())

        if (!error && data) {
          setNoteIdsWithTag(data.map(item => item.note_id))
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      } finally {
        setLoadingTags(false)
      }
    }

    fetchNoteIdsWithTag()
  }, [selectedTag])

  // Filter and search actions
  const filteredActions = useMemo(() => {
    if (!actions) return []

    let filtered = actions.filter((action) => {
      if (filter === 'all') return true
      if (filter === 'pending') return !action.is_completed
      if (filter === 'completed') return action.is_completed
      return true
    })

    // Apply tag filter
    if (selectedTag && noteIdsWithTag.length > 0) {
      filtered = filtered.filter((action) =>
        noteIdsWithTag.includes(action.note_id)
      )
    } else if (selectedTag && noteIdsWithTag.length === 0 && !loadingTags) {
      // If tag is selected but no notes have it, show nothing
      return []
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((action) =>
        action.note.content.toLowerCase().includes(query) ||
        action.note.books?.title.toLowerCase().includes(query) ||
        action.outcome?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [actions, filter, searchQuery, selectedTag, noteIdsWithTag, loadingTags])

  if (isLoading || loadingTags) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (!actions || actions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600">
        <p className="text-lg font-medium mb-2">No action items yet</p>
        <p className="text-sm">
          Mark notes as action items to start tracking your goals
        </p>
      </div>
    )
  }

  if (filteredActions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600">
        <p className="text-lg font-medium mb-2">
          {selectedTag
            ? 'No actions found with this tag'
            : searchQuery
            ? 'No actions found'
            : `No ${filter} actions`}
        </p>
        <p className="text-sm">
          {selectedTag
            ? 'Try selecting a different tag'
            : searchQuery
            ? 'Try a different search term'
            : filter === 'completed'
            ? 'Complete some actions to see them here'
            : 'All actions have been completed!'}
        </p>
      </div>
    )
  }

  // Group actions by book
  const actionsByBook = filteredActions.reduce((acc, action) => {
    const bookTitle = action.note.books?.title || 'Unknown Book'
    if (!acc[bookTitle]) {
      acc[bookTitle] = []
    }
    acc[bookTitle].push(action)
    return acc
  }, {} as Record<string, typeof filteredActions>)

  return (
    <div className="space-y-8">
      {Object.entries(actionsByBook).map(([bookTitle, bookActions]) => (
        <div key={bookTitle}>
          <h3 className="text-lg font-semibold mb-3 text-slate-700">
            {bookTitle}
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({bookActions.length} {bookActions.length === 1 ? 'action' : 'actions'})
            </span>
          </h3>
          <div className="space-y-3">
            {bookActions.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
