import type { WorkExperience } from '@/types/cv'
import SectionTitle from './SectionTitle'

interface WorkExperienceProps {
  experiences: WorkExperience[]
}

export default function WorkExperience({ experiences }: WorkExperienceProps) {
  return (
    <div>
      <SectionTitle title="WORK EXPERIENCE" className="mb-4" />
      <div className="relative pl-5 space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="relative"
            data-cv-page-break="block"
          >
            <div className="absolute -left-[6px] top-1 h-3 w-3 rounded-full bg-teal-700" />
            <div className="ml-4">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <h4 className="font-bold text-[13px] text-slate-800">
                    {exp.company}
                    {exp.isNDA && <span className="text-slate-500"> (NDA)</span>}
                  </h4>
                  {exp.customer && (
                    <div className="text-[11px] text-slate-600 italic">
                      {exp.customer}
                    </div>
                  )}
                  <div className="text-[11px] text-slate-600">{exp.role}</div>
                </div>
                {exp.period && (
                  <div className="text-[11px] text-slate-600 whitespace-nowrap ml-4">
                    {exp.period}
                  </div>
                )}
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-700">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex} className="relative pl-4 leading-relaxed">
                    <span className="absolute left-0 top-[7px] h-2 w-2 rounded-full bg-slate-600" />
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
