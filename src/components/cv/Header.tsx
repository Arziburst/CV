import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { CVData } from '@/types/cv'

interface HeaderProps {
  data: CVData
  onPhotoUrlChange?: (url?: string) => void
}

export default function Header({ data, onPhotoUrlChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const canEdit = Boolean(onPhotoUrlChange)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const openModal = () => {
    if (!canEdit) return
    setError(null)
    setUrlValue(data.photoUrl ?? '')
    setIsOpen(true)
  }

  const applyUrl = () => {
    if (!onPhotoUrlChange) return
    setError(null)
    const trimmed = urlValue.trim()
    if (!trimmed) {
      setError('Please enter an image URL.')
      return
    }

    try {
      const parsed = new URL(trimmed)
      if (!['http:', 'https:', 'data:'].includes(parsed.protocol)) {
        setError('Please use an http(s) or data URL.')
        return
      }
    } catch {
      setError('Please enter a valid URL.')
      return
    }

    onPhotoUrlChange(trimmed)
    setIsOpen(false)
  }

  const clearPhoto = () => {
    if (!onPhotoUrlChange) return
    onPhotoUrlChange(undefined)
    setIsOpen(false)
  }

  const onPickFile = () => {
    if (!canEdit) return
    setError(null)
    fileInputRef.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onPhotoUrlChange) return
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string' && result.startsWith('data:')) {
        onPhotoUrlChange(result)
        setIsOpen(false)
      } else {
        setError('Failed to read the file.')
      }
      e.target.value = ''
    }
    reader.onerror = () => {
      setError('Failed to read the file.')
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="relative h-40 mb-6">
      <div className="absolute left-0 top-0 h-24 w-[42%] bg-slate-200" />
      <div className="absolute left-0 top-20 h-10 w-full bg-teal-700" />

      <div className="absolute left-10 top-6 z-10">
        <button
          type="button"
          onClick={openModal}
          className={`group w-36 h-36 rounded-full bg-slate-300 overflow-hidden border-[6px] border-white shadow-lg relative focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40 ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
          aria-label={canEdit ? 'Edit photo' : 'Photo'}
        >
          {data.photoUrl ? (
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${data.photoUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                  fill="#64748B"
                />
                <path
                  d="M4 20.5c0-3.59 3.582-6.5 8-6.5s8 2.91 8 6.5V22H4v-1.5z"
                  fill="#64748B"
                />
              </svg>
            </div>
          )}
          {canEdit && (
            <div className="print:hidden absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          )}
          {canEdit && (
            <div className="print:hidden absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M14.06 9.02l.92.92L7.92 17H7v-.92l7.06-7.06z"
                  fill="currentColor"
                />
                <path
                  d="M16.85 3.15a1.5 1.5 0 012.12 0l1.88 1.88a1.5 1.5 0 010 2.12l-1.2 1.2-4-4 1.2-1.2z"
                  fill="currentColor"
                />
                <path
                  d="M3 21h18v-2H3v2z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </button>

        {canEdit && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        )}
      </div>

      <div className="absolute right-0 top-6 bg-white px-10 py-3">
        <h1 className="text-[44px] font-extrabold uppercase text-slate-700 tracking-wide leading-none">
          {data.name}
        </h1>
      </div>

      <div className="absolute right-0 top-[5.6rem] bg-teal-700 px-6 py-2">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white">
          {data.title}
        </h2>
      </div>

      {isOpen && (
        <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false)
            }}
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-800">
                  Update photo
                </div>
                <div className="text-sm text-slate-500">
                  Upload an image or paste an image URL.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center"
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onPickFile}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Choose file
                </button>
                {data.photoUrl && (
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Remove photo
                  </button>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-teal-500/20"
                    placeholder="https://example.com/photo.jpg"
                    inputMode="url"
                  />
                  <button
                    type="button"
                    onClick={applyUrl}
                    className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
                  >
                    Use URL
                  </button>
                </div>
                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
