'use client'

import Link from 'next/link'
import { BookOpen, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function TermsPage() {
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
            <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: October 21, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using BookFlow ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
            </p>

            <Separator className="my-8" />

            <h2>2. Description of Service</h2>
            <p>
              BookFlow is a personal reading companion application that helps you:
            </p>
            <ul>
              <li>Manage your book library</li>
              <li>Track reading sessions and progress</li>
              <li>Take notes and capture insights</li>
              <li>Create action items from books</li>
              <li>Build connections between books and concepts</li>
              <li>Analyze your reading habits</li>
            </ul>

            <Separator className="my-8" />

            <h2>3. Account Registration</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use BookFlow, you must:
            </p>
            <ul>
              <li>Be at least 13 years old</li>
              <li>Provide accurate registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3>3.2 Account Responsibility</h3>
            <p>
              You are responsible for:
            </p>
            <ul>
              <li>All activity that occurs under your account</li>
              <li>Maintaining the confidentiality of your password</li>
              <li>Complying with these Terms</li>
            </ul>

            <Separator className="my-8" />

            <h2>4. Acceptable Use</h2>
            <p>
              You agree <strong>not</strong> to:
            </p>
            <ul>
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or viruses</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated tools to access the Service without permission</li>
              <li>Resell or redistribute the Service</li>
            </ul>

            <Separator className="my-8" />

            <h2>5. Your Content</h2>
            <h3>5.1 Ownership</h3>
            <p>
              You retain all rights to the content you create in BookFlow (notes, highlights, action items, etc.). We do not claim ownership of your content.
            </p>

            <h3>5.2 License to Us</h3>
            <p>
              By using the Service, you grant us a limited license to:
            </p>
            <ul>
              <li>Store and display your content to you</li>
              <li>Back up your content for disaster recovery</li>
              <li>Perform technical operations necessary to provide the Service</li>
            </ul>
            <p>
              This license ends when you delete your content or close your account.
            </p>

            <h3>5.3 Content Responsibility</h3>
            <p>
              You are solely responsible for the content you create. We do not monitor or endorse user content.
            </p>

            <Separator className="my-8" />

            <h2>6. Intellectual Property</h2>
            <p>
              The BookFlow Service, including its design, features, code, and branding, is protected by copyright, trademark, and other intellectual property laws. You may not:
            </p>
            <ul>
              <li>Copy, modify, or create derivative works</li>
              <li>Reverse engineer or decompile the Service</li>
              <li>Remove copyright or proprietary notices</li>
              <li>Use our trademarks without permission</li>
            </ul>

            <Separator className="my-8" />

            <h2>7. Subscription and Payment</h2>
            <h3>7.1 Free Plan</h3>
            <p>
              BookFlow offers a free plan with core features. We reserve the right to modify or discontinue the free plan at any time with notice.
            </p>

            <h3>7.2 Paid Plans (Future)</h3>
            <p>
              If we introduce paid plans:
            </p>
            <ul>
              <li>Fees will be clearly disclosed before purchase</li>
              <li>Payment is non-refundable except as required by law</li>
              <li>We may change pricing with 30 days' notice</li>
              <li>You can cancel anytime</li>
            </ul>

            <Separator className="my-8" />

            <h2>8. Service Availability</h2>
            <p>
              We strive for high availability but do not guarantee:
            </p>
            <ul>
              <li>Uninterrupted access to the Service</li>
              <li>Error-free operation</li>
              <li>Specific features will remain unchanged</li>
            </ul>
            <p>
              We may modify, suspend, or discontinue any part of the Service at any time.
            </p>

            <Separator className="my-8" />

            <h2>9. Data Export and Portability</h2>
            <p>
              You can export your data at any time in:
            </p>
            <ul>
              <li>JSON format (complete data)</li>
              <li>CSV format (books and reading stats)</li>
              <li>Markdown format (notes and summaries)</li>
            </ul>

            <Separator className="my-8" />

            <h2>10. Termination</h2>
            <h3>10.1 By You</h3>
            <p>
              You may close your account at any time through account settings. Upon closure:
            </p>
            <ul>
              <li>Your access to the Service will end immediately</li>
              <li>Your data will be deleted within 30 days</li>
              <li>You should export any data you want to keep before closing</li>
            </ul>

            <h3>10.2 By Us</h3>
            <p>
              We may suspend or terminate your account if you:
            </p>
            <ul>
              <li>Violate these Terms</li>
              <li>Engage in fraudulent activity</li>
              <li>Cause harm to other users or the Service</li>
            </ul>
            <p>
              We will provide notice when possible, except in cases of serious violations.
            </p>

            <Separator className="my-8" />

            <h2>11. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <Separator className="my-8" />

            <h2>12. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BOOKFLOW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, REVENUE, OR PROFITS.
            </p>

            <Separator className="my-8" />

            <h2>13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless BookFlow from any claims arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
            </ul>

            <Separator className="my-8" />

            <h2>14. Governing Law</h2>
            <p>
              These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.
            </p>

            <Separator className="my-8" />

            <h2>15. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. When we do:
            </p>
            <ul>
              <li>We'll update the "Last updated" date</li>
              <li>We'll notify you via email for material changes</li>
              <li>Continued use after changes constitutes acceptance</li>
            </ul>

            <Separator className="my-8" />

            <h2>16. Contact</h2>
            <p>
              Questions about these Terms? Contact us at:
            </p>
            <ul>
              <li>Email: <a href="mailto:legal@bookflow.app">legal@bookflow.app</a></li>
              <li>Address: BookFlow Legal Team, [Your Address]</li>
            </ul>
          </div>

          {/* Footer Links */}
          <Card className="mt-12 text-center">
            <CardContent className="pt-6 pb-6">
              <p className="text-muted-foreground mb-4">
                Also see our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
              <Link href="/signup">
                <Button>Accept and Get Started</Button>
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
