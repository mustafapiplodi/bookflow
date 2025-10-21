'use client'

import { useEffect, useState } from 'react'
import { Library, Plus, BookMarked, BookOpen, BookCheck, Pause, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getShelves } from '@/lib/api/shelves'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AddShelfDialog } from './add-shelf-dialog'
import { Database } from '@/types/database'
import { toast } from 'sonner'

type Shelf = Database['public']['Tables']['shelves']['Row']

interface ShelvesSidebarProps {
  userId: string
  selectedShelfId?: string
  onShelfSelect?: (shelfId: string | null) => void
}

const defaultShelfIcons: Record<string, any> = {
  'Want to Read': BookMarked,
  'Reading': BookOpen,
  'Completed': BookCheck,
  'Paused': Pause,
  'Abandoned': X,
  'All Books': Library,
}

export function ShelvesSidebar({ userId, selectedShelfId, onShelfSelect }: ShelvesSidebarProps) {
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchShelves()
  }, [userId])

  const fetchShelves = async () => {
    setIsLoading(true)
    try {
      const data = await getShelves(supabase, userId)
      setShelves(data)
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch shelves')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const defaultShelves = shelves.filter(s => s.is_default)
  const customShelves = shelves.filter(s => !s.is_default)

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Library className="h-5 w-5" />
            <h2 className="font-semibold">Shelves</h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* All Books */}
        <Button
          variant={!selectedShelfId ? 'secondary' : 'ghost'}
          className="w-full justify-start mb-2"
          onClick={() => onShelfSelect?.(null)}
        >
          <Library className="mr-2 h-4 w-4" />
          All Books
          <Badge variant="secondary" className="ml-auto">
            {shelves.reduce((sum, s) => sum + (s.book_count || 0), 0)}
          </Badge>
        </Button>
      </div>

      <Separator />

      {/* Default Shelves */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
          Default Shelves
        </div>
        {defaultShelves.map((shelf) => {
          const Icon = defaultShelfIcons[shelf.name] || BookMarked
          return (
            <Button
              key={shelf.id}
              variant={selectedShelfId === shelf.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onShelfSelect?.(shelf.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {shelf.name}
              {shelf.book_count !== undefined && shelf.book_count > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {shelf.book_count}
                </Badge>
              )}
            </Button>
          )
        })}

        {/* Custom Shelves */}
        {customShelves.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
              Custom Shelves
            </div>
            {customShelves.map((shelf) => (
              <Button
                key={shelf.id}
                variant={selectedShelfId === shelf.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onShelfSelect?.(shelf.id)}
              >
                <BookMarked className="mr-2 h-4 w-4" />
                {shelf.name}
                {shelf.book_count !== undefined && shelf.book_count > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {shelf.book_count}
                  </Badge>
                )}
              </Button>
            ))}
          </>
        )}
      </div>

      {/* Add Shelf Dialog */}
      <AddShelfDialog
        userId={userId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onShelfAdded={fetchShelves}
      />
    </div>
  )
}
