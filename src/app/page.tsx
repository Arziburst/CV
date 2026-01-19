'use client'

import { useState } from 'react'
import CVDocument from '@/components/cv/CVDocument'
import CVJsonEditorModal from '@/components/editor/CVJsonEditorModal'
import { cvData as initialCvData } from '@/data/cvData'
import type { CVData } from '@/types/cv'
import { exportToPDF } from '@/utils/pdfExport'

export default function Home() {
  const [cvData, setCvData] = useState<CVData>(initialCvData)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const updateCvData = (next: CVData) => {
    setCvData(next)
  }

  const handlePhotoUrlChange = (url?: string) => {
    setCvData((prev) => {
      const next = { ...prev, photoUrl: url || undefined }
      return next
    })
  }

  const handleExportPDF = async () => {
    try {
      await exportToPDF()
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="sticky top-4 z-40 mb-6 print:hidden">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm">
            <div className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-3 py-2 text-sm font-semibold font-mono text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30"
                >
                  PDF Editor
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-3 py-2 text-sm font-semibold font-mono text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30"
                >
                  Export to PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 print:shadow-none print:p-0">
          <CVDocument data={cvData} onPhotoUrlChange={handlePhotoUrlChange} />
        </div>
      </div>

      <CVJsonEditorModal
        isOpen={isEditorOpen}
        data={cvData}
        onClose={() => setIsEditorOpen(false)}
        onApply={(next) => updateCvData(next)}
      />
    </div>
  )
}
