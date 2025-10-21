'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Star, BookOpen, Lightbulb, MapPin, Target, Calendar as CalendarIcon, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { createLifeApplication } from '@/lib/api/life-applications'
import { createClient } from '@/lib/supabase/client'

const formSchema = z.object({
  book_id: z.string().min(1, 'Book is required'),
  concept: z.string().min(1, 'Concept is required'),
  situation: z.string().min(1, 'Situation is required'),
  outcome: z.string().optional(),
  date_applied: z.date().optional(),
  effectiveness_rating: z.number().min(1).max(5).optional(),
  would_use_again: z.boolean().optional(),
})

interface AddLifeApplicationDialogProps {
  books: Array<{ id: string; title: string; author: string }>
  onApplicationCreated: () => void
  defaultBookId?: string
}

export function AddLifeApplicationDialog({
  books,
  onApplicationCreated,
  defaultBookId,
}: AddLifeApplicationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      book_id: defaultBookId || '',
      concept: '',
      situation: '',
      outcome: '',
      date_applied: new Date(),
      effectiveness_rating: undefined,
      would_use_again: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('You must be logged in to create life applications')
        return
      }

      await createLifeApplication(user.id, {
        book_id: values.book_id,
        concept: values.concept,
        situation: values.situation,
        outcome: values.outcome || null,
        date_applied: values.date_applied ? values.date_applied.toISOString().split('T')[0] : undefined,
        effectiveness_rating: values.effectiveness_rating || null,
        would_use_again: values.would_use_again !== undefined ? values.would_use_again : null,
      })

      toast.success('Life application logged successfully')
      form.reset()
      setOpen(false)
      onApplicationCreated()

      // Dispatch event for sidebar updates if needed
      window.dispatchEvent(new Event('life-applications-updated'))
    } catch (error) {
      console.error('Error creating life application:', error)
      toast.error('Failed to create life application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Life Application</DialogTitle>
          <DialogDescription>
            Record how you applied a concept from your reading in real life
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Essential Fields */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="book_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Book
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {books.map((book) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} by {book.author}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Concept
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g., 5-second rule, Deep work blocks, Active listening..."
                        {...field}
                        maxLength={100}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormDescription>
                        The idea, principle, or technique you learned
                      </FormDescription>
                      <span className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/100
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="situation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Situation
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe where, when, and how you applied this concept..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific: Include where, when, and how you applied it
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Optional Details Section */}
            <Accordion type="single" collapsible className="border rounded-lg">
              <AccordionItem value="optional-details" className="border-0">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <span className="text-sm font-medium">
                    Optional Details (Outcome, Rating, etc.)
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="outcome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Outcome
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What were the results? How did it go?"
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What were the results? Tag it: Successful / Needs work / Mixed / Unexpected
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date_applied"
                      render={({ field }) => {
                        const today = new Date()
                        const yesterday = new Date(today)
                        yesterday.setDate(yesterday.getDate() - 1)

                        const startOfWeek = new Date(today)
                        const dayOfWeek = startOfWeek.getDay()
                        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
                        startOfWeek.setDate(startOfWeek.getDate() + diff)

                        return (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              Date Applied
                            </FormLabel>
                            <div className="flex gap-2 mb-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => field.onChange(today)}
                                className="text-xs"
                              >
                                Today
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => field.onChange(yesterday)}
                                className="text-xs"
                              >
                                Yesterday
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => field.onChange(startOfWeek)}
                                className="text-xs"
                              >
                                This week
                              </Button>
                            </div>
                            <FormControl>
                              <DatePicker
                                date={field.value}
                                onSelect={field.onChange}
                                placeholder="Select date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="effectiveness_rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Effectiveness
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => field.onChange(field.value === rating ? undefined : rating)}
                                  className="hover:scale-110 transition-transform"
                                  title={
                                    rating === 1 ? 'Not effective' :
                                    rating === 2 ? 'Slightly effective' :
                                    rating === 3 ? 'Moderately effective' :
                                    rating === 4 ? 'Very effective' :
                                    'Extremely effective'
                                  }
                                >
                                  <Star
                                    className={`h-8 w-8 ${
                                      field.value && rating <= field.value
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Click to rate how effective it was
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="would_use_again"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          Would you use this again?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === 'true')}
                            value={field.value !== undefined ? field.value.toString() : undefined}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="true" id="would-use-yes" />
                              <Label
                                htmlFor="would-use-yes"
                                className="font-normal cursor-pointer"
                              >
                                Yes, I would use it again
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 space-y-0">
                              <RadioGroupItem value="false" id="would-use-no" />
                              <Label
                                htmlFor="would-use-no"
                                className="font-normal cursor-pointer"
                              >
                                No, I wouldn't use it again
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging...' : 'Log Application'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
