'use client'

import { useState } from 'react'
import { Plus, BookPlus, Clock, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function QuickActionsFAB() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: BookPlus,
      label: 'Add Book',
      href: '/books',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Clock,
      label: 'Start Session',
      href: '/reading',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: FileText,
      label: 'New Note',
      href: '/notes',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={cn(
        "flex flex-col-reverse gap-3 mb-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <Link key={action.label} href={action.href} onClick={() => setIsOpen(false)}>
            <Button
              className={cn(
                "h-12 shadow-lg text-white gap-2 transition-all duration-200",
                action.color,
                "animate-in fade-in slide-in-from-bottom-2"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards'
              }}
            >
              <action.icon className="h-5 w-5" />
              <span className="font-medium">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Main FAB Button */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-45"
            : "bg-primary hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </div>
  )
}
