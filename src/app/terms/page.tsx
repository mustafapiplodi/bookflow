import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Terms and Conditions</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              By accessing and using BookFlow, you accept and agree to be bound by the terms and provisions of this agreement.
              If you do not agree to these terms, please do not use our service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">2. Description of Service</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              BookFlow is a personal reading management application that helps users:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>Track reading sessions and manage personal libraries</li>
              <li>Take notes and capture insights from books</li>
              <li>Create and track action items derived from reading</li>
              <li>Analyze reading patterns and statistics</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">3. User Accounts</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              To use BookFlow, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">4. User Content</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              You retain all rights to the content you create in BookFlow (notes, action items, etc.). By using our service,
              you grant us the right to store and process your content to provide the service. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>Ensuring you have the right to share any content you add</li>
              <li>Not uploading content that infringes copyright or other rights</li>
              <li>Not using the service for illegal purposes</li>
              <li>Backing up your important data</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">5. Prohibited Uses</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              You may not use BookFlow to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit viruses, malware, or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use automated systems to access the service without permission</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">6. Intellectual Property</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              The BookFlow application, including its design, functionality, and code, is owned by Scaling High Technologies
              and protected by copyright and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>Copy, modify, or distribute our software</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">7. Service Availability</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We strive to maintain high availability, but we do not guarantee uninterrupted access to BookFlow.
              We may modify, suspend, or discontinue the service at any time, with or without notice.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">8. Limitation of Liability</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              To the maximum extent permitted by law, BookFlow and Scaling High Technologies shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">9. Disclaimer of Warranties</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              BookFlow is provided "as is" and "as available" without warranties of any kind, either express or implied,
              including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">10. Termination</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We reserve the right to terminate or suspend your account at any time, with or without notice, for violations
              of these terms or for any other reason. You may terminate your account at any time by contacting us.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">11. Changes to Terms</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of significant changes by
              posting a notice on our website or sending an email. Your continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">12. Governing Law</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
              Scaling High Technologies operates, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 dark:text-white">13. Contact Information</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="text-slate-700 dark:text-slate-300 mb-2">
              Email: <a href="mailto:legal@bookflow.app" className="text-primary hover:underline">legal@bookflow.app</a>
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Website: <a href="https://www.scalinghigh.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.scalinghigh.com</a>
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
