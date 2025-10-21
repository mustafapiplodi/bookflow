'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { BookOpen, Link2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface KnowledgeGraphProps {
  data: {
    books: any[]
    connectionNotes: any[]
    allNotes?: any[]
  }
}

// Custom node component for books
function BookNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-blue-500 min-w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="h-4 w-4 text-blue-600" />
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      <div className="text-xs text-gray-500">{data.author}</div>
      {data.noteCount > 0 && (
        <Badge variant="secondary" className="mt-2 text-xs">
          {data.noteCount} connections
        </Badge>
      )}
    </div>
  )
}

// Custom node component for connection notes
function ConnectionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-white border-2 border-purple-500 min-w-[150px]">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-purple-600" />
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      {data.chapter && (
        <div className="text-xs text-gray-500 mt-1">Ch. {data.chapter}</div>
      )}
      {data.linkedCount > 0 && (
        <Badge variant="outline" className="mt-2 text-xs">
          {data.linkedCount} links
        </Badge>
      )}
    </div>
  )
}

const nodeTypes = {
  book: BookNode,
  connection: ConnectionNode,
}

export function KnowledgeGraph({ data }: KnowledgeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    if (!data) return

    const { books, connectionNotes, allNotes } = data
    const notesToUse = allNotes || connectionNotes

    // Create note nodes for ALL notes (connection notes + their linked notes)
    const noteNodes: Node[] = notesToUse.map((note: any, index: number) => {
      // Count linked notes
      const linkedCount = note.linked_note_ids?.length || 0
      const isConnectionNote = note.note_type === 'connection'

      return {
        id: `note-${note.id}`,
        type: 'connection',
        position: {
          x: 100 + (index % 5) * 200,
          y: 50 + Math.floor(index / 5) * 180,
        },
        data: {
          label: note.title || (note.content ? note.content.replace(/<[^>]*>/g, '').substring(0, 40) + '...' : 'Note'),
          chapter: note.chapter,
          linkedCount,
          noteId: note.id,
          noteType: note.note_type,
        },
      }
    })

    // Create book nodes
    const bookNodes: Node[] = books.map((book: any, index: number) => {
      // Count connection notes from this book
      const noteCount = connectionNotes.filter((note: any) => note.book_id === book.id).length

      return {
        id: `book-${book.id}`,
        type: 'book',
        position: {
          x: 500 + (index % 3) * 300,
          y: 50 + Math.floor(index / 3) * 200,
        },
        data: {
          label: book.title,
          author: book.author,
          noteCount,
        },
      }
    })

    // Create edges from notes to their books
    const noteToBookEdges: Edge[] = notesToUse.map((note: any) => ({
      id: `edge-note-${note.id}-book-${note.book_id}`,
      source: `note-${note.id}`,
      target: `book-${note.book_id}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#a855f7', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#a855f7',
      },
    }))

    // Create edges between linked notes
    const linkedNoteEdges: Edge[] = []
    const processedPairs = new Set<string>()

    notesToUse.forEach((note: any) => {
      if (note.linked_note_ids && Array.isArray(note.linked_note_ids)) {
        note.linked_note_ids.forEach((linkedId: string) => {
          // Create a unique key for this pair (sorted to avoid duplicates)
          const pairKey = [note.id, linkedId].sort().join('-')

          // Check if we've already processed this pair
          if (!processedPairs.has(pairKey)) {
            // Check if the linked note exists in our notes
            const linkedNote = notesToUse.find((n: any) => n.id === linkedId)
            if (linkedNote) {
              linkedNoteEdges.push({
                id: `link-${note.id}-${linkedId}`,
                source: `note-${note.id}`,
                target: `note-${linkedId}`,
                type: 'smoothstep',
                animated: false,
                style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#10b981',
                },
              })
              processedPairs.add(pairKey)
            }
          }
        })
      }
    })

    setNodes([...noteNodes, ...bookNodes])
    setEdges([...noteToBookEdges, ...linkedNoteEdges])
  }, [data, setNodes, setEdges])

  if (!data || (!data.books.length && !data.connectionNotes.length)) {
    return (
      <Card className="p-12 text-center">
        <Link2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No Knowledge Graph Yet</h3>
        <p className="text-muted-foreground">
          Start adding connection notes to your books to build your knowledge graph
        </p>
      </Card>
    )
  }

  return (
    <div className="w-full h-[700px] border rounded-lg overflow-hidden bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'book') return '#3b82f6'
            if (node.type === 'connection') return '#a855f7'
            return '#6b7280'
          }}
        />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
        <h4 className="font-semibold text-sm mb-3">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Books</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Connection Notes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-purple-500"></div>
            <span>Note-to-Book</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-500" style={{ strokeDasharray: '5 5' }}></div>
            <span>Linked Notes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
