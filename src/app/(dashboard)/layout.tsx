'use client'

import { useState, useEffect } from 'react'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { MobileNav } from '@/components/layout/mobile-nav'
import { KeyboardShortcuts } from '@/components/layout/keyboard-shortcuts'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

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
        <SidebarNav onShortcutsClick={() => setShortcutsOpen(true)} />
      </aside>

      {/* Mobile Header */}
      <MobileNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  )
}
