import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Timer, FileText, BarChart3, Target, Tags, Search, Lightbulb, CheckCircle2, TrendingUp, Linkedin } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold dark:text-white">BookFlow</span>
          </div>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Transform Reading into Real-World Results
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            BookFlow helps you bridge the gap between learning and doing. Track your reading,
            capture insights, create actionable tasks, and measure the real impact of your books.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link href="/signup">Start Your Journey</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="max-w-4xl mx-auto mb-20 p-8 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900">
          <h2 className="text-3xl font-bold mb-4 text-center text-slate-900 dark:text-white">Why BookFlow Exists</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            <strong className="text-blue-600 dark:text-blue-400">The Problem:</strong> We read hundreds of books, highlight countless passages,
            and take notes... but how much of that knowledge actually changes our behavior? How many insights
            turn into actions? How do we know which books truly made a difference in our lives?
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            <strong className="text-blue-600 dark:text-blue-400">The Solution:</strong> BookFlow was built on a simple philosophy:
            <em className="font-semibold"> reading is only valuable if it leads to action</em>. We don't just help you
            track <em>what</em> you read—we help you track <em>what you do</em> with what you read.
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Every book you finish, every note you take, every action you complete—it all connects together to show you
            the complete journey from insight to outcome. This is reading with purpose. This is learning that lasts.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Personal Library</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Organize your books, track reading progress, and set completion goals. Rate and review books as you finish them.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-4">
                <Timer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Reading Sessions</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Track your reading time with built-in timers. View your reading history and patterns over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Rich Text Notes</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Capture insights with a powerful rich text editor. Add formatting, links, images, and more to your notes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center mb-4">
                <Tags className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Smart Tagging</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Tag your notes and actions to connect related concepts across different books. Find patterns in your learning.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Action Items</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Convert insights into actionable tasks. Track what you do with what you learn and record the outcomes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Powerful Search</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Search across all your notes and actions instantly. Filter by tags, books, or completion status.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Statistics Dashboard</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Track your reading time, books finished, and action completion rates. See your progress over time.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Actionable Insights</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Discover which books generate the most actions, your reading patterns, and your most productive times.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 dark:text-white">Book Impact Score</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                See which books truly made a difference. Track notes taken, actions created, and completion rates per book.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Add Books to Your Library</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Start by adding books you're reading or want to read. Set reading goals and track your progress.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Capture Insights as You Read</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Take notes during reading sessions. Use tags to categorize concepts and make them searchable across all your books.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Turn Insights into Actions</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Mark important notes as action items. Track them separately and record the outcomes when you complete them.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Measure Your Impact</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Review your statistics and insights. See which books drive real change in your life and which reading patterns work best for you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center mb-20 p-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Make Reading Count?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join readers who are transforming their knowledge into action.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Start Free Today
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold dark:text-white">BookFlow</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Transform reading into real-world results.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/signup" className="text-slate-600 dark:text-slate-400 hover:text-primary">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-primary">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-primary">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.scalinghigh.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary"
                  >
                    Scaling High Technologies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Made with ❤️ by{' '}
              <a
                href="https://www.linkedin.com/in/mustafapiplodi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Mustafa Piplodi
                <Linkedin className="w-3 h-3" />
              </a>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Powered by{' '}
              <a
                href="https://www.scalinghigh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Scaling High Technologies
              </a>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-4">
              © {new Date().getFullYear()} BookFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
