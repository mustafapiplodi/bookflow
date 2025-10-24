'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link2,
  Heading2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write your note...',
  editable = true
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] p-4',
      },
    },
  })

  if (!editor) {
    return null
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      editor.chain().focus().setImage({ src: dataUrl }).run()
    }
    reader.readAsDataURL(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  if (!editable) {
    return (
      <div className="prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-slate-200' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-slate-200' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-slate-200' : ''}
        >
          <Link2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  )
}
