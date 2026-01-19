interface SectionTitleProps {
  title: string
  className?: string
}

export default function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-600">
        {title}
      </h3>
      <div className="h-px flex-1 bg-slate-300" />
    </div>
  )
}

