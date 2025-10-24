'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, Library, Timer, FileText, CheckSquare, BarChart3, Lightbulb, LogOut, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Actions', href: '/actions', icon: CheckSquare },
  { name: 'Statistics', href: '/statistics', icon: BarChart3 },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
]

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/library" className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold dark:text-white">BookFlow</span>
        </Link>
        <ThemeToggle />
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Search tip */}
      <div className="p-4">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Quick Search</p>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-600 rounded">⌘K</kbd> or <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-600 rounded">Ctrl+K</kbd> to search
          </p>
        </div>
      </div>

      <Separator />

      {/* User section */}
      <div className="p-4 space-y-2">
        <div className="text-sm text-slate-600 dark:text-slate-400 truncate px-3">
          {user.email}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
