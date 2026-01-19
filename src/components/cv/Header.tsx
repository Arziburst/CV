import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import type { CVData } from '@/types/cv'
import { cropToSquareDataUrl, type CropAreaPixels } from '@/utils/cropImage'

interface HeaderProps {
  data: CVData
  onPhotoUrlChange?: (url?: string) => void
}

export default function Header({ data, onPhotoUrlChange }: HeaderProps) {
  const clipId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropAreaPixels | null>(null)
  const [isSavingCrop, setIsSavingCrop] = useState(false)

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
    setPendingImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
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

    setPendingImageSrc(trimmed)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
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
        setPendingImageSrc(result)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
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

  const onCropComplete = (_: Area, areaPixels: Area) => {
    setCroppedAreaPixels({
      x: Math.round(areaPixels.x),
      y: Math.round(areaPixels.y),
      width: Math.round(areaPixels.width),
      height: Math.round(areaPixels.height),
    })
  }

  const saveCrop = async () => {
    if (!onPhotoUrlChange) return
    if (!pendingImageSrc) return
    if (!croppedAreaPixels) {
      setError('Please adjust the crop area.')
      return
    }

    setError(null)
    setIsSavingCrop(true)
    try {
      const output = await cropToSquareDataUrl({
        imageSrc: pendingImageSrc,
        crop: croppedAreaPixels,
        outputSize: 1024,
        mimeType: 'image/jpeg',
        quality: 0.95,
      })
      onPhotoUrlChange(output)
      setIsOpen(false)
    } catch {
      setError('Failed to process the image. If you used a URL, try uploading the file instead.')
    } finally {
      setIsSavingCrop(false)
    }
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
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              aria-label={data.name}
              role="img"
            >
              <defs>
                <clipPath id={clipId}>
                  <circle cx="50" cy="50" r="50" />
                </clipPath>
              </defs>
              <image
                href={data.photoUrl}
                xlinkHref={data.photoUrl}
                x="0"
                y="0"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
              />
            </svg>
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

      <div className="absolute right-0 top-20 h-10 flex items-center px-6">
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
              {pendingImageSrc ? (
                <div className="grid gap-3">
                  <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden">
                    <Cropper
                      image={pendingImageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-medium text-slate-700">
                      Zoom
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPendingImageSrc(null)
                        setError(null)
                      }}
                      className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                      disabled={isSavingCrop}
                    >
                      Back
                    </button>
                    <div className="flex items-center gap-3">
                      {data.photoUrl && (
                        <button
                          type="button"
                          onClick={clearPhoto}
                          className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                          disabled={isSavingCrop}
                        >
                          Remove photo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={saveCrop}
                        className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
                        disabled={isSavingCrop}
                      >
                        {isSavingCrop ? 'Saving...' : 'Save crop'}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600">{error}</div>
                  )}
                </div>
              ) : (
                <>
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
                        Crop URL
                      </button>
                    </div>
                    {error && (
                      <div className="text-sm text-red-600">{error}</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
