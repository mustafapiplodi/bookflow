import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { CommandPalette } from '@/components/command-palette'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <CommandPalette />
    </div>
  )
}
