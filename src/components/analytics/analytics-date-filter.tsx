'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AnalyticsDateFilterProps {
  onDateRangeChange?: (range: string) => void
}

export function AnalyticsDateFilter({ onDateRangeChange }: AnalyticsDateFilterProps) {
  const [dateRange, setDateRange] = useState('all')

  const handleChange = (value: string) => {
    setDateRange(value)
    onDateRangeChange?.(value)
  }

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={dateRange} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="this_year">This Year</SelectItem>
          <SelectItem value="last_6_months">Last 6 Months</SelectItem>
          <SelectItem value="last_3_months">Last 3 Months</SelectItem>
          <SelectItem value="this_month">This Month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
