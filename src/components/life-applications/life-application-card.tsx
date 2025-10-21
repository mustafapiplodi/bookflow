'use client'

import { format } from 'date-fns'
import {
  BookOpen,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Star,
  Edit,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { LifeApplicationWithBook } from '@/lib/api/life-applications'

interface LifeApplicationCardProps {
  application: LifeApplicationWithBook
  onEdit: (application: LifeApplicationWithBook) => void
  onDelete: (id: string) => void
}

export function LifeApplicationCard({ application, onEdit, onDelete }: LifeApplicationCardProps) {
  const effectivenessColors = {
    1: 'text-red-600',
    2: 'text-orange-600',
    3: 'text-yellow-600',
    4: 'text-green-600',
    5: 'text-emerald-600',
  }

  const effectivenessColor = application.effectiveness_rating
    ? effectivenessColors[application.effectiveness_rating as keyof typeof effectivenessColors]
    : 'text-muted-foreground'

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold leading-none text-lg">
              {application.concept}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <BookOpen className="h-3 w-3" />
              <span className="truncate">{application.book.title}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(application)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(application.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Situation</p>
          <p className="text-sm line-clamp-3">{application.situation}</p>
        </div>

        {application.outcome && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Outcome</p>
            <p className="text-sm line-clamp-3">{application.outcome}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {application.effectiveness_rating && (
            <Badge variant="outline" className="gap-1">
              <Star className={cn('h-3 w-3', effectivenessColor)} />
              {application.effectiveness_rating}/5
            </Badge>
          )}

          {application.would_use_again !== null && (
            <Badge variant={application.would_use_again ? 'default' : 'secondary'} className="gap-1">
              {application.would_use_again ? (
                <>
                  <ThumbsUp className="h-3 w-3" />
                  Would use again
                </>
              ) : (
                <>
                  <ThumbsDown className="h-3 w-3" />
                  Wouldn't use again
                </>
              )}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(application.date_applied), 'MMM d, yyyy')}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
