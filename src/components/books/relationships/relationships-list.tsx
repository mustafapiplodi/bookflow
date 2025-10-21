'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link2, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { createClient } from '@/lib/supabase/client'
import {
  deleteBookRelationship,
  relationshipTypeConfig,
  type BookRelationshipWithBook,
} from '@/lib/api/book-relationships'

interface RelationshipsListProps {
  relationships: BookRelationshipWithBook[]
  onRelationshipDeleted: () => void
}

export function RelationshipsList({ relationships, onRelationshipDeleted }: RelationshipsListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [relationshipToDelete, setRelationshipToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!relationshipToDelete) return

    try {
      setIsDeleting(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('You must be logged in')
        return
      }

      await deleteBookRelationship(user.id, relationshipToDelete)
      toast.success('Relationship deleted')
      setDeleteDialogOpen(false)
      setRelationshipToDelete(null)
      onRelationshipDeleted()
    } catch (error) {
      console.error('Error deleting relationship:', error)
      toast.error('Failed to delete relationship')
    } finally {
      setIsDeleting(false)
    }
  }

  if (relationships.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Related Books Yet</h3>
          <p className="text-sm text-muted-foreground">
            Start connecting books to discover patterns and build your knowledge graph
          </p>
        </CardContent>
      </Card>
    )
  }

  // Group by relationship type
  const groupedRelationships = relationships.reduce((acc, rel) => {
    if (!acc[rel.relationship_type]) {
      acc[rel.relationship_type] = []
    }
    acc[rel.relationship_type].push(rel)
    return acc
  }, {} as Record<string, BookRelationshipWithBook[]>)

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedRelationships).map(([type, rels]) => {
          const config = relationshipTypeConfig[type as keyof typeof relationshipTypeConfig]

          return (
            <div key={type} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{config.icon}</span>
                <h3 className="text-lg font-semibold">{config.label}</h3>
                <Badge variant="secondary">{rels.length}</Badge>
              </div>

              <div className="space-y-2">
                {rels.map((rel) => (
                  <Card key={rel.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div
                            className="font-semibold cursor-pointer hover:underline"
                            onClick={() => router.push(`/books/${rel.related_book.id}`)}
                          >
                            {rel.related_book.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            by {rel.related_book.author}
                          </div>

                          {rel.strength && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Strength:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`h-2 w-8 rounded ${
                                      i <= rel.strength!
                                        ? 'bg-primary'
                                        : 'bg-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-muted-foreground">({rel.strength}/5)</span>
                            </div>
                          )}

                          {rel.notes && (
                            <div className="text-sm bg-muted/50 p-2 rounded-md">
                              <p className="text-muted-foreground">{rel.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/books/${rel.related_book.id}`)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRelationshipToDelete(rel.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Relationship?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the connection between these books. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
