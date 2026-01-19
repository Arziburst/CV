import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF(filename = 'cv.pdf') {
  const element = document.getElementById('cv-document')
  if (!element) {
    throw new Error('CV document element not found')
  }

  if ('fonts' in document) {
    await (document as unknown as { fonts: { ready: Promise<void> } }).fonts.ready
  }

  const breakEls = Array.from(
    element.querySelectorAll<HTMLElement>('[data-cv-page-break="block"]')
  )

  const elementRect = element.getBoundingClientRect()

  const breakpointsCssPx = breakEls
    .map((el) => {
      const r = el.getBoundingClientRect()
      return Math.round(r.bottom - elementRect.top)
    })
    .filter((v) => Number.isFinite(v) && v > 0)
    .sort((a, b) => a - b)

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

  const pageWidthMm = pdf.internal.pageSize.getWidth()
  const pageHeightMm = pdf.internal.pageSize.getHeight()
  const marginMm = 5
  const contentWidthMm = pageWidthMm - marginMm * 2
  const contentHeightMm = pageHeightMm - marginMm * 2

  // When we draw the image at pageWidthMm, canvas.width maps to pageWidthMm.
  // So one page height in canvas pixels is:
  const pageHeightPx = Math.floor((canvas.width * contentHeightMm) / contentWidthMm)

  const scalePx = canvas.width / elementRect.width
  const breakpointsPx = breakpointsCssPx
    .map((v) => Math.floor(v * scalePx))
    .filter((v) => Number.isFinite(v) && v > 0 && v < canvas.height)
    .sort((a, b) => a - b)

  const minSliceHeightPx = Math.floor(pageHeightPx * 0.35)
  const overlapPx = Math.max(10, Math.floor(pageHeightPx * 0.02))
  const topTrimPx = Math.max(8, Math.floor(pageHeightPx * 0.01))

  let sliceTopPx = 0
  let pageIndex = 0
  while (sliceTopPx < canvas.height - 2) {
    const idealEnd = Math.min(canvas.height, sliceTopPx + pageHeightPx)

    let chosenEnd = idealEnd
    for (let i = breakpointsPx.length - 1; i >= 0; i -= 1) {
      const bp = breakpointsPx[i]
      if (bp <= sliceTopPx + minSliceHeightPx) continue
      if (bp <= idealEnd) {
        chosenEnd = bp
        break
      }
    }

    const isLastPage = chosenEnd >= canvas.height
    const paddedEnd = isLastPage
      ? canvas.height
      : Math.min(canvas.height, chosenEnd + overlapPx)
    const effectiveTop = pageIndex === 0 ? sliceTopPx : Math.min(canvas.height, sliceTopPx + topTrimPx)
    const sliceHeightPx = Math.max(1, paddedEnd - effectiveTop)

    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = sliceHeightPx

    const ctx = pageCanvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to create canvas context')
    }

    ctx.drawImage(
      canvas,
      0,
      effectiveTop,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      canvas.width,
      sliceHeightPx
    )

    const imgData = pageCanvas.toDataURL('image/png')
    const sliceHeightMm = (sliceHeightPx * contentWidthMm) / canvas.width

    if (pageIndex > 0) {
      pdf.addPage()
    }
    pdf.addImage(imgData, 'PNG', marginMm, marginMm, contentWidthMm, sliceHeightMm)

    // Start next page at the chosen breakpoint (not paddedEnd) to avoid duplicated lines.
    sliceTopPx = chosenEnd
    pageIndex += 1
  }

  pdf.save(filename)
}
