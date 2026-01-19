import SectionTitle from './SectionTitle'

interface ProfileProps {
  profile: string
}

export default function Profile({ profile }: ProfileProps) {
  return (
    <div className="mb-6">
      <SectionTitle title="PROFILE" className="mb-3" />
      <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
        {profile}
      </p>
    </div>
  )
}
