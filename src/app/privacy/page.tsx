import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold dark:text-white">BookFlow</span>
          </Link>
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

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl border dark:border-slate-700 shadow-sm">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Privacy Policy</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">1. Introduction</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Welcome to BookFlow ("we," "our," or "us"). We are committed to protecting your personal information
              and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our application.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">2. Information We Collect</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We collect information that you provide directly to us when using BookFlow:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li><strong>Account Information:</strong> Email address and password when you create an account</li>
              <li><strong>Reading Data:</strong> Books you add, reading sessions, notes, and action items you create</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our application</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">3. How We Use Your Information</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Store your reading data, notes, and action items</li>
              <li>Generate statistics and insights about your reading habits</li>
              <li>Communicate with you about updates and features</li>
              <li>Ensure the security and integrity of our services</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">4. Data Storage and Security</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Your data is stored securely using Supabase, a secure and reliable database platform. We implement
              appropriate technical and organizational measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">5. Data Sharing and Disclosure</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in operating our application (under strict confidentiality agreements)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">6. Your Rights</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of communications</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">7. Cookies and Tracking</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We use essential cookies and local storage to maintain your session and preferences. We do not use
              tracking cookies for advertising purposes.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">8. Children's Privacy</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              BookFlow is not intended for children under 13 years of age. We do not knowingly collect personal
              information from children under 13.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">9. Changes to This Policy</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">10. Contact Us</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Email: <a href="mailto:privacy@bookflow.app" className="text-primary hover:underline">privacy@bookflow.app</a>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <Button asChild variant="outline">
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
