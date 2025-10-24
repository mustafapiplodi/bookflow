'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Star, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useUpdateBook } from '@/hooks/use-books'

const completionSchema = z.object({
  rating: z.number().min(1).max(5),
  oneSentenceTakeaway: z.string().min(10, 'Please provide a meaningful takeaway (at least 10 characters)'),
})

type CompletionFormData = z.infer<typeof completionSchema>

interface BookCompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookId: string
  bookTitle: string
}

export function BookCompletionDialog({
  open,
  onOpenChange,
  bookId,
  bookTitle,
}: BookCompletionDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const updateBook = useUpdateBook()

  const form = useForm<CompletionFormData>({
    resolver: zodResolver(completionSchema),
    defaultValues: {
      rating: 0,
      oneSentenceTakeaway: '',
    },
  })

  const onSubmit = async (data: CompletionFormData) => {
    try {
      await updateBook.mutateAsync({
        id: bookId,
        updates: {
          status: 'finished',
          date_finished: new Date().toISOString(),
          rating: data.rating,
          one_sentence_takeaway: data.oneSentenceTakeaway,
        },
      })

      toast.success('Book marked as finished!')
      onOpenChange(false)
      form.reset()
      setRating(0)
    } catch (error) {
      toast.error('Failed to complete book')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <DialogTitle>Congratulations!</DialogTitle>
          </div>
          <DialogDescription>
            You've finished reading <span className="font-semibold text-slate-900">{bookTitle}</span>!
            Share your thoughts before closing this chapter.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How would you rate this book?</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setRating(star)
                            field.onChange(star)
                          }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-2 text-sm text-slate-600">
                          {rating} {rating === 1 ? 'star' : 'stars'}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* One-sentence takeaway */}
            <FormField
              control={form.control}
              name="oneSentenceTakeaway"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's your key takeaway?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="In one sentence, what's the main thing you learned or felt from this book?"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateBook.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {updateBook.isPending ? 'Saving...' : 'Complete Book'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
