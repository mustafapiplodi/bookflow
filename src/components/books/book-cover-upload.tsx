'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, X, ImageIcon, MoreVertical, Trash2, Replace } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BookCoverUploadProps {
  bookId: string
  currentCoverUrl?: string | null
  onUploadSuccess?: (url: string) => void
}

// Recommended dimensions for book covers
const RECOMMENDED_WIDTH = 400
const RECOMMENDED_HEIGHT = 600
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function BookCoverUpload({ bookId, currentCoverUrl, onUploadSuccess }: BookCoverUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentCoverUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          // Calculate new dimensions maintaining aspect ratio
          let width = img.width
          let height = img.height
          const aspectRatio = width / height
          const targetRatio = RECOMMENDED_WIDTH / RECOMMENDED_HEIGHT

          // Resize to fit recommended dimensions
          if (aspectRatio > targetRatio) {
            // Image is wider than target ratio
            height = RECOMMENDED_HEIGHT
            width = height * aspectRatio
          } else {
            // Image is taller than target ratio
            width = RECOMMENDED_WIDTH
            height = width / aspectRatio
          }

          canvas.width = width
          canvas.height = height

          // Draw and resize image
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to create blob'))
              }
            },
            'image/jpeg',
            0.9 // Quality 90%
          )
        }

        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Please upload an image smaller than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Resize image
      const resizedBlob = await resizeImage(file)

      // Create file from blob
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${bookId}-${timestamp}.${fileExt}`

      // Delete old cover if exists
      if (currentCoverUrl) {
        const oldPath = currentCoverUrl.split('/').slice(-2).join('/')
        await supabase.storage.from('book-covers').remove([oldPath])
      }

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(fileName, resizedBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('book-covers')
        .getPublicUrl(uploadData.path)

      // Update book record
      const { error: updateError } = await supabase
        .from('books')
        .update({ cover_image_url: publicUrl })
        .eq('id', bookId)

      if (updateError) throw updateError

      setPreviewUrl(publicUrl)
      onUploadSuccess?.(publicUrl)

      toast.success('Your book cover has been uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload cover image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveCover = async () => {
    if (!currentCoverUrl) return

    try {
      setIsUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Delete from storage
      const oldPath = currentCoverUrl.split('/').slice(-2).join('/')
      await supabase.storage.from('book-covers').remove([oldPath])

      // Update book record
      const { error: updateError } = await supabase
        .from('books')
        .update({ cover_image_url: null })
        .eq('id', bookId)

      if (updateError) throw updateError

      setPreviewUrl(null)
      onUploadSuccess?.(null as any)

      toast.success('Book cover has been removed')
    } catch (error) {
      console.error('Remove error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to remove cover')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative group">
        <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Book cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" disabled={isUploading}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Replace Cover
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleRemoveCover}
                  className="text-destructive cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Cover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
          variant="outline"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Cover
            </>
          )}
        </Button>

        <div className="text-xs text-slate-500 dark:text-slate-400 text-center space-y-1">
          <p>Recommended: 400x600px (2:3 ratio)</p>
          <p>Max file size: 5MB</p>
          <p>Supported: JPEG, PNG, WebP</p>
        </div>
      </div>
    </div>
  )
}
