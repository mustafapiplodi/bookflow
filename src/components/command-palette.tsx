'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { BookOpen, FileText, CheckSquare, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SearchResult {
  type: 'book' | 'note' | 'action'
  id: string
  title: string
  subtitle?: string
  bookId?: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    async function performSearch() {
      if (!search || search.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const searchResults: SearchResult[] = []

      // Search books
      const { data: books } = await supabase
        .from('books')
        .select('id, title, author')
        .eq('user_id', user.id)
        .ilike('title', `%${search}%`)
        .limit(5)

      books?.forEach((book) => {
        searchResults.push({
          type: 'book',
          id: book.id,
          title: book.title,
          subtitle: book.author,
        })
      })

      // Search notes
      const { data: notes } = await supabase
        .from('notes')
        .select('id, content, book_id, books(title)')
        .eq('user_id', user.id)
        .ilike('content', `%${search}%`)
        .limit(5)

      notes?.forEach((note: any) => {
        searchResults.push({
          type: 'note',
          id: note.id,
          title: note.content.substring(0, 60) + (note.content.length > 60 ? '...' : ''),
          subtitle: note.books?.title,
          bookId: note.book_id,
        })
      })

      // Search actions
      const { data: actions } = await supabase
        .from('actions')
        .select('id, note_id, notes(content, book_id, books(title))')
        .eq('user_id', user.id)
        .limit(5)

      actions?.forEach((action: any) => {
        if (action.notes?.content.toLowerCase().includes(search.toLowerCase())) {
          searchResults.push({
            type: 'action',
            id: action.id,
            title: action.notes.content.substring(0, 60) + (action.notes.content.length > 60 ? '...' : ''),
            subtitle: action.notes.books?.title,
            bookId: action.notes.book_id,
          })
        }
      })

      setResults(searchResults)
      setLoading(false)
    }

    const debounce = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(debounce)
  }, [search])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setSearch('')

    if (result.type === 'book') {
      router.push(`/library/${result.id}`)
    } else if (result.type === 'note' && result.bookId) {
      router.push(`/library/${result.bookId}?tab=notes`)
    } else if (result.type === 'action') {
      router.push(`/actions`)
    }
  }

  const bookResults = results.filter((r) => r.type === 'book')
  const noteResults = results.filter((r) => r.type === 'note')
  const actionResults = results.filter((r) => r.type === 'action')

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search books, notes, actions..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {loading ? (
          <CommandEmpty>Searching...</CommandEmpty>
        ) : search.length < 2 ? (
          <CommandEmpty>Type to search...</CommandEmpty>
        ) : results.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          <>
            {bookResults.length > 0 && (
              <CommandGroup heading="Books">
                {bookResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="cursor-pointer"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-slate-500">{result.subtitle}</p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {noteResults.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Notes">
                  {noteResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-sm">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-slate-500">from {result.subtitle}</p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {actionResults.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                  {actionResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer"
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-sm">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-slate-500">from {result.subtitle}</p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
