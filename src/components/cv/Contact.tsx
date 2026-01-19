import type { ContactInfo } from '@/types/cv'
import SectionTitle from './SectionTitle'

interface ContactProps {
  contact: ContactInfo
}

export default function Contact({ contact }: ContactProps) {
  return (
    <div className="mb-6">
      <SectionTitle title="CONTACT" className="mb-3" />
      <div className="space-y-2.5 text-[11px] text-slate-700">
        <div className="flex gap-3 leading-relaxed">
          <span className="mt-[5px] inline-block h-2 w-2 rounded-full bg-slate-600" />
          <span>{contact.phone}</span>
        </div>
        <div className="flex gap-3 leading-relaxed">
          <span className="mt-[5px] inline-block h-2 w-2 rounded-full bg-slate-600" />
          <span>{contact.email}</span>
        </div>
        {contact.linkedin && (
          <div className="flex gap-3 leading-relaxed">
            <span className="mt-[5px] inline-block h-2 w-2 rounded-full bg-slate-600" />
            <span>{contact.linkedin}</span>
          </div>
        )}
        {contact.github && (
          <div className="flex gap-3 leading-relaxed">
            <span className="mt-[5px] inline-block h-2 w-2 rounded-full bg-slate-600" />
            <span>{contact.github}</span>
          </div>
        )}
      </div>
    </div>
  )
}
