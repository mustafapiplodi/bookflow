import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SessionHistory } from '@/components/sessions/session-history'
import { ReadingHeatmap } from '@/components/dashboard/reading-heatmap'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, TrendingUp, Calendar, BookOpen } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const metadata = {
  title: 'Reading Sessions | BookFlow',
  description: 'Track your reading sessions and progress',
}

async function getReadingData(userId: string) {
  const supabase = await createClient()

  // Get all sessions
  const { data: sessions } = await supabase
    .from('reading_sessions')
    .select('*, books(title, author)')
    .eq('user_id', userId)
    .not('end_time', 'is', null)
    .order('start_time', { ascending: false })

  return { sessions: sessions || [] }
}

export default async function ReadingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { sessions } = await getReadingData(user.id)

  // Calculate stats
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const thisWeekSessions = sessions.filter(s => new Date(s.start_time) >= weekStart)
  const thisMonthSessions = sessions.filter(s => new Date(s.start_time) >= monthStart)

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const weekMinutes = thisWeekSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
  const monthMinutes = thisMonthSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
  const totalPages = sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0)

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Reading Sessions</h1>
        <p className="text-muted-foreground text-sm">
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} recorded
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Time</p>
                <p className="text-2xl font-bold">{totalHours}h {totalMinutes % 60}m</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">This Week</p>
                <p className="text-2xl font-bold">{Math.floor(weekMinutes / 60)}h {weekMinutes % 60}m</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pages Read</p>
                <p className="text-2xl font-bold">{totalPages}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Heatmap */}
      <div className="mb-6">
        <ReadingHeatmap sessions={sessions} />
      </div>

      {/* Session History */}
      <SessionHistory userId={user.id} showBookInfo={true} />
    </div>
  )
}
