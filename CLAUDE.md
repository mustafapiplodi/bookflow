# 📚 BookFlow - Development Guide

> **A comprehensive book tracking and knowledge management system**
>
> Last Updated: October 16, 2025

---

## 🎯 Quick Overview

BookFlow is a desktop-first reading companion that helps users:
- Track reading progress across multiple books
- Take organized, searchable notes
- Extract and manage action items from books
- Build knowledge connections between books
- Analyze reading habits and statistics

**Status**: Phase 1 - Week 2 Complete (67% of MVP)

---

## 📋 Essential Documentation

For detailed information, see these focused guides in `/docs/`:

1. **[TECH_STACK.md](docs/TECH_STACK.md)** - Complete tech stack & project structure
2. **[DATABASE.md](docs/DATABASE.md)** - Database schema & tables
3. **[SHADCN_GUIDE.md](docs/SHADCN_GUIDE.md)** - shadcn/ui usage & examples
4. **[IMPLEMENTATION_PHASES.md](docs/IMPLEMENTATION_PHASES.md)** - Detailed phase breakdown

Also see:
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current progress & milestones
- **[README.md](README.md)** - Getting started & quick reference

---

## 🎨 UI Component Policy

### ⭐ CRITICAL: Always Use shadcn/ui

- ✅ **ALWAYS use shadcn/ui** for ALL UI components
- ✅ Install as needed: `npx shadcn@latest add [component-name]`
- ✅ Customize in `src/components/ui/`
- ❌ **NEVER** create custom UI primitives from scratch
- ❌ **NEVER** use other UI libraries

**Currently Installed**: Button, Card, Badge, Separator, Input, Label, Form, Dialog, Select, Textarea, Tabs, DropdownMenu, Toast

See [SHADCN_GUIDE.md](docs/SHADCN_GUIDE.md) for detailed examples.

---

## 🛠 Tech Stack Summary

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: Zustand + TanStack Query
- **Rich Text**: Tiptap
- **Charts**: Recharts

See [TECH_STACK.md](docs/TECH_STACK.md) for full details.

---

## 🗄 Database

**13 Core Tables**: profiles, shelves, books, book_shelves, reading_sessions, notes, action_items, life_applications, concepts, book_concepts, book_relationships, flashcards, review_queue, user_settings

**Key Features**:
- Row Level Security (RLS) enabled
- Auto-triggers for timestamps
- Full-text search indexes
- TypeScript types generated

See [DATABASE.md](docs/DATABASE.md) for schema details.

---

## 🚀 Current Phase: Week 3 - Reading Sessions

### ✅ Completed (Weeks 1-2)
- ✅ Database Setup (13 tables)
- ✅ Project Infrastructure
- ✅ Authentication (login, signup, reset)
- ✅ Book Management (CRUD, shelves, covers)
- ✅ Landing Page

### 🔜 Next Up (Week 3)
- [ ] Session timer component
- [ ] Start/Stop/Pause functionality
- [ ] Manual session entry
- [ ] Session history
- [ ] Page progress tracking

See [IMPLEMENTATION_PHASES.md](docs/IMPLEMENTATION_PHASES.md) for full roadmap.

---

## 📁 Project Structure

```
bookflow/
├── docs/                      # 📚 Detailed documentation
│   ├── TECH_STACK.md
│   ├── DATABASE.md
│   ├── SHADCN_GUIDE.md
│   └── IMPLEMENTATION_PHASES.md
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth pages
│   │   ├── (dashboard)/      # Protected pages
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── books/
│   │   ├── shelves/
│   │   └── layout/
│   ├── lib/
│   │   ├── supabase/         # Supabase clients
│   │   ├── api/              # API functions
│   │   └── hooks/            # React hooks
│   └── types/                # TypeScript types
├── supabase/
│   └── migrations/           # Database migrations
├── CLAUDE.md                 # This file (quick ref)
├── PROJECT_STATUS.md         # Current progress
└── README.md                 # Getting started
```

---

## 🔑 Key Development Principles

### 1. Component-First Development
- Always check if shadcn/ui has a component before building
- Use React Hook Form + Zod for all forms
- Keep components small and focused

### 2. Type Safety
- TypeScript strict mode enabled
- Generate types from Supabase: `supabase gen types typescript`
- Use Zod schemas for validation

### 3. State Management
- **Server State**: TanStack Query (React Query)
- **Client State**: Zustand stores
- **Forms**: React Hook Form

### 4. Database Access
- All queries through Supabase client
- RLS policies enforce security
- Use TypeScript types for type safety

### 5. File Organization
```typescript
// API functions in /lib/api/
export async function getBooks(userId: string) { ... }

// Custom hooks in /lib/hooks/
export function useBooks() {
  return useQuery({ queryKey: ['books'], queryFn: getBooks })
}

// Components use hooks
function BooksPage() {
  const { data: books } = useBooks()
  return <BookGrid books={books} />
}
```

---

## 🚨 Common Patterns

### Form with Validation
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'

const schema = z.object({ title: z.string().min(1) })

function MyForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  return <Form {...form}>...</Form>
}
```

### Database Query with React Query
```typescript
import { useQuery } from '@tanstack/react-query'
import { getBooks } from '@/lib/api/books'

function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => getBooks(userId),
  })
}
```

### Toast Notifications
```typescript
import { toast } from 'sonner'

toast.success('Success!')
toast.error('Error occurred')
```

---

## 📦 Quick Commands

```bash
# Start dev server
npm run dev

# Install shadcn/ui component
npx shadcn@latest add [component-name]

# Generate DB types
npx supabase gen types typescript --local > src/types/database.ts

# Type check
npm run type-check

# Build
npm run build
```

---

## 🎯 Next Steps

1. Review [PROJECT_STATUS.md](PROJECT_STATUS.md) for current progress
2. Check [IMPLEMENTATION_PHASES.md](docs/IMPLEMENTATION_PHASES.md) for next tasks
3. Use [SHADCN_GUIDE.md](docs/SHADCN_GUIDE.md) when adding UI
4. Reference [DATABASE.md](docs/DATABASE.md) for schema queries

---

## 📞 Quick Reference

- **Supabase Project**: https://jrmhbzcgtfyxnhxaphqg.supabase.co
- **Local Dev**: http://localhost:3000
- **shadcn/ui Docs**: https://ui.shadcn.com
- **Supabase Docs**: https://supabase.com/docs

---

**Built with ❤️ for readers, by readers.**

*Documentation optimized for performance - detailed guides in `/docs/` directory*
