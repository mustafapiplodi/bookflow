# Tech Stack

## Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (PRIMARY - Use for ALL UI)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand + React Query (TanStack Query)
- **Rich Text Editor**: Tiptap 2.0
- **Charts**: Recharts
- **Date/Time**: date-fns
- **Drag & Drop**: dnd-kit
- **File Upload**: react-dropzone

## Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (book covers)
- **Real-time**: Supabase Realtime
- **Edge Functions**: Supabase Functions

## DevOps & Tools
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright (Phase 3)

## Key Dependencies
```json
{
  "next": "14.2.14",
  "react": "^18.3.1",
  "typescript": "^5.6.3",
  "@supabase/supabase-js": "^2.45.4",
  "@tanstack/react-query": "^5.59.0",
  "zustand": "^4.5.5",
  "@tiptap/react": "^2.7.4",
  "tailwindcss": "^3.4.13",
  "zod": "^3.25.76",
  "react-hook-form": "^7.65.0",
  "recharts": "^2.12.7",
  "sonner": "^1.5.0"
}
```

## Project Structure
```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Auth pages
│   ├── (dashboard)/     # Protected pages
│   ├── api/             # API routes
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── books/
│   ├── sessions/
│   ├── notes/
│   └── shelves/
├── lib/
│   ├── supabase/        # Supabase clients
│   ├── hooks/           # Custom React hooks
│   ├── api/             # API functions
│   └── utils/
└── types/               # TypeScript types
```
