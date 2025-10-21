'use client'

import { useState, useEffect } from 'react'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { MobileNav } from '@/components/layout/mobile-nav'
import { KeyboardShortcuts } from '@/components/layout/keyboard-shortcuts'
import { CommandPalette } from '@/components/search/command-palette'
import { createClient } from '@/lib/supabase/client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userId, setUserId] = useState<string>('')

  // Get user ID
  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  // Sync with sidebar collapse state from localStorage
  useEffect(() => {
    const updateSidebarState = () => {
      const saved = localStorage.getItem('sidebar-collapsed')
      setSidebarCollapsed(saved === 'true')
    }

    updateSidebarState()

    // Listen for storage changes
    window.addEventListener('storage', updateSidebarState)

    // Custom event for same-tab changes
    const handleSidebarToggle = () => updateSidebarState()
    window.addEventListener('sidebar-toggle', handleSidebarToggle)

    return () => {
      window.removeEventListener('storage', updateSidebarState)
      window.removeEventListener('sidebar-toggle', handleSidebarToggle)
    }
  }, [])

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex border-r bg-background transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <SidebarNav
          onShortcutsClick={() => setShortcutsOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
      </aside>

      {/* Mobile Header */}
      <MobileNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>

      {/* Command Palette */}
      {userId && <CommandPalette userId={userId} open={searchOpen} onOpenChange={setSearchOpen} />}

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  )
}
