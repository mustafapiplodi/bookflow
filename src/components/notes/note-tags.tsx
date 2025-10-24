'use client'

import { useState } from 'react'
import { X, Plus, Tag as TagIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNoteTags, useAddTagToNote, useRemoveTagFromNote } from '@/hooks/use-tags'

interface NoteTagsProps {
  noteId: string
  editable?: boolean
}

export function NoteTags({ noteId, editable = false }: NoteTagsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const { data: tags, isLoading } = useNoteTags(noteId)
  const addTag = useAddTagToNote()
  const removeTag = useRemoveTagFromNote()

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagInput.trim()) return

    try {
      await addTag.mutateAsync({
        noteId,
        tagName: tagInput.trim(),
      })
      setTagInput('')
      setIsAdding(false)
    } catch (error) {
      console.error('Failed to add tag:', error)
    }
  }

  const handleRemoveTag = async (tagName: string) => {
    try {
      await removeTag.mutateAsync({ noteId, tagName })
    } catch (error) {
      console.error('Failed to remove tag:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex gap-1 flex-wrap">
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-center flex-wrap">
      {tags && tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1 pl-2 pr-1"
            >
              <TagIcon className="w-3 h-3" />
              <span>{tag.tag_name}</span>
              {editable && (
                <button
                  onClick={() => handleRemoveTag(tag.tag_name)}
                  className="ml-1 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full p-0.5"
                  disabled={removeTag.isPending}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {editable && (
        <>
          {isAdding ? (
            <form onSubmit={handleAddTag} className="flex gap-1">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Tag name..."
                className="h-7 text-sm w-32"
                autoFocus
                disabled={addTag.isPending}
              />
              <Button
                type="submit"
                size="sm"
                className="h-7"
                disabled={addTag.isPending || !tagInput.trim()}
              >
                Add
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7"
                onClick={() => {
                  setIsAdding(false)
                  setTagInput('')
                }}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Tag
            </Button>
          )}
        </>
      )}
    </div>
  )
}
