'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import {
  createBookRelationship,
  getSuggestedRelatedBooks,
  relationshipTypeConfig,
  type RelationshipType,
} from '@/lib/api/book-relationships'

const formSchema = z.object({
  related_book_id: z.string().min(1, 'Please select a book'),
  relationship_type: z.enum(['similar_to', 'contradicts', 'builds_on', 'referenced_in']),
  strength: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
})

interface AddRelationshipDialogProps {
  bookId: string
  bookTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRelationshipAdded: () => void
}

export function AddRelationshipDialog({
  bookId,
  bookTitle,
  open,
  onOpenChange,
  onRelationshipAdded,
}: AddRelationshipDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [books, setBooks] = useState<Array<{ id: string; title: string; author: string; cover_url: string | null }>>([])
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; author: string }>>([])
  const [searchQuery, setSearchQuery] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      related_book_id: '',
      relationship_type: 'similar_to',
      strength: 3,
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      loadBooks()
      loadSuggestions()
    }
  }, [open, bookId])

  async function loadBooks() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, cover_url')
        .eq('user_id', user.id)
        .neq('id', bookId)
        .order('title')

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error('Error loading books:', error)
    }
  }

  async function loadSuggestions() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const data = await getSuggestedRelatedBooks(user.id, bookId)
      setSuggestions(data)
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('You must be logged in')
        return
      }

      await createBookRelationship(user.id, {
        book_id: bookId,
        related_book_id: values.related_book_id,
        relationship_type: values.relationship_type,
        strength: values.strength,
        notes: values.notes,
      })

      toast.success('Book relationship added!')
      onOpenChange(false)
      form.reset()
      onRelationshipAdded()
    } catch (error: any) {
      console.error('Error creating relationship:', error)
      toast.error(error.message || 'Failed to add relationship')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Add Book Relationship
          </DialogTitle>
          <DialogDescription>
            Connect "{bookTitle}" to related books in your library
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <Label>Suggested Books</Label>
                <div className="space-y-2">
                  {suggestions.map((book) => (
                    <Card
                      key={book.id}
                      className="p-3 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => form.setValue('related_book_id', book.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{book.title}</div>
                          <div className="text-xs text-muted-foreground">{book.author}</div>
                        </div>
                        {form.watch('related_book_id') === book.id && (
                          <Badge variant="secondary">Selected</Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                <Separator />
              </div>
            )}

            {/* Book Selection */}
            <FormField
              control={form.control}
              name="related_book_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Book</FormLabel>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a book to relate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {filteredBooks.map((book) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} - {book.author}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Relationship Type */}
            <FormField
              control={form.control}
              name="relationship_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(relationshipTypeConfig) as RelationshipType[]).map((type) => {
                      const config = relationshipTypeConfig[type]
                      return (
                        <Card
                          key={type}
                          className={`p-3 cursor-pointer transition-all ${
                            field.value === type ? 'ring-2 ring-primary' : 'hover:bg-accent'
                          }`}
                          onClick={() => field.onChange(type)}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xl">{config.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{config.label}</div>
                              <div className="text-xs text-muted-foreground">{config.description}</div>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Strength */}
            <FormField
              control={form.control}
              name="strength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Strength (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="range"
                        min="1"
                        max="5"
                        value={field.value || 3}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <Badge variant="outline">{field.value || 3}/5</Badge>
                    </div>
                  </FormControl>
                  <FormDescription>
                    How strong is this relationship? (1 = weak, 5 = strong)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this relationship..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Relationship'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
