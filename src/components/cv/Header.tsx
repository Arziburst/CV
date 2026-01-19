import type { CVData } from '@/types/cv'

interface HeaderProps {
  data: CVData
}

export default function Header({ data }: HeaderProps) {
  return (
    <div className="relative h-40 mb-6">
      <div className="absolute left-0 top-0 h-24 w-[42%] bg-slate-200" />
      <div className="absolute left-0 top-20 h-10 w-full bg-teal-700" />

      <div className="absolute left-10 top-6 z-10">
        <div className="w-36 h-36 rounded-full bg-slate-300 overflow-hidden border-[6px] border-white shadow-lg">
          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                  fill="#64748B"
                />
                <path
                  d="M4 20.5c0-3.59 3.582-6.5 8-6.5s8 2.91 8 6.5V22H4v-1.5z"
                  fill="#64748B"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="absolute right-0 top-6 bg-white px-10 py-3">
        <h1 className="text-[44px] font-extrabold uppercase text-slate-700 tracking-wide leading-none">
          {data.name}
        </h1>
      </div>

      <div className="absolute right-0 top-[5.6rem] bg-teal-700 px-6 py-2">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white">
          {data.title}
        </h2>
      </div>
    </div>
  )
}
