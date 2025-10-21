'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Home,
  Clock,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Library,
  Plus,
  Search,
  ChevronsLeft,
  ChevronsRight,
  Command,
  ListTodo,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and stats',
    countKey: null
  },
  {
    title: 'My Library',
    href: '/books',
    icon: Library,
    description: 'All your books',
    countKey: 'books'
  },
  {
    title: 'Reading Sessions',
    href: '/reading',
    icon: Clock,
    description: 'Track your reading time',
    countKey: 'reading'
  },
  {
    title: 'Notes',
    href: '/notes',
    icon: FileText,
    description: 'Your insights and highlights',
    countKey: 'notes'
  },
  {
    title: 'Action Items',
    href: '/action-items',
    icon: ListTodo,
    description: 'Actionable tasks from books',
    countKey: 'actionItems'
  },
  {
    title: 'Life Applications',
    href: '/life-applications',
    icon: Lightbulb,
    description: 'Applied concepts in real life',
    countKey: 'lifeApplications'
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Reading statistics',
    countKey: null
  }
]

interface SidebarNavProps {
  onSearchClick?: () => void
  onShortcutsClick?: () => void
}

export function SidebarNav({ onSearchClick, onShortcutsClick }: SidebarNavProps = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)
  const [counts, setCounts] = useState({
    books: 0,
    reading: 0,
    notes: 0,
    actionItems: 0,
    lifeApplications: 0,
  })

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
    // Dispatch custom event for layout to listen
    window.dispatchEvent(new Event('sidebar-toggle'))
  }

  // Fetch counts for nav items
  useEffect(() => {
    async function fetchCounts() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [booksResult, notesResult, actionItemsResult, lifeApplicationsResult] = await Promise.all([
        supabase
          .from('books')
          .select('id, status', { count: 'exact', head: false })
          .eq('user_id', user.id),
        supabase
          .from('notes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_archived', false),
        supabase
          .from('notes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('note_type', 'action')
          .eq('is_archived', false),
        supabase
          .from('life_applications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ])

      const readingCount = booksResult.data?.filter(b => b.status === 'reading').length || 0

      setCounts({
        books: booksResult.data?.length || 0,
        reading: readingCount,
        notes: notesResult.count || 0,
        actionItems: actionItemsResult.count || 0,
        lifeApplications: lifeApplicationsResult.count || 0,
      })
    }

    fetchCounts()

    // Listen for action items and life applications updates
    const handleActionItemsUpdate = () => {
      fetchCounts()
    }
    const handleLifeApplicationsUpdate = () => {
      fetchCounts()
    }
    window.addEventListener('action-items-updated', handleActionItemsUpdate)
    window.addEventListener('life-applications-updated', handleLifeApplicationsUpdate)

    return () => {
      window.removeEventListener('action-items-updated', handleActionItemsUpdate)
      window.removeEventListener('life-applications-updated', handleLifeApplicationsUpdate)
    }
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error signing out')
      return
    }
    toast.success('Signed out successfully')
    router.push('/login')
  }

  return (
    <div className={cn(
      "flex h-full flex-col gap-4 py-6 transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo/Brand */}
      <div className="px-6">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg group-hover:text-primary transition-colors">
                BookFlow
              </h1>
              <p className="text-xs text-muted-foreground">Reading companion</p>
            </div>
          )}
        </Link>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div className="px-4 space-y-2">
        <Link href="/books">
          <Button className={cn("w-full gap-2", collapsed && "px-2")} size="sm">
            <Plus className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Add Book</span>}
          </Button>
        </Link>
        <Button
          variant="outline"
          className={cn("w-full gap-2", collapsed && "px-2")}
          size="sm"
          onClick={() => {
            // Trigger command palette (Cmd+K)
            if (onSearchClick) {
              onSearchClick()
            } else {
              // Dispatch keyboard event to trigger command palette
              document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                ctrlKey: true,
              }))
            }
          }}
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Search</span>}
        </Button>
      </div>

      <Separator />

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const count = item.countKey ? counts[item.countKey as keyof typeof counts] : null

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <div className="flex-1">
                      <div>{item.title}</div>
                      {isActive && (
                        <div className="text-xs text-muted-foreground font-normal">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {count !== null && count > 0 && (
                      <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                        {count}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Collapse Toggle */}
      <div className="px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapsed}
          className={cn("w-full gap-2", collapsed && "px-2")}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span className="flex-1 text-left">Collapse</span>
            </>
          )}
        </Button>
      </div>

      <Separator />

      {/* Bottom Actions */}
      <div className="px-4 space-y-1">
        {/* Theme Toggle */}
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-medium text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <ThemeToggle />
          </div>
        )}

        {/* Keyboard Shortcuts */}
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-medium text-muted-foreground">Keyboard shortcuts</span>
            <Button
              variant="outline"
              size="icon"
              onClick={onShortcutsClick}
            >
              <Badge variant="outline" className="text-xs border-0">⌘ /</Badge>
            </Button>
          </div>
        )}
        {collapsed && (
          <button
            onClick={onShortcutsClick}
            className="w-full flex justify-center px-2 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground rounded-lg"
            title="Keyboard Shortcuts"
          >
            <Command className="h-4 w-4" />
          </button>
        )}
        <Link href="/settings">
          <div className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )
}
