'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ListTodo, Filter, LayoutGrid, List, BookOpen, CheckCircle2, Circle, Edit, Trash2, Search, SlidersHorizontal, ArrowUpDown, FileText, Grid2X2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ActionItemCard } from '@/components/action-items/action-item-card'
import { EditActionItemDialog } from '@/components/action-items/edit-action-item-dialog'
import { PriorityMatrixView } from '@/components/action-items/priority-matrix-view'
import { KeyboardShortcutsDialog } from '@/components/ui/keyboard-shortcuts-dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcuts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  getActionItems,
  getActionItemsByStatus,
  updateActionItem,
  deleteActionItem,
  getActionItemStats,
  type ActionItemWithBook,
  type ActionStatus,
} from '@/lib/api/action-items'
import { getBooks } from '@/lib/api/books'

type ViewMode = 'card' | 'list' | 'matrix'
type SortOption = 'due_date_asc' | 'due_date_desc' | 'priority_high' | 'priority_low' | 'alpha_asc' | 'alpha_desc' | 'created_desc' | 'created_asc'

export default function ActionItemsPage() {
  const [actionItems, setActionItems] = useState<ActionItemWithBook[]>([])
  const [books, setBooks] = useState<Array<{ id: string; title: string; author: string }>>([])
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'todo' | 'in_progress' | 'completed' | 'cancelled'>('todo')
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItemWithBook | null>(null)
  const [showBulkSelect, setShowBulkSelect] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBook, setSelectedBook] = useState<string>('all')
  const [dueDateFilter, setDueDateFilter] = useState<string>('all')
  const [sortOption, setSortOption] = useState<SortOption>('created_desc')

  // Get unique categories from action items
  const availableCategories = useMemo(() => {
    const categories = new Set<string>()
    actionItems.forEach(item => {
      if (item.category) categories.add(item.category)
    })
    return Array.from(categories).sort()
  }, [actionItems])

  // Bulk actions
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)

  // Keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      description: 'Switch to To Do tab',
      callback: () => setActiveTab('todo'),
    },
    {
      key: '2',
      description: 'Switch to In Progress tab',
      callback: () => setActiveTab('in_progress'),
    },
    {
      key: '3',
      description: 'Switch to Completed tab',
      callback: () => setActiveTab('completed'),
    },
    {
      key: '4',
      description: 'Switch to Cancelled tab',
      callback: () => setActiveTab('cancelled'),
    },
    {
      key: 'c',
      description: 'Switch to Card view',
      callback: () => setViewMode('card'),
    },
    {
      key: 'l',
      description: 'Switch to List view',
      callback: () => setViewMode('list'),
    },
    {
      key: 'm',
      description: 'Switch to Matrix view',
      callback: () => setViewMode('matrix'),
    },
    {
      key: 'f',
      description: 'Focus search',
      callback: () => {
        const searchInput = document.querySelector('input[placeholder="Search action items..."]') as HTMLInputElement
        searchInput?.focus()
      },
    },
    {
      key: 'r',
      description: 'Refresh action items',
      callback: () => {
        loadData()
        toast.success('Refreshed!')
      },
    },
  ]

  useKeyboardShortcuts(shortcuts)

  useEffect(() => {
    loadData()

    // Listen for action items updates
    const handleUpdate = () => loadData()
    window.addEventListener('action-items-updated', handleUpdate)

    return () => {
      window.removeEventListener('action-items-updated', handleUpdate)
    }
  }, [])

  async function loadData() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const [itemsData, booksData, statsData] = await Promise.all([
        getActionItems(user.id),
        getBooks(supabase, user.id),
        getActionItemStats(user.id),
      ])

      setActionItems(itemsData)
      setBooks(booksData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading action items:', error)
      toast.error('Failed to load action items')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: string, status: ActionStatus) {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await updateActionItem(user.id, id, { status })
      toast.success('Status updated')
      loadData()

      // Dispatch custom event to refresh sidebar counts
      window.dispatchEvent(new Event('action-items-updated'))
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this action item?')) return

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await deleteActionItem(user.id, id)
      toast.success('Action item deleted')
      loadData()

      // Dispatch custom event to refresh sidebar counts
      window.dispatchEvent(new Event('action-items-updated'))
    } catch (error) {
      console.error('Error deleting action item:', error)
      toast.error('Failed to delete action item')
    }
  }

  function handleEdit(actionItem: ActionItemWithBook) {
    setSelectedActionItem(actionItem)
    setEditDialogOpen(true)
  }

  function togglePriority(priority: string) {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  function toggleCategory(category: string) {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  function clearFilters() {
    setSearchQuery('')
    setSelectedPriorities([])
    setSelectedCategories([])
    setSelectedBook('all')
    setDueDateFilter('all')
  }

  function toggleSelectAll() {
    if (selectedItems.size === filteredAndSortedItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredAndSortedItems.map(item => item.id)))
    }
  }

  function toggleSelectItem(id: string) {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  async function handleBulkComplete() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await Promise.all(
        Array.from(selectedItems).map(id =>
          updateActionItem(user.id, id, { status: 'completed' })
        )
      )

      toast.success(`Completed ${selectedItems.size} action items`)
      setSelectedItems(new Set())
      loadData()
      window.dispatchEvent(new Event('action-items-updated'))
    } catch (error) {
      console.error('Error completing items:', error)
      toast.error('Failed to complete items')
    }
  }

  async function handleBulkDelete() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await Promise.all(
        Array.from(selectedItems).map(id => deleteActionItem(user.id, id))
      )

      toast.success(`Deleted ${selectedItems.size} action items`)
      setSelectedItems(new Set())
      setShowBulkDeleteDialog(false)
      loadData()
      window.dispatchEvent(new Event('action-items-updated'))
    } catch (error) {
      console.error('Error deleting items:', error)
      toast.error('Failed to delete items')
    }
  }

  async function handleBulkChangePriority(priority: ActionPriority) {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await Promise.all(
        Array.from(selectedItems).map(id =>
          updateActionItem(user.id, id, { priority })
        )
      )

      toast.success(`Updated priority for ${selectedItems.size} action items`)
      setSelectedItems(new Set())
      loadData()
      window.dispatchEvent(new Event('action-items-updated'))
    } catch (error) {
      console.error('Error updating priority:', error)
      toast.error('Failed to update priority')
    }
  }

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items: ActionItemWithBook[]

    if (activeTab === 'todo') {
      items = actionItems.filter((item) => item.status === 'todo')
    } else if (activeTab === 'in_progress') {
      items = actionItems.filter((item) => item.status === 'in_progress')
    } else if (activeTab === 'completed') {
      items = actionItems.filter((item) => item.status === 'completed')
    } else {
      items = actionItems.filter((item) => item.status === 'cancelled')
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.book.title.toLowerCase().includes(query)
      )
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      items = items.filter(item =>
        item.priority && selectedPriorities.includes(item.priority)
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      items = items.filter(item =>
        item.category && selectedCategories.includes(item.category)
      )
    }

    // Book filter
    if (selectedBook !== 'all') {
      items = items.filter(item => item.book_id === selectedBook)
    }

    // Due date filter
    if (dueDateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const weekFromNow = new Date(today)
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      const monthFromNow = new Date(today)
      monthFromNow.setMonth(monthFromNow.getMonth() + 1)

      items = items.filter(item => {
        if (!item.due_date) return false
        const dueDate = new Date(item.due_date)

        switch (dueDateFilter) {
          case 'overdue':
            return dueDate < today && item.status !== 'completed'
          case 'today':
            return dueDate >= today && dueDate < tomorrow
          case 'week':
            return dueDate >= today && dueDate < weekFromNow
          case 'month':
            return dueDate >= today && dueDate < monthFromNow
          default:
            return true
        }
      })
    }

    // Sort items
    items.sort((a, b) => {
      switch (sortOption) {
        case 'due_date_asc':
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        case 'due_date_desc':
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
        case 'priority_high':
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return (priorityOrder[a.priority || 'low'] || 3) - (priorityOrder[b.priority || 'low'] || 3)
        case 'priority_low':
          const priorityOrderLow = { low: 0, medium: 1, high: 2 }
          return (priorityOrderLow[a.priority || 'low'] || 3) - (priorityOrderLow[b.priority || 'low'] || 3)
        case 'alpha_asc':
          return a.title.localeCompare(b.title)
        case 'alpha_desc':
          return b.title.localeCompare(a.title)
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        default:
          return 0
      }
    })

    return items
  }, [actionItems, activeTab, searchQuery, selectedPriorities, selectedCategories, selectedBook, dueDateFilter, sortOption])

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedPriorities.length +
    selectedCategories.length +
    (selectedBook !== 'all' ? 1 : 0) +
    (dueDateFilter !== 'all' ? 1 : 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading action items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <ListTodo className="h-6 w-6 sm:h-8 sm:w-8" />
            Action Items
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage action-type notes as tasks
          </p>
        </div>
        <KeyboardShortcutsDialog shortcuts={shortcuts} title="Action Items Shortcuts" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Priority</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.highPriority}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search action items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Priority</h4>
                  <div className="flex gap-2">
                    {(['high', 'medium', 'low'] as const).map((priority) => (
                      <Button
                        key={priority}
                        size="sm"
                        variant={selectedPriorities.includes(priority) ? 'default' : 'outline'}
                        onClick={() => togglePriority(priority)}
                        className="capitalize"
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Category</h4>
                  {availableCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map((category) => (
                        <Button
                          key={category}
                          size="sm"
                          variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                          onClick={() => toggleCategory(category)}
                          className="capitalize"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No categories yet</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Book</h4>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
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

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Due Date</h4>
                  <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All dates</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="today">Due today</SelectItem>
                      <SelectItem value="week">Due this week</SelectItem>
                      <SelectItem value="month">Due this month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {activeFilterCount > 0 && (
                  <>
                    <Separator />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear all filters
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort */}
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Newest first</SelectItem>
              <SelectItem value="created_asc">Oldest first</SelectItem>
              <SelectItem value="due_date_asc">Due date (earliest)</SelectItem>
              <SelectItem value="due_date_desc">Due date (latest)</SelectItem>
              <SelectItem value="priority_high">Priority (high to low)</SelectItem>
              <SelectItem value="priority_low">Priority (low to high)</SelectItem>
              <SelectItem value="alpha_asc">A to Z</SelectItem>
              <SelectItem value="alpha_desc">Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions Toolbar */}
        {showBulkSelect && selectedItems.size > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedItems.size === filteredAndSortedItems.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedItems.size} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {activeTab === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBulkComplete}
                      className="gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </Button>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Set Priority
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40" align="end">
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleBulkChangePriority('high')}
                        >
                          High Priority
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleBulkChangePriority('medium')}
                        >
                          Medium Priority
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleBulkChangePriority('low')}
                        >
                          Low Priority
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setShowBulkDeleteDialog(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Items List */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabsList className="w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="todo" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">To Do</span>
              <span className="sm:hidden">Todo</span>
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {actionItems.filter(i => i.status === 'todo').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">In Progress</span>
              <span className="sm:hidden">Active</span>
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {actionItems.filter(i => i.status === 'in_progress').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              Done
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {actionItems.filter(i => i.status === 'completed').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Cancelled</span>
              <span className="sm:hidden">Cancel</span>
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {actionItems.filter(i => i.status === 'cancelled').length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant={showBulkSelect ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowBulkSelect(!showBulkSelect)
                if (showBulkSelect) setSelectedItems(new Set())
              }}
              className="hidden sm:flex"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {showBulkSelect ? 'Cancel Selection' : 'Select Multiple'}
            </Button>

            {/* Mobile: Icon only */}
            <Button
              variant={showBulkSelect ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowBulkSelect(!showBulkSelect)
                if (showBulkSelect) setSelectedItems(new Set())
              }}
              className="sm:hidden"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>

            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
              <ToggleGroupItem value="card" aria-label="Card view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="matrix" aria-label="Matrix view" className="hidden sm:flex">
                <Grid2X2 className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {filteredAndSortedItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                <div className="rounded-full bg-primary/10 p-6 mb-6">
                  <ListTodo className="h-16 w-16 text-primary" />
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  {activeFilterCount > 0 || searchQuery ? 'No action items found' : 'No action items yet'}
                </h3>

                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  {activeFilterCount > 0 || searchQuery
                    ? 'Try adjusting your filters or search terms'
                    : 'Create action-type notes while reading to track tasks and actionable insights from your books'
                  }
                </p>

                {!activeFilterCount && !searchQuery && (
                  <>
                    {/* How it works */}
                    <div className="w-full max-w-2xl mb-8 bg-muted/50 rounded-lg p-6">
                      <h4 className="font-semibold mb-4 text-center">📚 How to create action items:</h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                          <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                            <span className="font-bold text-primary">1</span>
                          </div>
                          <p className="text-sm">Open a book detail page</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                            <span className="font-bold text-primary">2</span>
                          </div>
                          <p className="text-sm">Take notes while reading</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                            <span className="font-bold text-primary">3</span>
                          </div>
                          <p className="text-sm">Select "Action" as note type</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick action */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild size="lg">
                        <a href="/books">
                          <BookOpen className="h-5 w-5 mr-2" />
                          Browse Books
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <a href="/notes">
                          <FileText className="h-5 w-5 mr-2" />
                          View Notes
                        </a>
                      </Button>
                    </div>

                    {/* Examples */}
                    <div className="mt-8 w-full max-w-2xl">
                      <h4 className="font-semibold mb-3 text-sm text-muted-foreground text-center">
                        ✨ Example action items:
                      </h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-md">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                          <div>
                            <p className="font-medium">Practice the 2-minute rule</p>
                            <p className="text-xs text-muted-foreground">From: Atomic Habits</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-md">
                          <Circle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Implement deep work blocks in my schedule</p>
                            <p className="text-xs text-muted-foreground">From: Deep Work</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-md">
                          <Circle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Start weekly review sessions</p>
                            <p className="text-xs text-muted-foreground">From: Getting Things Done</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {(activeFilterCount > 0 || searchQuery) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Clear all filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : viewMode === 'matrix' ? (
            <PriorityMatrixView actionItems={actionItems} />
          ) : viewMode === 'card' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedItems.map((item) => (
                <div key={item.id} className="relative">
                  {showBulkSelect && (
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                      className="absolute top-3 left-3 z-10 bg-background"
                    />
                  )}
                  <ActionItemCard
                    actionItem={item}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAndSortedItems.map((item) => (
                <Card key={item.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {showBulkSelect && (
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          {item.priority && (
                            <Badge className={
                              item.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }>
                              {item.priority === 'high' ? 'High' : item.priority === 'medium' ? 'Medium' : 'Low'}
                            </Badge>
                          )}
                          {item.due_date && (
                            <Badge variant={new Date(item.due_date) < new Date() && item.status !== 'completed' ? 'destructive' : 'outline'}>
                              Due: {format(new Date(item.due_date), 'MMM d')}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <BookOpen className="h-3 w-3" />
                          <span className="truncate">{item.book.title}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === 'completed' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(item.id, 'todo')}
                            title="Reactivate"
                          >
                            <Circle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(item.id, 'completed')}
                            title="Mark as complete"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <EditActionItemDialog
        actionItem={selectedActionItem}
        books={books}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onActionItemUpdated={() => {
          loadData()
          window.dispatchEvent(new Event('action-items-updated'))
        }}
      />

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedItems.size} action items?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected action items and their associated notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
