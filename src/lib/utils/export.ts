/**
 * Export utilities for books, notes, and analytics data
 */

export interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  genre?: string
  total_pages?: number
  current_page?: number
  status: string
  rating?: number
  description?: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  title?: string
  content: string
  note_type: string
  book_id: string
  page_number?: number
  chapter?: string
  section?: string
  tags?: string[]
  priority?: string
  is_pinned: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
  books?: {
    title: string
    author: string
  }
}

/**
 * Download a file to the user's computer
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export books to JSON format
 */
export function exportBooksToJSON(books: Book[]) {
  const content = JSON.stringify(books, null, 2)
  const filename = `bookflow-books-${new Date().toISOString().split('T')[0]}.json`
  downloadFile(content, filename, 'application/json')
}

/**
 * Export books to CSV format
 */
export function exportBooksToCSV(books: Book[]) {
  // CSV headers
  const headers = [
    'Title',
    'Author',
    'ISBN',
    'Genre',
    'Total Pages',
    'Current Page',
    'Status',
    'Rating',
    'Date Added',
  ]

  // Convert books to CSV rows
  const rows = books.map(book => [
    `"${(book.title || '').replace(/"/g, '""')}"`,
    `"${(book.author || '').replace(/"/g, '""')}"`,
    `"${(book.isbn || '').replace(/"/g, '""')}"`,
    `"${(book.genre || '').replace(/"/g, '""')}"`,
    book.total_pages || '',
    book.current_page || '',
    book.status || '',
    book.rating || '',
    new Date(book.created_at).toLocaleDateString(),
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n')

  const filename = `bookflow-books-${new Date().toISOString().split('T')[0]}.csv`
  downloadFile(csvContent, filename, 'text/csv')
}

/**
 * Export notes to JSON format
 */
export function exportNotesToJSON(notes: Note[]) {
  const content = JSON.stringify(notes, null, 2)
  const filename = `bookflow-notes-${new Date().toISOString().split('T')[0]}.json`
  downloadFile(content, filename, 'application/json')
}

/**
 * Strip HTML tags from content
 */
function stripHTML(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

/**
 * Export notes to Markdown format
 */
export function exportNotesToMarkdown(notes: Note[]) {
  // Group notes by book
  const notesByBook: { [key: string]: Note[] } = {}

  notes.forEach(note => {
    const bookTitle = note.books?.title || 'Uncategorized'
    if (!notesByBook[bookTitle]) {
      notesByBook[bookTitle] = []
    }
    notesByBook[bookTitle].push(note)
  })

  // Build markdown content
  let markdown = `# BookFlow Notes Export\n\n`
  markdown += `*Exported on ${new Date().toLocaleDateString()}*\n\n`
  markdown += `Total Notes: ${notes.length}\n\n`
  markdown += `---\n\n`

  // Add notes by book
  Object.entries(notesByBook).forEach(([bookTitle, bookNotes]) => {
    markdown += `## ${bookTitle}\n\n`

    // Add book author if available
    if (bookNotes[0]?.books?.author) {
      markdown += `*by ${bookNotes[0].books.author}*\n\n`
    }

    markdown += `${bookNotes.length} note${bookNotes.length === 1 ? '' : 's'}\n\n`

    // Sort notes by page number
    const sortedNotes = [...bookNotes].sort((a, b) => {
      if (!a.page_number) return 1
      if (!b.page_number) return -1
      return a.page_number - b.page_number
    })

    sortedNotes.forEach((note, index) => {
      markdown += `### Note ${index + 1}`

      // Add metadata
      const metadata: string[] = []
      if (note.page_number) metadata.push(`Page ${note.page_number}`)
      if (note.chapter) metadata.push(note.chapter)
      if (note.section) metadata.push(note.section)
      if (metadata.length > 0) {
        markdown += ` (${metadata.join(' • ')})`
      }

      markdown += `\n\n`

      // Add title if exists
      if (note.title) {
        markdown += `**${note.title}**\n\n`
      }

      // Add note type badge
      markdown += `*Type: ${note.note_type}*`
      if (note.priority && note.priority !== 'none') {
        markdown += ` • *Priority: ${note.priority}*`
      }
      markdown += `\n\n`

      // Add content (strip HTML)
      const content = stripHTML(note.content)
      markdown += `${content}\n\n`

      // Add tags if exists
      if (note.tags && note.tags.length > 0) {
        markdown += `**Tags:** ${note.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`
      }

      // Add date
      markdown += `*Created: ${new Date(note.created_at).toLocaleDateString()}*\n\n`

      markdown += `---\n\n`
    })
  })

  const filename = `bookflow-notes-${new Date().toISOString().split('T')[0]}.md`
  downloadFile(markdown, filename, 'text/markdown')
}

/**
 * Export analytics report to Markdown
 */
export function exportAnalyticsToMarkdown(stats: any, genreStats: any[]) {
  let markdown = `# BookFlow Analytics Report\n\n`
  markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`
  markdown += `---\n\n`

  // Reading Statistics
  markdown += `## 📊 Reading Statistics\n\n`
  markdown += `| Metric | Value |\n`
  markdown += `|--------|-------|\n`
  markdown += `| Total Books | ${stats.totalBooks} |\n`
  markdown += `| Books Completed | ${stats.booksRead} |\n`
  markdown += `| Currently Reading | ${stats.booksReading} |\n`
  markdown += `| Want to Read | ${stats.booksWantToRead} |\n`
  markdown += `| Total Pages Read | ${stats.totalPages.toLocaleString()} |\n`
  markdown += `| Total Reading Time | ${Math.floor(stats.totalReadingTime / 60)}h ${stats.totalReadingTime % 60}m |\n`
  markdown += `| Average Rating | ${stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'} / 5 |\n`
  markdown += `| Reading Streak | ${stats.readingStreak} days |\n\n`

  // This Month/Year
  markdown += `## 📅 Recent Activity\n\n`
  markdown += `| Period | Books Read | Pages Read | Time Spent |\n`
  markdown += `|--------|------------|------------|------------|\n`
  markdown += `| This Week | — | ${stats.pagesThisWeek} | ${Math.floor(stats.timeThisWeek / 60)}h ${stats.timeThisWeek % 60}m |\n`
  markdown += `| This Month | ${stats.booksThisMonth} | ${stats.pagesThisMonth} | ${Math.floor(stats.timeThisMonth / 60)}h ${stats.timeThisMonth % 60}m |\n`
  markdown += `| This Year | ${stats.booksThisYear} | — | — |\n\n`

  // Reading Pace
  markdown += `## ⚡ Reading Pace\n\n`
  if (stats.totalReadingTime > 0 && stats.totalPages > 0) {
    const pagesPerHour = Math.round(stats.totalPages / (stats.totalReadingTime / 60))
    markdown += `- **Average Reading Speed:** ${pagesPerHour} pages per hour\n`
  }
  if (stats.booksThisYear > 0) {
    const currentMonth = new Date().getMonth() + 1
    const booksPerMonth = (stats.booksThisYear / currentMonth).toFixed(1)
    markdown += `- **Books per Month (2024):** ${booksPerMonth}\n`
  }
  markdown += `\n`

  // Genre Distribution
  if (genreStats && genreStats.length > 0) {
    markdown += `## 📚 Genre Distribution\n\n`
    markdown += `| Genre | Books | Percentage |\n`
    markdown += `|-------|-------|------------|\n`
    genreStats.slice(0, 10).forEach(genre => {
      markdown += `| ${genre.genre} | ${genre.count} | ${genre.percentage.toFixed(1)}% |\n`
    })
    markdown += `\n`
  }

  // Milestones
  markdown += `## 🏆 Achievements\n\n`
  const milestones: string[] = []

  if (stats.booksRead >= 100) milestones.push('🏆 Century Club (100+ books)')
  else if (stats.booksRead >= 50) milestones.push('🎖️ Bookworm (50+ books)')

  if (stats.readingStreak >= 30) milestones.push('🔥 On Fire! (30+ day streak)')
  else if (stats.readingStreak >= 7) milestones.push('⚡ Week Warrior (7+ day streak)')

  if (stats.totalReadingTime >= 6000) milestones.push('⏰ Time Master (100+ hours)')

  if (stats.averageRating >= 4.5) milestones.push('⭐ Quality Curator (4.5+ avg rating)')

  if (milestones.length > 0) {
    milestones.forEach(m => markdown += `- ${m}\n`)
  } else {
    markdown += `*No milestones yet - keep reading!*\n`
  }

  markdown += `\n---\n\n`
  markdown += `*This report was generated by BookFlow - Your Reading Companion*\n`

  const filename = `bookflow-analytics-${new Date().toISOString().split('T')[0]}.md`
  downloadFile(markdown, filename, 'text/markdown')
}
