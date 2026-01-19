import type { Skill } from '@/types/cv'
import SectionTitle from './SectionTitle'

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <div className="mb-6">
      <SectionTitle title="SKILLS" className="mb-3" />
      <ul className="space-y-1.5 text-[11px] text-slate-700">
        {skills.map((skill, index) => (
          <li key={index} className="relative pl-4 leading-relaxed">
            <span className="absolute left-0 top-[7px] h-2 w-2 rounded-full bg-slate-600" />
            {skill.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
