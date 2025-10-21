/**
 * Generates a consistent color for a book based on its title
 * Uses a hash function to map title to a color from a predefined palette
 */
export function getBookColor(title: string): { bg: string; text: string } {
  const colors = [
    { bg: 'from-blue-400 to-blue-600', text: 'text-white' },
    { bg: 'from-purple-400 to-purple-600', text: 'text-white' },
    { bg: 'from-pink-400 to-pink-600', text: 'text-white' },
    { bg: 'from-red-400 to-red-600', text: 'text-white' },
    { bg: 'from-orange-400 to-orange-600', text: 'text-white' },
    { bg: 'from-amber-400 to-amber-600', text: 'text-white' },
    { bg: 'from-yellow-400 to-yellow-600', text: 'text-gray-900' },
    { bg: 'from-lime-400 to-lime-600', text: 'text-gray-900' },
    { bg: 'from-green-400 to-green-600', text: 'text-white' },
    { bg: 'from-emerald-400 to-emerald-600', text: 'text-white' },
    { bg: 'from-teal-400 to-teal-600', text: 'text-white' },
    { bg: 'from-cyan-400 to-cyan-600', text: 'text-white' },
    { bg: 'from-sky-400 to-sky-600', text: 'text-white' },
    { bg: 'from-indigo-400 to-indigo-600', text: 'text-white' },
    { bg: 'from-violet-400 to-violet-600', text: 'text-white' },
    { bg: 'from-fuchsia-400 to-fuchsia-600', text: 'text-white' },
    { bg: 'from-rose-400 to-rose-600', text: 'text-white' },
  ]

  // Simple hash function to get a consistent color for a title
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

/**
 * Extracts initials from a book title
 * Takes the first letter of the first two words
 */
export function getBookInitials(title: string): string {
  const words = title.trim().split(/\s+/)

  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()

  return (words[0][0] + words[1][0]).toUpperCase()
}
