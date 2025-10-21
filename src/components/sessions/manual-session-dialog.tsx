'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createManualSession } from '@/lib/api/sessions'

const manualSessionSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
  startPage: z.string().optional(),
  endPage: z.string().optional(),
  pagesRead: z.string().optional(),
  sessionNotes: z.string().optional(),
  summary: z.string().optional(),
}).refine((data) => {
  const start = new Date(`${data.startDate}T${data.startTime}`)
  const end = new Date(`${data.endDate}T${data.endTime}`)
  return end > start
}, {
  message: 'End time must be after start time',
  path: ['endTime']
})

type ManualSessionFormValues = z.infer<typeof manualSessionSchema>

interface ManualSessionDialogProps {
  userId: string
  bookId: string
  bookTitle?: string
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function ManualSessionDialog({
  userId,
  bookId,
  bookTitle,
  onSuccess,
  trigger
}: ManualSessionDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ManualSessionFormValues>({
    resolver: zodResolver(manualSessionSchema),
    defaultValues: {
      startDate: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endDate: format(new Date(), 'yyyy-MM-dd'),
      endTime: '10:00',
      startPage: '',
      endPage: '',
      pagesRead: '',
      sessionNotes: '',
      summary: '',
    },
  })

  // Auto-calculate pages read when start and end page change
  const watchStartPage = form.watch('startPage')
  const watchEndPage = form.watch('endPage')

  const calculatePagesRead = () => {
    if (watchStartPage && watchEndPage) {
      const start = parseInt(watchStartPage)
      const end = parseInt(watchEndPage)
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        form.setValue('pagesRead', (end - start).toString())
      }
    }
  }

  const onSubmit = async (data: ManualSessionFormValues) => {
    setIsLoading(true)

    const startDateTime = new Date(`${data.startDate}T${data.startTime}`)
    const endDateTime = new Date(`${data.endDate}T${data.endTime}`)

    const { error } = await createManualSession(userId, {
      book_id: bookId,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      start_page: data.startPage ? parseInt(data.startPage) : undefined,
      end_page: data.endPage ? parseInt(data.endPage) : undefined,
      pages_read: data.pagesRead ? parseInt(data.pagesRead) : undefined,
      session_notes: data.sessionNotes || undefined,
      summary: data.summary || undefined,
    })

    if (error) {
      toast.error('Failed to add session')
      setIsLoading(false)
      return
    }

    const duration = Math.floor((endDateTime.getTime() - startDateTime.getTime()) / 60000)
    toast.success(`Session added! ${duration} minutes recorded`)
    form.reset()
    setOpen(false)
    setIsLoading(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Add Manual Session
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Manual Reading Session</DialogTitle>
          <DialogDescription>
            Record a past reading session. {bookTitle && `For: ${bookTitle}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date & Time */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date & Time */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Page Numbers */}
              <FormField
                control={form.control}
                name="startPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Page</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Optional"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setTimeout(calculatePagesRead, 100)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Page</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Optional"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setTimeout(calculatePagesRead, 100)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pagesRead"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pages Read</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Auto-calculated"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Auto-fills
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Session Notes */}
            <FormField
              control={form.control}
              name="sessionNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you read about?"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of this session"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Session'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
