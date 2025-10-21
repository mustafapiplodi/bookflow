'use client'

import Link from 'next/link'
import { BookOpen, Heart, Sparkles, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold">BookFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">About BookFlow</h1>
            <p className="text-xl text-muted-foreground">
              Your personal reading companion for building knowledge and retaining insights
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-lg space-y-4">
              <p>
                BookFlow was created to solve a problem many avid readers face: <strong>remembering and applying what you read</strong>.
              </p>
              <p>
                We believe that reading is not just about consuming books—it&apos;s about extracting wisdom, connecting ideas, and transforming insights into action. BookFlow helps you do exactly that.
              </p>
            </CardContent>
          </Card>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">The Story</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Like many readers, we found ourselves finishing books and struggling to recall key insights weeks later. We tried various note-taking apps, but none were designed specifically for readers.
              </p>
              <p>We wanted a tool that would:</p>
              <ul>
                <li>Let us take notes <em>while</em> we read</li>
                <li>Track our reading sessions and build consistency</li>
                <li>Connect ideas across different books</li>
                <li>Turn insights into actionable tasks</li>
                <li>Show us our reading progress over time</li>
              </ul>
              <p>
                So we built BookFlow—a comprehensive reading companion that combines book management, session tracking, intelligent note-taking, and powerful analytics in one beautiful interface.
              </p>
            </div>
          </div>

          <Separator className="my-12" />

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Heart className="h-10 w-10 text-red-500 mb-2" />
                  <CardTitle>Reader-First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every feature is designed with readers in mind. We prioritize a distraction-free experience and intuitive workflows.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Sparkles className="h-10 w-10 text-amber-500 mb-2" />
                  <CardTitle>Privacy & Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your reading data is yours. We use end-to-end encryption, never track you, and let you export everything anytime.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Continuous Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We&apos;re constantly adding features based on user feedback. Your suggestions shape the future of BookFlow.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="text-center border-2">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl font-bold mb-4">Start Your Reading Journey</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join readers who are building their personal knowledge base
              </p>
              <Link href="/signup">
                <Button size="lg">
                  Get Started for Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 BookFlow. All rights reserved.</p>
          <p className="mt-2">
            Made with ❤️ by{' '}
            <a
              href="https://www.linkedin.com/in/mustafa-piplodi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Mustafa Piplodi
            </a>
          </p>
          <p className="mt-1">
            <a
              href="https://www.scalinghigh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Scaling High Technologies
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
