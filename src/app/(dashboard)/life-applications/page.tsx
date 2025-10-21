'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Lightbulb, TrendingUp, BookOpen, ThumbsUp, Search, Filter, X, LayoutGrid, List, Calendar, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AddLifeApplicationDialog } from '@/components/life-applications/add-life-application-dialog'
import { LifeApplicationCard } from '@/components/life-applications/life-application-card'
import { format } from 'date-fns'
import {
  getLifeApplications,
  getLifeApplicationStats,
  deleteLifeApplication,
  type LifeApplicationWithBook,
} from '@/lib/api/life-applications'
import { getBooks } from '@/lib/api/books'

export default function LifeApplicationsPage() {
  const [applications, setApplications] = useState<LifeApplicationWithBook[]>([])
  const [books, setBooks] = useState<Array<{ id: string; title: string; author: string }>>([])
  const [stats, setStats] = useState({
    total: 0,
    avgEffectiveness: 0,
    wouldUseAgainCount: 0,
    wouldUseAgainPercentage: 0,
    mostAppliedBook: null as { id: string; title: string; count: number } | null,
    totalBooks: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBook, setFilterBook] = useState<string>('all')
  const [filterEffectiveness, setFilterEffectiveness] = useState<string>('all')
  const [filterWouldUseAgain, setFilterWouldUseAgain] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const [applicationsData, booksData, statsData] = await Promise.all([
        getLifeApplications(user.id),
        getBooks(supabase, user.id),
        getLifeApplicationStats(user.id),
      ])

      setApplications(applicationsData)
      setBooks(booksData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading life applications:', error)
      toast.error('Failed to load life applications')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this life application?')) return

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await deleteLifeApplication(user.id, id)
      toast.success('Life application deleted')
      loadData()

      // Dispatch event for sidebar updates
      window.dispatchEvent(new Event('life-applications-updated'))
    } catch (error) {
      console.error('Error deleting life application:', error)
      toast.error('Failed to delete life application')
    }
  }

  function handleEdit(application: LifeApplicationWithBook) {
    // TODO: Implement edit dialog
    toast.info('Edit functionality coming soon')
  }

  // Filter and search applications
  const filteredApplications = applications.filter((app) => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      app.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.outcome && app.outcome.toLowerCase().includes(searchQuery.toLowerCase()))

    // Book filter
    const matchesBook = filterBook === 'all' || app.book_id === filterBook

    // Effectiveness filter
    const matchesEffectiveness = filterEffectiveness === 'all' ||
      (app.effectiveness_rating && app.effectiveness_rating.toString() === filterEffectiveness)

    // Would use again filter
    const matchesWouldUseAgain = filterWouldUseAgain === 'all' ||
      (filterWouldUseAgain === 'true' && app.would_use_again === true) ||
      (filterWouldUseAgain === 'false' && app.would_use_again === false)

    return matchesSearch && matchesBook && matchesEffectiveness && matchesWouldUseAgain
  })

  const hasActiveFilters = filterBook !== 'all' || filterEffectiveness !== 'all' || filterWouldUseAgain !== 'all'

  function clearFilters() {
    setFilterBook('all')
    setFilterEffectiveness('all')
    setFilterWouldUseAgain('all')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading life applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Lightbulb className="h-8 w-8" />
            Life Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Track how you apply concepts from your reading in real life
          </p>
        </div>
        <AddLifeApplicationDialog books={books} onApplicationCreated={loadData} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Applications</CardDescription>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Avg Effectiveness</CardDescription>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">
              {stats.avgEffectiveness > 0 ? `${stats.avgEffectiveness}/5` : 'N/A'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Would Use Again</CardDescription>
              <ThumbsUp className="h-4 w-4 text-orange-600" />
            </div>
            <CardTitle className="text-3xl text-orange-600">
              {stats.total > 0 ? `${stats.wouldUseAgainPercentage}%` : 'N/A'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Books Applied</CardDescription>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-3xl text-blue-600">{stats.totalBooks}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Most Applied Book */}
      {stats.mostAppliedBook && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Applied Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{stats.mostAppliedBook.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.mostAppliedBook.count} {stats.mostAppliedBook.count === 1 ? 'application' : 'applications'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      {applications.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search concepts, situations, or outcomes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={filterBook} onValueChange={setFilterBook}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Books" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books</SelectItem>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterEffectiveness} onValueChange={setFilterEffectiveness}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Effectiveness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 - Extremely</SelectItem>
                    <SelectItem value="4">4 - Very</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="2">2 - Slight</SelectItem>
                    <SelectItem value="1">1 - Not</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterWouldUseAgain} onValueChange={setFilterWouldUseAgain}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Would use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Would use again</SelectItem>
                    <SelectItem value="false">Wouldn't use again</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* View Toggle and Active Filters */}
            <div className="flex items-center justify-between">
              {hasActiveFilters ? (
                <div className="flex gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {filterBook !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {books.find(b => b.id === filterBook)?.title}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterBook('all')}
                      />
                    </Badge>
                  )}
                  {filterEffectiveness !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {filterEffectiveness} stars
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterEffectiveness('all')}
                      />
                    </Badge>
                  )}
                  {filterWouldUseAgain !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {filterWouldUseAgain === 'true' ? 'Would use again' : 'Wouldn\'t use again'}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterWouldUseAgain('all')}
                      />
                    </Badge>
                  )}
                </div>
              ) : (
                <div></div>
              )}

              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'card' | 'list')}>
                <ToggleGroupItem value="card" aria-label="Card view">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="flex gap-2 mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs text-muted-foreground">Concept</span>
              </div>
              <div className="flex items-center pt-6">
                <div className="w-8 h-0.5 bg-muted"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xs text-muted-foreground">Apply</span>
              </div>
              <div className="flex items-center pt-6">
                <div className="w-8 h-0.5 bg-muted"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-xs text-muted-foreground">Outcome</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">No life applications yet</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Bridge the gap between reading and doing. Log when you apply concepts in real life and track what actually works.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6 max-w-md">
              <p className="text-sm text-muted-foreground mb-2">
                <strong className="text-foreground">Example:</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                "Used the '5-second rule' from <em>Atomic Habits</em> to overcome procrastination when starting my morning workout routine"
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                <span>Track what works</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Learn from experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-orange-600" />
                <span>Build better habits</span>
              </div>
            </div>

            <AddLifeApplicationDialog books={books} onApplicationCreated={loadData} />
          </CardContent>
        </Card>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'card' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((application) => (
            <LifeApplicationCard
              key={application.id}
              application={application}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredApplications.map((application) => {
            const effectivenessColors = {
              1: 'text-red-600',
              2: 'text-orange-600',
              3: 'text-yellow-600',
              4: 'text-green-600',
              5: 'text-emerald-600',
            }
            const effectivenessColor = application.effectiveness_rating
              ? effectivenessColors[application.effectiveness_rating as keyof typeof effectivenessColors]
              : 'text-muted-foreground'

            return (
              <Card key={application.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{application.concept}</h3>
                        {application.effectiveness_rating && (
                          <Badge variant="outline" className="gap-1">
                            <Star className={`h-3 w-3 ${effectivenessColor}`} />
                            {application.effectiveness_rating}/5
                          </Badge>
                        )}
                        {application.would_use_again !== null && (
                          <Badge variant={application.would_use_again ? 'default' : 'secondary'} className="gap-1">
                            {application.would_use_again ? (
                              <>
                                <ThumbsUp className="h-3 w-3" />
                                Yes
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3" />
                                No
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {application.situation}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{application.book.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(application.date_applied), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(application)}
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(application.id)}
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
