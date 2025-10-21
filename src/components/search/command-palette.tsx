'use client'

import { useEffect, useState, useCallback } from 'react'
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
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Book,
  StickyNote,
  Clock,
  Home,
  Library,
  Settings,
  TrendingUp,
} from 'lucide-react'
import { globalSearch, SearchResult, saveRecentSearch, getRecentSearches } from '@/lib/api/search'
import { toast } from 'sonner'

interface CommandPaletteProps {
  userId: string
}

export function CommandPalette({ userId }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Keyboard shortcut: Cmd+K or Ctrl+K
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

  // Search when query changes
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true)
      try {
        const { data, error } = await globalSearch(userId, query)

        if (error) {
          throw new Error(error.message)
        }

        setResults(data || [])
      } catch (error: any) {
        toast.error('Search failed')
        console.error(error)
      } finally {
        setIsSearching(false)
      }
    }, 300) // Debounce 300ms

    return () => clearTimeout(searchTimeout)
  }, [query, userId])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      saveRecentSearch(query)
      setRecentSearches(getRecentSearches())
      setOpen(false)
      setQuery('')
      router.push(result.url)
    },
    [query, router]
  )

  const handleRecentSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
  }, [])

  const quickActions = [
    {
      icon: Home,
      label: 'Dashboard',
      url: '/dashboard',
    },
    {
      icon: Library,
      label: 'Books',
      url: '/books',
    },
    {
      icon: StickyNote,
      label: 'Notes',
      url: '/notes',
    },
    {
      icon: Clock,
      label: 'Reading Sessions',
      url: '/reading',
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      url: '/analytics',
    },
    {
      icon: Settings,
      label: 'Settings',
      url: '/settings',
    },
  ]

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search books, notes, or navigate..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!query && (
            <>
              {/* Quick Actions */}
              <CommandGroup heading="Quick Actions">
                {quickActions.map((action) => (
                  <CommandItem
                    key={action.url}
                    onSelect={() => {
                      setOpen(false)
                      router.push(action.url)
                    }}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    <span>{action.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Recent Searches">
                    {recentSearches.map((search, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => handleRecentSearch(search)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{search}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </>
          )}

          {query && (
            <>
              {isSearching ? (
                <CommandEmpty>Searching...</CommandEmpty>
              ) : results.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                <>
                  {/* Books */}
                  {results.filter((r) => r.type === 'book').length > 0 && (
                    <CommandGroup heading="Books">
                      {results
                        .filter((r) => r.type === 'book')
                        .map((result) => (
                          <CommandItem
                            key={result.id}
                            onSelect={() => handleSelect(result)}
                          >
                            <Book className="mr-2 h-4 w-4" />
                            <div className="flex flex-1 flex-col gap-1">
                              <span className="font-medium">{result.title}</span>
                              {result.subtitle && (
                                <span className="text-xs text-muted-foreground">
                                  {result.subtitle}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}

                  {/* Notes */}
                  {results.filter((r) => r.type === 'note').length > 0 && (
                    <>
                      {results.filter((r) => r.type === 'book').length > 0 && (
                        <CommandSeparator />
                      )}
                      <CommandGroup heading="Notes">
                        {results
                          .filter((r) => r.type === 'note')
                          .map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => handleSelect(result)}
                            >
                              <span className="mr-2">{result.icon}</span>
                              <div className="flex flex-1 flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{result.title}</span>
                                  {result.metadata?.noteType && (
                                    <Badge variant="outline" className="text-xs">
                                      {result.metadata.noteType}
                                    </Badge>
                                  )}
                                </div>
                                {result.subtitle && (
                                  <span className="text-xs text-muted-foreground">
                                    From: {result.subtitle}
                                  </span>
                                )}
                                {result.content && (
                                  <span className="line-clamp-1 text-xs text-muted-foreground">
                                    {result.content}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
