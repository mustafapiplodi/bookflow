'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { exportAnalyticsToMarkdown } from '@/lib/utils/export'
import { ReadingStats, GenreStats } from '@/lib/api/analytics'
import { toast } from 'sonner'

interface ExportReportButtonProps {
  stats: ReadingStats
  genreStats: GenreStats[]
}

export function ExportReportButton({ stats, genreStats }: ExportReportButtonProps) {
  const handleExport = () => {
    try {
      exportAnalyticsToMarkdown(stats, genreStats)
      toast.success('Analytics report exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    }
  }

  return (
    <Button variant="outline" className="gap-2" onClick={handleExport}>
      <Download className="h-4 w-4" />
      Export Report
    </Button>
  )
}
