import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Timer, FileText, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">BookFlow</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Your Personal Reading Companion
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Track your reading sessions, capture insights, and transform knowledge into action.
            Build your personal library and never forget what you've learned.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start Reading</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Timer className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Reading Sessions</h3>
            <p className="text-slate-600 text-sm">
              Track your reading time with built-in timer and focus mode with ambient sounds.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Notes</h3>
            <p className="text-slate-600 text-sm">
              Capture text and voice notes, tag insights, and link related concepts together.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Action Items</h3>
            <p className="text-slate-600 text-sm">
              Convert insights into actionable tasks and track real-world outcomes.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Insights</h3>
            <p className="text-slate-600 text-sm">
              Discover patterns in your reading habits and see which books drive the most action.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
