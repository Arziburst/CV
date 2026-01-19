export type CropAreaPixels = { x: number; y: number; width: number; height: number }

export async function cropToSquareDataUrl(params: {
  imageSrc: string
  crop: CropAreaPixels
  outputSize: number
  mimeType?: 'image/jpeg' | 'image/png'
  quality?: number
}): Promise<string> {
  const { imageSrc, crop, outputSize, mimeType = 'image/jpeg', quality = 0.92 } = params

  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = outputSize
  canvas.height = outputSize

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas context is not available')
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize
  )

  if (mimeType === 'image/png') {
    return canvas.toDataURL('image/png')
  }

  return canvas.toDataURL('image/jpeg', quality)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous'
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}

