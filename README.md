# 📚 BookFlow

> Your comprehensive reading companion - Track books, take notes, build knowledge

## 🚀 Project Status

**Phase 1 - Week 1: COMPLETE** ✅
- ✅ Complete database schema (13 tables)
- ✅ All RLS policies and security fixes applied
- ✅ TypeScript types generated
- ✅ Next.js 14 project initialized
- ✅ All dependencies installed
- ✅ Build successful

**Next Steps**: Authentication system implementation

## 📖 Features (Planned)

### Core Features
- 📖 **Book Management** - Organize books into custom shelves
- ⏱️ **Reading Sessions** - Track your reading time and progress
- 📝 **Smart Notes** - Rich text notes with categories and search
- ✅ **Action Items** - Extract and manage actionable insights
- 📊 **Analytics** - Detailed reading statistics and visualizations
- 🧠 **Knowledge Graph** - Connect ideas across books
- 🔄 **Spaced Repetition** - Review and retain what you learn

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State**: Zustand + TanStack Query
- **Rich Text**: Tiptap
- **Charts**: Recharts

## 📁 Project Structure

```
bookflow/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utilities and configs
│   │   ├── supabase/   # Supabase clients
│   │   ├── hooks/      # Custom React hooks
│   │   ├── stores/     # Zustand stores
│   │   └── utils/      # Utility functions
│   ├── types/          # TypeScript types
│   └── styles/         # Global styles
├── CLAUDE.md           # Complete development guide
└── package.json
```

## 🗄 Database Schema

**13 Tables Created:**
1. `profiles` - User profiles
2. `shelves` - Book shelves (6 default + custom)
3. `books` - Book details and metadata
4. `book_shelves` - Many-to-many relationship
5. `reading_sessions` - Reading time tracking
6. `notes` - Categorized notes with rich text
7. `action_items` - Tasks extracted from books
8. `life_applications` - Real-world concept usage
9. `concepts` - Tracked concepts across books
10. `book_concepts` - Book-concept relationships
11. `book_relationships` - Connections between books
12. `flashcards` - Spaced repetition system
13. `review_queue` - Review scheduling
14. `user_settings` - User preferences

**All tables include:**
- ✅ Row Level Security (RLS)
- ✅ Proper indexes for performance
- ✅ Full-text search capabilities
- ✅ Auto-updating timestamps
- ✅ Cascading deletes

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📋 Development Roadmap

### Phase 1: MVP (Weeks 1-6)
- [x] Week 1: Database + Project Setup
- [ ] Week 1: Authentication
- [ ] Week 2: Book CRUD + Shelves
- [ ] Week 3: Reading Sessions
- [ ] Week 4: Note-Taking
- [ ] Week 5: Search & Filters
- [ ] Week 6: Analytics & Export

### Phase 2: Enhanced (Weeks 7-12)
- [ ] Action Items System
- [ ] Advanced Analytics
- [ ] Book Relationships
- [ ] Memory Tools
- [ ] Desktop Features

### Phase 3: Polish (Weeks 13-16)
- [ ] Accessibility
- [ ] Security
- [ ] Performance
- [ ] Deployment

## 📚 Documentation

### [CLAUDE.md](./CLAUDE.md)
Complete development guide with:
- Complete database schema
- shadcn/ui component guide
- API design patterns
- Component architecture
- Testing strategy
- Deployment guide

### [PROJECT_STATUS.md](./PROJECT_STATUS.md)
**Session continuity tracker** - Check this file when:
- 📍 Resuming development after a break
- ✅ Tracking completed milestones
- 🎯 Finding next tasks to work on
- 📊 Reviewing overall progress

## 🔒 Security

- All database functions use `security definer set search_path = public`
- RLS policies on all tables
- Supabase Auth with JWT
- XSS protection with DOMPurify
- CSRF protection built-in

## 📝 License

Private Project

---

**Built with ❤️ for readers, by readers**
