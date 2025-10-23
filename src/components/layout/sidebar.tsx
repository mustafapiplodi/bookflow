'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, Library, Timer, FileText, CheckSquare, BarChart3, Lightbulb, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Sessions', href: '/sessions', icon: Timer },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Actions', href: '/actions', icon: CheckSquare },
  { name: 'Statistics', href: '/stats', icon: BarChart3 },
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
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/library" className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">BookFlow</span>
        </Link>
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
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-4 space-y-2">
        <div className="text-sm text-slate-600 truncate px-3">
          {user.email}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-700"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
