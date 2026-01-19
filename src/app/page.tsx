'use client'

import { useState } from 'react'
import CVDocument from '@/components/cv/CVDocument'
import { cvData as initialCvData } from '@/data/cvData'
import type { CVData } from '@/types/cv'
import { exportToPDF } from '@/utils/pdfExport'

export default function Home() {
  const [cvData, setCvData] = useState<CVData>(initialCvData)
  const [showEditor, setShowEditor] = useState(false)
  const [editorCode, setEditorCode] = useState(
    JSON.stringify(cvData, null, 2)
  )

  const handleExportPDF = async () => {
    try {
      await exportToPDF()
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF. Please try again.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleUpdateCV = () => {
    try {
      const parsed = JSON.parse(editorCode)
      setCvData(parsed)
      alert('CV updated successfully!')
    } catch (error) {
      alert('Invalid JSON. Please check your code.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex gap-4 justify-center items-center print:hidden">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showEditor ? 'Hide Editor' : 'Show Editor'}
          </button>
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export to PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Print
          </button>
        </div>

        {showEditor && (
          <div className="mb-6 bg-white rounded-lg shadow-lg p-4 print:hidden">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit CV Data</h2>
              <button
                onClick={handleUpdateCV}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Update CV
              </button>
            </div>
            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded font-mono text-sm"
              spellCheck={false}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-4 print:shadow-none print:p-0">
          <CVDocument data={cvData} />
        </div>
      </div>
    </div>
  )
}
