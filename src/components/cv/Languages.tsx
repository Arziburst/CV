import type { Language } from '@/types/cv'
import SectionTitle from './SectionTitle'

interface LanguagesProps {
  languages: Language[]
}

export default function Languages({ languages }: LanguagesProps) {
  return (
    <div className="mb-6">
      <SectionTitle title="LANGUAGES" className="mb-3" />
      <ul className="space-y-1.5 text-[11px] text-slate-700">
        {languages.map((lang, index) => (
          <li key={index} className="relative pl-4 leading-relaxed">
            <span className="absolute left-0 top-[7px] h-2 w-2 rounded-full bg-slate-600" />
            {lang.name} ({lang.level})
          </li>
        ))}
      </ul>
    </div>
  )
}
