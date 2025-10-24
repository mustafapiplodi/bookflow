'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ActionSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function ActionSearch({ onSearch, placeholder = 'Search actions...' }: ActionSearchProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
