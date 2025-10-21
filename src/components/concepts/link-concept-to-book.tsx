'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { linkConceptToBook, unlinkConceptFromBook } from '@/lib/api/concepts'

interface Concept {
  id: string
  name: string
  category: string | null
}

interface BookConcept {
  id: string
  concept_id: string
  notes: string | null
  concepts: Concept
}

interface LinkConceptToBookProps {
  bookId: string
  userId: string
  bookConcepts: BookConcept[]
  onUpdate: () => void
}

export function LinkConceptToBook({
  bookId,
  userId,
  bookConcepts,
  onUpdate,
}: LinkConceptToBookProps) {
  const [open, setOpen] = useState(false)
  const [allConcepts, setAllConcepts] = useState<Concept[]>([])
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchConcepts()
    }
  }, [open])

  async function fetchConcepts() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('concepts')
        .select('id, name, category')
        .eq('user_id', userId)
        .order('name', { ascending: true })

      if (error) throw error

      // Filter out concepts already linked to this book
      const linkedConceptIds = new Set(bookConcepts.map((bc) => bc.concept_id))
      const availableConcepts = (data || []).filter((c) => !linkedConceptIds.has(c.id))

      setAllConcepts(availableConcepts)
    } catch (error: any) {
      toast.error('Failed to load concepts')
      console.error(error)
    }
  }

  async function handleLink() {
    if (!selectedConcept) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const result = await linkConceptToBook(supabase, bookId, selectedConcept.id, notes)

      if (result.error) {
        throw new Error(result.error.message)
      }

      toast.success(`Linked concept "${selectedConcept.name}"`)
      setOpen(false)
      setSelectedConcept(null)
      setNotes('')
      onUpdate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to link concept')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUnlink(bookConceptId: string, conceptName: string) {
    try {
      const supabase = createClient()
      const result = await unlinkConceptFromBook(supabase, bookConceptId)

      if (result.error) {
        throw new Error(result.error.message)
      }

      toast.success(`Unlinked concept "${conceptName}"`)
      onUpdate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to unlink concept')
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Concepts
            </CardTitle>
            <CardDescription>
              Track concepts and ideas from this book
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Link Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Link Concept to Book</DialogTitle>
                <DialogDescription>
                  Select an existing concept or create a new one
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Concept</Label>
                  <Command className="rounded-lg border shadow-md mt-2">
                    <CommandInput placeholder="Search concepts..." />
                    <CommandEmpty>No concepts found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                      {allConcepts.map((concept) => (
                        <CommandItem
                          key={concept.id}
                          onSelect={() => setSelectedConcept(concept)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{concept.name}</span>
                            {concept.category && (
                              <Badge variant="outline" className="text-xs">
                                {concept.category}
                              </Badge>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                  {selectedConcept && (
                    <div className="mt-2 p-2 bg-primary/10 rounded flex items-center justify-between">
                      <span className="text-sm font-medium">{selectedConcept.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedConcept(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about how this concept applies to this book..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleLink} disabled={!selectedConcept || isLoading}>
                    {isLoading ? 'Linking...' : 'Link Concept'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {bookConcepts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No concepts linked yet</p>
            <p className="text-xs mt-1">Link concepts to build your knowledge graph</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookConcepts.map((bc) => (
              <div
                key={bc.id}
                className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{bc.concepts.name}</h4>
                    {bc.concepts.category && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {bc.concepts.category}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlink(bc.id, bc.concepts.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {bc.notes && (
                  <p className="text-xs text-muted-foreground mt-2">{bc.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
