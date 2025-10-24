'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ActionsList } from '@/components/actions/actions-list'
import { ActionSearch } from '@/components/actions/action-search'
import { ActionTagFilter } from '@/components/actions/action-tag-filter'
import { CheckCircle, Circle, ListTodo } from 'lucide-react'

export default function ActionsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Actions</h1>
        <p className="text-slate-600">
          Track and complete action items from your reading
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <ActionSearch onSearch={setSearchQuery} />
        <ActionTagFilter selectedTag={selectedTag} onSelectTag={setSelectedTag} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="gap-2">
            <ListTodo className="h-4 w-4" />
            All Actions
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Circle className="h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ActionsList filter="all" searchQuery={searchQuery} selectedTag={selectedTag} />
        </TabsContent>

        <TabsContent value="pending">
          <ActionsList filter="pending" searchQuery={searchQuery} selectedTag={selectedTag} />
        </TabsContent>

        <TabsContent value="completed">
          <ActionsList filter="completed" searchQuery={searchQuery} selectedTag={selectedTag} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
