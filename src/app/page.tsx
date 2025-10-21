'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Brain, Target, TrendingUp, Zap, BookMarked, Calendar, Users, Shield, Sparkles, Menu, Clock, FileText, ListTodo, Lightbulb, Link2, BarChart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">BookFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="#features">
              <Button variant="ghost">Features</Button>
            </Link>
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    BookFlow
                  </SheetTitle>
                  <SheetDescription>
                    Your Personal Reading Companion
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  <Link href="#features" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Features
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Separator />
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            Your Personal Reading Companion
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
            Transform How You
            <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Read & Remember
            </span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground lg:text-2xl">
            Track your reading journey, capture insights, and build a personal knowledge base
            that grows with every book you read.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Reading Free
                <BookOpen className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · Free forever plan available
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Note Categories</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">15+</div>
              <div className="text-sm text-muted-foreground">Core Features</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">∞</div>
              <div className="text-sm text-muted-foreground">Unlimited Books</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Privacy First</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <Badge className="mb-4" variant="outline">Features</Badge>
          <h2 className="mb-4 text-4xl font-bold">Everything You Need to Read Better</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A complete suite of tools designed to enhance your reading experience and help you retain what matters.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookMarked className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Smart Book Management</CardTitle>
              <CardDescription>
                Organize your library with multiple views and custom shelves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Want to Read, Reading, Completed, Paused shelves</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Custom shelf creation and organization</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Grid and list view with pagination</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Cover upload and metadata tracking</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="mb-2 h-10 w-10 text-blue-500" />
              <CardTitle>Reading Session Tracking</CardTitle>
              <CardDescription>
                Track your reading time with live session timer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Real-time reading timer with pause/resume</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Manual session entry for past readings</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Page progress auto-tracking</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Session history with notes</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="mb-2 h-10 w-10 text-purple-500" />
              <CardTitle>Inline Note-Taking</CardTitle>
              <CardDescription>
                Capture insights with 12 categories while you read
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Rich text editor (Tiptap) with formatting</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Inline note creation during sessions</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>12 types: Ideas, Quotes, Questions, Insights & more</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Pin, archive, tag, and prioritize notes</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ListTodo className="mb-2 h-10 w-10 text-green-500" />
              <CardTitle>Action Items & Tasks</CardTitle>
              <CardDescription>
                Turn insights into actionable tasks with subtasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Create tasks from book insights</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Priority levels, due dates, categories</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Subtasks with progress tracking</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Recurring actions and bulk operations</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Lightbulb className="mb-2 h-10 w-10 text-amber-500" />
              <CardTitle>Life Applications</CardTitle>
              <CardDescription>
                Track real-world application of book concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Log concepts applied in real life</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Rate effectiveness (1-5 stars)</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Track situation, outcome, and impact</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Search and filter applications</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Link2 className="mb-2 h-10 w-10 text-indigo-500" />
              <CardTitle>Book Relationships</CardTitle>
              <CardDescription>
                Connect books and build your knowledge graph
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>4 relationship types: Similar, Contradicts, Builds On, References</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Relationship strength ratings</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Smart suggestions based on genre/author</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Visual relationship display</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart className="mb-2 h-10 w-10 text-orange-500" />
              <CardTitle>Reading Analytics</CardTitle>
              <CardDescription>
                Visualize your reading journey with charts and stats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Monthly reading trends (12-month charts)</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Reading streaks and consistency tracking</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Genre distribution pie charts</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Export reports (JSON, CSV, Markdown)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Search className="mb-2 h-10 w-10 text-cyan-500" />
              <CardTitle>Advanced Search & Filters</CardTitle>
              <CardDescription>
                Find anything instantly with powerful search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Global search with Cmd+K palette</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Search across books and notes</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Advanced filters (status, rating, genre)</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Multiple sort options</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="mb-2 h-10 w-10 text-rose-500" />
              <CardTitle>Reading Timeline</CardTitle>
              <CardDescription>
                Visualize your journey through each book
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Visual timeline of reading sessions</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Session history with expandable notes</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Progress tracking over time</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Milestone tracking</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Knowledge Graph Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <Badge className="mb-4 w-fit" variant="outline">
              <Brain className="mr-1 h-3 w-3" />
              Knowledge Graph
            </Badge>
            <h2 className="mb-4 text-4xl font-bold">Connect Your Ideas</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Build a personal knowledge graph that links books, concepts, and ideas together.
              Discover patterns and connections you never knew existed.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <div className="font-semibold">Book Relationships</div>
                  <div className="text-sm text-muted-foreground">
                    Mark books as similar, contradictory, or building on each other
                  </div>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <div className="font-semibold">Concept Tracking</div>
                  <div className="text-sm text-muted-foreground">
                    Track how different books approach the same concepts
                  </div>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <div className="font-semibold">Visual Exploration</div>
                  <div className="text-sm text-muted-foreground">
                    Interactive graph view of your entire knowledge base
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Example Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950">
                    <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Atomic Habits</div>
                    <div className="text-sm text-muted-foreground">James Clear</div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Badge variant="secondary">builds on</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">The Power of Habit</div>
                    <div className="text-sm text-muted-foreground">Charles Duhigg</div>
                  </div>
                </div>
                <Separator />
                <div className="text-sm">
                  <div className="mb-1 font-semibold">Shared Concepts:</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Habit Formation</Badge>
                    <Badge variant="outline">Behavior Change</Badge>
                    <Badge variant="outline">Identity</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Why BookFlow Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Why Choose BookFlow?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Built for serious readers who want to get the most out of every book
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold">Privacy First</h3>
            <p className="text-muted-foreground">
              Your reading data is yours. End-to-end encryption, no tracking, no ads.
              Export your data anytime.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Optimized for speed with instant search, smooth animations, and offline support.
              Never wait to capture an insight.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold">Made for Readers</h3>
            <p className="text-muted-foreground">
              Designed by avid readers who understand what you need. Keyboard shortcuts,
              distraction-free mode, and more.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* App Preview Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            <Sparkles className="mr-1 h-3 w-3" />
            See It In Action
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Beautiful, Intuitive Interface</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with modern design principles. Works seamlessly in light and dark mode.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Dashboard Preview */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center p-8">
              <div className="text-center">
                <BarChart className="h-24 w-24 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Track your reading habits with beautiful charts and insights
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Comprehensive Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Monthly reading trends, genre distribution, reading streaks, and more—all visualized with interactive charts.
              </p>
            </CardContent>
          </Card>

          {/* Reading Session Preview */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 flex items-center justify-center p-8">
              <div className="text-center">
                <Clock className="h-24 w-24 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold mb-2">Reading Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Track time with a live timer and take notes inline
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Seamless Reading Flow</h3>
              <p className="text-sm text-muted-foreground">
                Start a session, track your pages, and capture notes without leaving the page. No interruptions.
              </p>
            </CardContent>
          </Card>

          {/* Notes Preview */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 flex items-center justify-center p-8">
              <div className="text-center">
                <FileText className="h-24 w-24 mx-auto mb-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xl font-bold mb-2">Rich Note-Taking</h3>
                <p className="text-sm text-muted-foreground">
                  12 note types with rich formatting and organization
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Capture Every Insight</h3>
              <p className="text-sm text-muted-foreground">
                From ideas to quotes, questions to reflections—organize your thoughts with powerful categorization.
              </p>
            </CardContent>
          </Card>

          {/* Book Relationships Preview */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center p-8">
              <div className="text-center">
                <Link2 className="h-24 w-24 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-bold mb-2">Knowledge Graph</h3>
                <p className="text-sm text-muted-foreground">
                  Connect books and discover patterns in your reading
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Build Connections</h3>
              <p className="text-sm text-muted-foreground">
                Link books that build on each other, contradict, or share concepts. Create your personal knowledge network.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              Start Your Reading Journey
            </Badge>
            <h2 className="mb-4 text-4xl font-bold">
              Ready to Transform Your Reading?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of readers who are building their personal knowledge base
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started for Free
                  <BookOpen className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · Free forever plan · Cancel anytime
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">BookFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your personal reading companion for building knowledge and retaining insights.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Get Started</Link></li>
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><a href="mailto:support@bookflow.app" className="hover:text-foreground transition-colors">Email Support</a></li>
                <li><Link href="https://github.com/bookflow/bookflow" target="_blank" className="hover:text-foreground transition-colors">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>© 2025 BookFlow. All rights reserved.</p>
            <div className="flex flex-col items-center gap-1">
              <p>
                Made with ❤️ by{' '}
                <a
                  href="https://www.linkedin.com/in/mustafa-piplodi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Mustafa Piplodi
                </a>
              </p>
              <p>
                <a
                  href="https://www.scalinghigh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Scaling High Technologies
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
