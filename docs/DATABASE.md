# Database Schema

## Core Tables (13 Tables)

### 1. profiles
User accounts and preferences

### 2. shelves
Book organization (6 default + custom)

### 3. books
Complete book library with metadata

### 4. book_shelves
Many-to-many book-shelf relationships

### 5. reading_sessions
Reading time and progress tracking

### 6. notes
Rich text notes with 12 categories

### 7. action_items
Task management from books

### 8. life_applications
Real-world concept application log

### 9. concepts
Cross-book concept tracking

### 10. book_concepts
Book-concept relationships

### 11. book_relationships
Inter-book connections

### 12. flashcards
Spaced repetition system (SM-2)

### 13. review_queue
Review scheduling system

### 14. user_settings
User preferences and configs

## Key Features
- Row Level Security (RLS) on all tables
- Auto-triggers for timestamps, session duration, page tracking
- Full-text search indexes
- Foreign key relationships with cascading deletes
- Generated TypeScript types

For detailed SQL schemas, see Supabase migrations in `/supabase/migrations/`
