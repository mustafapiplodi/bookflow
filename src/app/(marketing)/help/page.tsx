'use client'

import Link from 'next/link'
import { BookOpen, HelpCircle, Search, BookMarked, Clock, FileText, BarChart, Lightbulb, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
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

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers and get the most out of BookFlow
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Link href="#getting-started">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Learn the basics and set up your library
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="#features">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <Lightbulb className="h-10 w-10 text-amber-500 mb-2" />
                  <CardTitle>Features Guide</CardTitle>
                  <CardDescription>
                    Explore all features and how to use them
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="#contact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <HelpCircle className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Can't find what you need? Reach out
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          <Separator className="my-12" />

          {/* Getting Started */}
          <section id="getting-started" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              Getting Started
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg">How do I create an account?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Click "Get Started" in the navigation bar, enter your name, email, and password. You'll receive a confirmation email to verify your account.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg">How do I add my first book?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Go to "My Library" and click the "Add Book" button. Fill in the book details (title, author, ISBN, etc.). You can also upload a cover image or we'll generate a placeholder for you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg">What are shelves and how do I use them?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Shelves help you organize books. We provide default shelves (Want to Read, Reading, Completed, Paused, Abandoned), and you can create custom ones. Simply drag books between shelves or use the status dropdown.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg">How do I start a reading session?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  Open any book from your library, click "Start Session," enter your starting page, and begin reading. The timer will track your time automatically. You can pause/resume anytime.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator className="my-12" />

          {/* Features Guide */}
          <section id="features" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-primary" />
              Features Guide
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-blue-500" />
                    <CardTitle>Reading Sessions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Track your reading time with our built-in timer or add manual sessions.</p>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="sessions-1">
                      <AccordionTrigger>How does the timer work?</AccordionTrigger>
                      <AccordionContent>
                        Click "Start Session" to begin tracking. The timer runs in real-time. You can pause, resume, or stop it. When you stop, enter your ending page and the session is saved.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="sessions-2">
                      <AccordionTrigger>Can I add past reading sessions?</AccordionTrigger>
                      <AccordionContent>
                        Yes! Use the "Add Manual Session" button to log sessions from the past. Enter the date, time, duration, and pages read.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-purple-500" />
                    <CardTitle>Note-Taking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Capture insights with our rich text editor and 12 note categories.</p>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="notes-1">
                      <AccordionTrigger>What are the 12 note types?</AccordionTrigger>
                      <AccordionContent>
                        💡 Idea, ⚖️ Argument, ✅ Action, 💬 Quote, ❓ Question, 🔗 Connection, ❌ Disagreement, ✨ Insight, 📊 Data, 📝 Example, 🤔 Reflection, 📖 Definition
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="notes-2">
                      <AccordionTrigger>Can I take notes during a reading session?</AccordionTrigger>
                      <AccordionContent>
                        Absolutely! When you have an active session, you'll see an inline note editor. Just select the note type and start typing. No need to leave the reading flow.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart className="h-6 w-6 text-orange-500" />
                    <CardTitle>Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Visualize your reading habits with charts, streaks, and insights.</p>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="analytics-1">
                      <AccordionTrigger>What stats can I see?</AccordionTrigger>
                      <AccordionContent>
                        Total books, books read this month/year, reading time, pages read, average rating, reading streak, genre distribution, monthly trends, and more!
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="analytics-2">
                      <AccordionTrigger>Can I export my data?</AccordionTrigger>
                      <AccordionContent>
                        Yes! You can export books (JSON/CSV), notes (JSON/Markdown), and analytics reports (Markdown) anytime from the Analytics page.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Contact Support */}
          <section id="contact" className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
              Contact Support
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg mb-6">
                  Can't find what you're looking for? We're here to help!
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      📧 Email Support
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      support@bookflow.app
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24 hours
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      💬 Community
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Join our Discord or GitHub Discussions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Get help from other readers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <Card className="text-center border-2">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Reading?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Create your account and start building your knowledge base
              </p>
              <Link href="/signup">
                <Button size="lg">
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
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
