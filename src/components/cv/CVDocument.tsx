'use client'

import type { CVData } from '@/types/cv'
import Header from './Header'
import Contact from './Contact'
import Skills from './Skills'
import Languages from './Languages'
import Education from './Education'
import Profile from './Profile'
import WorkExperience from './WorkExperience'

interface CVDocumentProps {
  data: CVData
}

export default function CVDocument({ data }: CVDocumentProps) {
  return (
    <div
      id="cv-document"
      className="bg-white w-[210mm] min-h-[297mm] mx-auto px-10 py-8 shadow-lg print:shadow-none print:p-6"
      style={{ pageBreakAfter: 'always' }}
    >
      <Header data={data} />
      
      <div className="grid grid-cols-[35%_1fr] gap-10">
        <div className="space-y-6 border-r-2 border-slate-300 pr-8">
          <Contact contact={data.contact} />
          <div className="border-t-2 border-slate-300 pt-4">
            <Skills skills={data.skills} />
          </div>
          <div className="border-t-2 border-slate-300 pt-4">
            <Languages languages={data.languages} />
          </div>
          <div className="border-t-2 border-slate-300 pt-4">
            <Education education={data.education} />
          </div>
        </div>
        
        <div className="pl-0">
          <Profile profile={data.profile} />
          <div className="border-t-2 border-slate-300 pt-4">
            <WorkExperience experiences={data.workExperience} />
          </div>
        </div>
      </div>
    </div>
  )
}
