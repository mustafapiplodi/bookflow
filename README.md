# 📚 BookFlow - Your Personal Reading Companion

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

> Transform your reading experience. Track sessions, capture insights, and turn knowledge into action.

![BookFlow Status](https://img.shields.io/badge/Status-Phase%201%20Complete-success)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

---

## ✨ Features

### 📖 **Library Management**
- Organize books into Reading, Want to Read, and Finished sections
- Add books with cover images, titles, and authors
- Track reading progress and time spent per book
- Rate books and capture one-sentence takeaways

### ⏱️ **Reading Sessions** _(Coming Soon)_
- Start/pause/stop timer for reading sessions
- Focus mode with ambient sounds (rain, cafe, white noise)
- Session history and analytics
- Micro-reflections after each session

### 📝 **Smart Notes** _(Coming Soon)_
- Take text notes during reading sessions
- Record voice notes with speech-to-text
- Tag and categorize notes
- Link related notes across books

### ✅ **Action Items** _(Coming Soon)_
- Convert insights into actionable tasks
- Track completion with outcome notes
- Filter and search actions
- See which books drive the most action

### 📊 **Statistics & Insights** _(Coming Soon)_
- Reading time analytics with charts
- Books finished per month
- Reading patterns and trends
- Action completion rates
- Most impactful books

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bookflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**

   The migrations are already applied to the connected Supabase project.
   For a new project, run the migrations in the `supabase/migrations/` folder.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend & Database
- **[Supabase](https://supabase.com/)** - PostgreSQL database + Auth
- **[Supabase Storage](https://supabase.com/storage)** - File storage for covers & voice notes
- **Row Level Security (RLS)** - Database-level security

### State Management
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Client state (planned)
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

---

## 📁 Project Structure

```
bookflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── books/             # Book-related components
│   │   ├── layout/            # Layout components (Sidebar, etc.)
│   │   └── providers/         # Context providers
│   ├── lib/
│   │   ├── supabase/          # Supabase client setup
│   │   ├── api/               # API functions
│   │   └── utils.ts           # Utility functions
│   ├── hooks/                 # Custom React hooks
│   └── types/
│       └── database.ts        # Generated TypeScript types
├── supabase/
│   └── migrations/            # Database migrations
├── middleware.ts              # Auth middleware
└── tailwind.config.ts         # Tailwind configuration
```

---

## 🗄️ Database Schema

8 core tables with Row Level Security:

1. **books** - Book information and metadata
2. **sessions** - Reading session tracking
3. **notes** - Text and voice notes
4. **note_tags** - Tag associations
5. **note_relationships** - Note linking
6. **actions** - Action items
7. **tags** - Master tag list
8. **user_settings** - User preferences

See `PROJECT_STATUS.md` for detailed schema information.

---

## 🎨 Screenshots

### Landing Page
Beautiful, modern landing page with feature showcase.

### Library View
Organize your books into Reading, Want to Read, and Finished sections.

### Book Detail
View detailed information about each book, including reading stats.

_(Screenshots to be added)_

---

## 📖 Usage

### Adding a Book
1. Click "Add Book" in the Library
2. Enter title, author, and optional cover image
3. Select status (Reading/Want to Read/Finished)
4. Click "Add Book"

### Starting a Reading Session _(Coming Soon)_
1. Open a book from your library
2. Click "Start Reading"
3. Timer begins automatically
4. Take notes during your session
5. Stop when finished - add a quick reflection

### Taking Notes _(Coming Soon)_
1. Click the floating "+" button during a session
2. Type or record a voice note
3. Add tags for organization
4. Mark as action item if needed

---

## 🚧 Roadmap

- [x] **Phase 1**: Foundation & Library Management ✅
- [ ] **Phase 2**: Reading Sessions with Timer
- [ ] **Phase 3**: Note Taking (Text & Voice)
- [ ] **Phase 4**: Action Items Management
- [ ] **Phase 5**: Statistics Dashboard
- [ ] **Phase 6**: Insights & Analytics
- [ ] **Phase 7**: Search & Export Features

See `PROJECT_STATUS.md` for detailed progress tracking.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for hosting (planned)
- All the readers who inspired this project

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for readers who want to get more from their books.**

⭐ **Star this repo if you find it helpful!**
