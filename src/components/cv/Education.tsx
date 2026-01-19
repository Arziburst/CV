import type { Education } from '@/types/cv'
import SectionTitle from './SectionTitle'

interface EducationProps {
  education: Education[]
}

export default function Education({ education }: EducationProps) {
  return (
    <div className="mb-6">
      <SectionTitle title="EDUCATION" className="mb-3" />
      <div className="space-y-3 text-[11px] text-slate-700">
        {education.map((edu, index) => (
          <div key={index} className="leading-relaxed">
            <div className="font-semibold">
              {edu.period} {edu.institution}:
            </div>
            <div className="ml-4 mt-1">{edu.degree}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
