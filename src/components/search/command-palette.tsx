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
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandPalette({ userId, open: externalOpen, onOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
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
        if (!userId) {
          console.error('Search error: No user ID')
          setResults([])
          return
        }

        console.log('Searching for:', query, 'userId:', userId)
        const { data, error } = await globalSearch(userId, query)

        if (error) {
          console.error('Search error:', error)
          throw new Error(error.message || 'Search failed')
        }

        console.log('Search results:', data)
        setResults(data || [])
      } catch (error: any) {
        console.error('Search exception:', error)
        toast.error(error.message || 'Search failed')
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
      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search books, notes, or navigate..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList shouldFilter={false}>
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
                            value={result.title}
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
                              value={result.title}
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
