import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BooksGrid } from '@/components/books/books-grid'
import { AddBookDialog } from '@/components/books/add-book-dialog'
import { Skeleton } from '@/components/ui/skeleton'

function BooksGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export default function LibraryPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">My Library</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your reading collection</p>
        </div>
        <AddBookDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </AddBookDialog>
      </div>

      <Tabs defaultValue="reading" className="w-full">
        <TabsList>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="want_to_read">Want to Read</TabsTrigger>
          <TabsTrigger value="finished">Finished</TabsTrigger>
        </TabsList>

        <TabsContent value="reading" className="mt-6">
          <Suspense fallback={<BooksGridSkeleton />}>
            <BooksGrid status="reading" />
          </Suspense>
        </TabsContent>

        <TabsContent value="want_to_read" className="mt-6">
          <Suspense fallback={<BooksGridSkeleton />}>
            <BooksGrid status="want_to_read" />
          </Suspense>
        </TabsContent>

        <TabsContent value="finished" className="mt-6">
          <Suspense fallback={<BooksGridSkeleton />}>
            <BooksGrid status="finished" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
