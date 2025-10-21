'use client'

import { Keyboard } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { KeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcuts'
import { getShortcutDisplay } from '@/lib/hooks/use-keyboard-shortcuts'

interface KeyboardShortcutsDialogProps {
  shortcuts: KeyboardShortcut[]
  title?: string
}

export function KeyboardShortcutsDialog({ shortcuts, title = 'Keyboard Shortcuts' }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and perform actions quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index}>
              <div className="flex items-center justify-between gap-4 py-2">
                <span className="text-sm">{shortcut.description}</span>
                <Badge variant="secondary" className="font-mono">
                  {getShortcutDisplay(shortcut)}
                </Badge>
              </div>
              {index < shortcuts.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <Card className="bg-muted/50 mt-4">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p>
              💡 <strong>Tip:</strong> Press <Badge variant="outline" className="mx-1">?</Badge> at any time to see available shortcuts
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
