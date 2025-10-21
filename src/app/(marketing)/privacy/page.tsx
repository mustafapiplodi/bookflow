'use client'

import Link from 'next/link'
import { BookOpen, Shield, Lock, Eye, Database, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function PrivacyPage() {
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
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: October 21, 2025
            </p>
          </div>

          {/* Quick Summary */}
          <Card className="mb-12 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Privacy at a Glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p><strong>Your data is yours.</strong> We never sell or share your personal information.</p>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p><strong>End-to-end encryption.</strong> Your reading data is encrypted at rest and in transit.</p>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <p><strong>No tracking.</strong> We don't use analytics cookies or third-party trackers.</p>
              </div>
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p><strong>Export anytime.</strong> Download all your data in JSON, CSV, or Markdown format.</p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Policy */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Information We Collect</h2>
            <h3>1.1 Account Information</h3>
            <p>
              When you create an account, we collect:
            </p>
            <ul>
              <li>Your name and email address</li>
              <li>Password (hashed and encrypted)</li>
              <li>Account creation date</li>
            </ul>

            <h3>1.2 Reading Data</h3>
            <p>
              To provide our service, we store:
            </p>
            <ul>
              <li>Books you add to your library (titles, authors, metadata)</li>
              <li>Your notes, highlights, and annotations</li>
              <li>Reading session data (timestamps, duration, pages read)</li>
              <li>Action items and life applications you create</li>
              <li>Book relationships and connections you make</li>
            </ul>

            <h3>1.3 Usage Information</h3>
            <p>
              We collect minimal usage data to improve the service:
            </p>
            <ul>
              <li>Login timestamps and IP addresses (for security)</li>
              <li>Feature usage patterns (anonymous and aggregated)</li>
              <li>Error logs (to fix bugs)</li>
            </ul>

            <Separator className="my-8" />

            <h2>2. How We Use Your Information</h2>
            <p>
              We use your data <strong>only</strong> to:
            </p>
            <ul>
              <li>Provide and improve the BookFlow service</li>
              <li>Send you important account notifications</li>
              <li>Respond to your support requests</li>
              <li>Prevent fraud and abuse</li>
            </ul>
            <p>
              <strong>We never:</strong>
            </p>
            <ul>
              <li>Sell your data to third parties</li>
              <li>Use your reading data for advertising</li>
              <li>Share your information without your consent</li>
              <li>Train AI models on your private notes</li>
            </ul>

            <Separator className="my-8" />

            <h2>3. Data Security</h2>
            <p>
              We take security seriously:
            </p>
            <ul>
              <li><strong>Encryption</strong>: All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li><strong>Authentication</strong>: Secure password hashing with bcrypt</li>
              <li><strong>Infrastructure</strong>: Hosted on Supabase with enterprise-grade security</li>
              <li><strong>Backups</strong>: Daily encrypted backups with 30-day retention</li>
            </ul>

            <Separator className="my-8" />

            <h2>4. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li><strong>Access</strong> your data anytime via export features</li>
              <li><strong>Delete</strong> your account and all associated data</li>
              <li><strong>Correct</strong> any inaccurate information</li>
              <li><strong>Port</strong> your data to another service (JSON/CSV export)</li>
              <li><strong>Opt-out</strong> of non-essential communications</li>
            </ul>

            <Separator className="my-8" />

            <h2>5. Data Retention</h2>
            <p>
              We retain your data as long as your account is active. When you delete your account:
            </p>
            <ul>
              <li>All reading data is permanently deleted within 30 days</li>
              <li>Backups are purged within 90 days</li>
              <li>We may retain minimal records for legal/compliance purposes (email, deletion timestamp)</li>
            </ul>

            <Separator className="my-8" />

            <h2>6. Third-Party Services</h2>
            <p>
              BookFlow uses these trusted third-party services:
            </p>
            <ul>
              <li><strong>Supabase</strong> (database and authentication) - <a href="https://supabase.com/privacy" target="_blank" rel="noopener">Privacy Policy</a></li>
              <li><strong>Vercel</strong> (hosting) - <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a></li>
            </ul>
            <p>
              These services have access only to data necessary for their function and are bound by strict privacy agreements.
            </p>

            <Separator className="my-8" />

            <h2>7. Cookies</h2>
            <p>
              We use only essential cookies for:
            </p>
            <ul>
              <li>Session management (keep you logged in)</li>
              <li>Security (CSRF protection)</li>
              <li>Preferences (theme, language)</li>
            </ul>
            <p>
              We <strong>do not</strong> use advertising or tracking cookies.
            </p>

            <Separator className="my-8" />

            <h2>8. Children's Privacy</h2>
            <p>
              BookFlow is not intended for children under 13. We do not knowingly collect data from children. If you believe we have collected information from a child, please contact us immediately.
            </p>

            <Separator className="my-8" />

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. When we do:
            </p>
            <ul>
              <li>We'll update the "Last updated" date</li>
              <li>We'll notify you via email for significant changes</li>
              <li>Continued use after changes constitutes acceptance</li>
            </ul>

            <Separator className="my-8" />

            <h2>10. Contact Us</h2>
            <p>
              Questions about privacy? Contact us at:
            </p>
            <ul>
              <li>Email: <a href="mailto:privacy@bookflow.app">privacy@bookflow.app</a></li>
              <li>Address: BookFlow Privacy Team, [Your Address]</li>
            </ul>
          </div>

          {/* Footer Links */}
          <Card className="mt-12 text-center">
            <CardContent className="pt-6 pb-6">
              <p className="text-muted-foreground mb-4">
                Also see our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
              </p>
              <Link href="/signup">
                <Button>Get Started Securely</Button>
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
