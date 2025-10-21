'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Command } from 'lucide-react'

interface KeyboardShortcutsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+/ or Ctrl+/ - Toggle shortcuts dialog
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        onOpenChange(!open)
      }

      // Cmd+B - Go to Books
      if ((e.metaKey || e.ctrlKey) && e.key === 'b' && !open) {
        e.preventDefault()
        router.push('/books')
      }

      // Cmd+R - Go to Reading Sessions
      if ((e.metaKey || e.ctrlKey) && e.key === 'r' && !open) {
        e.preventDefault()
        router.push('/reading')
      }

      // Cmd+N - Go to Notes
      if ((e.metaKey || e.ctrlKey) && e.key === 'n' && !open) {
        e.preventDefault()
        router.push('/notes')
      }

      // Cmd+A - Go to Analytics
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && !open) {
        e.preventDefault()
        router.push('/analytics')
      }

      // Cmd+H - Go to Dashboard (Home)
      if ((e.metaKey || e.ctrlKey) && e.key === 'h' && !open) {
        e.preventDefault()
        router.push('/dashboard')
      }

      // Escape - Close dialog
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, router, onOpenChange])

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['⌘', 'H'], description: 'Go to Dashboard' },
        { keys: ['⌘', 'B'], description: 'Go to Books' },
        { keys: ['⌘', 'R'], description: 'Go to Reading Sessions' },
        { keys: ['⌘', 'N'], description: 'Go to Notes' },
        { keys: ['⌘', 'A'], description: 'Go to Analytics' },
      ],
    },
    {
      category: 'General',
      items: [
        { keys: ['⌘', 'K'], description: 'Open command menu' },
        { keys: ['⌘', '/'], description: 'Toggle shortcuts' },
        { keys: ['Esc'], description: 'Close dialogs' },
      ],
    },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Command className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Navigate faster with keyboard shortcuts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {shortcuts.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((shortcut, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <Badge key={keyIndex} variant="outline" className="text-xs font-mono">
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {index < shortcuts.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center pt-4">
            <p>Use Ctrl instead of ⌘ on Windows/Linux</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
