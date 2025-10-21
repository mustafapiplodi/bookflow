'use client'

import { useState } from 'react'
import { MoreVertical, Pin, Archive, Trash, Edit, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Note, noteTypeLabels, noteTypeColors, noteTypeIcons } from '@/lib/api/notes'
import { format } from 'date-fns'

interface NoteCardProps {
  note: Note & {
    books?: {
      id: string
      title: string
      author: string
    }
  }
  showBookInfo?: boolean
  onEdit?: (note: Note) => void
  onDelete?: (noteId: string) => void
  onTogglePin?: (noteId: string, isPinned: boolean) => void
  onToggleArchive?: (noteId: string, isArchived: boolean) => void
}

export function NoteCard({
  note,
  showBookInfo = false,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Strip HTML tags for preview
  const getPlainTextPreview = (html: string, maxLength: number = 150) => {
    const text = html.replace(/<[^>]*>/g, '')
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const preview = getPlainTextPreview(note.content)
  const isLongContent = note.content.replace(/<[^>]*>/g, '').length > 150

  // Get border color based on note type
  const borderColorMap: Record<string, string> = {
    idea: 'border-l-4 border-l-purple-500',
    argument: 'border-l-4 border-l-red-500',
    action: 'border-l-4 border-l-green-500',
    quote: 'border-l-4 border-l-blue-500',
    question: 'border-l-4 border-l-yellow-500',
    connection: 'border-l-4 border-l-indigo-500',
    disagreement: 'border-l-4 border-l-orange-500',
    insight: 'border-l-4 border-l-pink-500',
    data: 'border-l-4 border-l-cyan-500',
    example: 'border-l-4 border-l-teal-500',
    reflection: 'border-l-4 border-l-violet-500',
    definition: 'border-l-4 border-l-gray-500',
  }

  return (
    <Card className={`${note.is_pinned ? 'border-primary' : ''} ${borderColorMap[note.note_type] || ''} relative transition-shadow hover:shadow-lg`}>
      {note.is_pinned && (
        <div className="absolute top-2 right-2">
          <Pin className="h-4 w-4 text-primary fill-primary" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            {/* Note Type Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={noteTypeColors[note.note_type]}>
                <span className="mr-1">{noteTypeIcons[note.note_type]}</span>
                {noteTypeLabels[note.note_type]}
              </Badge>

              {/* Priority Badge */}
              {note.priority !== 'none' && (
                <Badge
                  variant={
                    note.priority === 'urgent'
                      ? 'destructive'
                      : note.priority === 'important'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {note.priority}
                </Badge>
              )}

              {/* Private Badge */}
              {note.is_private && (
                <Badge variant="outline" className="text-xs">
                  Private
                </Badge>
              )}
            </div>

            {/* Title */}
            {note.title && (
              <CardTitle className="text-lg pr-8">{note.title}</CardTitle>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(note)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onTogglePin && (
                <DropdownMenuItem
                  onClick={() => onTogglePin(note.id, !note.is_pinned)}
                >
                  <Pin className="mr-2 h-4 w-4" />
                  {note.is_pinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
              )}
              {onToggleArchive && (
                <DropdownMenuItem
                  onClick={() => onToggleArchive(note.id, !note.is_archived)}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  {note.is_archived ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(note.id)}
                  className="text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Book Info */}
        {showBookInfo && note.books && (
          <CardDescription className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            {note.books.title} by {note.books.author}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Content Preview */}
        <div
          className={`prose prose-sm max-w-none ${!isExpanded && isLongContent ? 'line-clamp-3' : ''}`}
          dangerouslySetInnerHTML={{
            __html: isExpanded ? note.content : preview,
          }}
        />

        {/* Expand/Collapse Button */}
        {isLongContent && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {note.chapter && (
            <span className="flex items-center gap-1">
              <span className="font-medium">Chapter:</span> {note.chapter}
            </span>
          )}
          {note.page_number && (
            <span className="flex items-center gap-1">
              <span className="font-medium">Page:</span> {note.page_number}
            </span>
          )}
          {note.section && (
            <span className="flex items-center gap-1">
              <span className="font-medium">Section:</span> {note.section}
            </span>
          )}
          <span>{format(new Date(note.created_at), 'MMM d, yyyy')}</span>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
