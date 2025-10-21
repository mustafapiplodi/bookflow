'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StickyNote, Plus, Pin, Calendar, Clock, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NotesList } from '@/components/notes/notes-list'
import { AddNoteDialog } from '@/components/notes/add-note-dialog'
import { CommandPalette } from '@/components/search/command-palette'

export default function NotesPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [notes, setNotes] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNoteType, setSelectedNoteType] = useState('all')
  const [selectedBook, setSelectedBook] = useState('all')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchNotes()
      fetchBooks()
    }
  }, [userId])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserId(user.id)
    setIsLoading(false)
  }

  const fetchNotes = async () => {
    if (!userId) return

    const { data, error } = await supabase
      .from('notes')
      .select('*, books(title, author)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setNotes(data)
    }
  }

  const fetchBooks = async () => {
    if (!userId) return

    const { data, error } = await supabase
      .from('books')
      .select('id, title, author')
      .eq('user_id', userId)
      .order('title', { ascending: true })

    if (!error && data) {
      setBooks(data)
    }
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    fetchNotes()
  }

  // Calculate stats
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const totalNotes = notes.length
  const pinnedNotes = notes.filter(n => n.is_pinned).length
  const thisWeekNotes = notes.filter(n => new Date(n.created_at) >= weekStart).length
  const thisMonthNotes = notes.filter(n => new Date(n.created_at) >= monthStart).length

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <StickyNote className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Notes</h1>
            <p className="text-muted-foreground text-sm">
              {totalNotes} {totalNotes === 1 ? 'note' : 'notes'} in your collection
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AddNoteDialog
              userId={userId}
              bookId=""
              books={books}
              onSuccess={handleRefresh}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Note
                </Button>
              }
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Notes</p>
                  <p className="text-2xl font-bold">{totalNotes}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pinned Notes</p>
                  <p className="text-2xl font-bold">{pinnedNotes}</p>
                </div>
                <Pin className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">This Week</p>
                  <p className="text-2xl font-bold">{thisWeekNotes}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">This Month</p>
                  <p className="text-2xl font-bold">{thisMonthNotes}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search notes by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedNoteType} onValueChange={setSelectedNoteType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="idea">💡 Idea</SelectItem>
                <SelectItem value="argument">⚖️ Argument</SelectItem>
                <SelectItem value="action">✅ Action</SelectItem>
                <SelectItem value="quote">💬 Quote</SelectItem>
                <SelectItem value="question">❓ Question</SelectItem>
                <SelectItem value="connection">🔗 Connection</SelectItem>
                <SelectItem value="disagreement">❌ Disagreement</SelectItem>
                <SelectItem value="insight">✨ Insight</SelectItem>
                <SelectItem value="data">📊 Data</SelectItem>
                <SelectItem value="example">📝 Example</SelectItem>
                <SelectItem value="reflection">🤔 Reflection</SelectItem>
                <SelectItem value="definition">📖 Definition</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All books" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All books</SelectItem>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <NotesList
        key={refreshKey}
        userId={userId}
        showBookInfo={true}
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        noteType={selectedNoteType === 'all' ? undefined : selectedNoteType}
        bookId={selectedBook === 'all' ? undefined : selectedBook}
      />
    </div>
  )
}
