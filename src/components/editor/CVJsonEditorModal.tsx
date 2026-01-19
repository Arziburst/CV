import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CVData } from '@/types/cv'

type PanelId =
  | 'full'
  | 'basics'
  | 'profile'
  | 'contact'
  | 'skills'
  | 'languages'
  | 'education'
  | 'workExperience'
  | 'photo'

const PANELS: Array<{ id: PanelId; label: string; description: string }> = [
  { id: 'full', label: 'Full JSON', description: 'Edit the complete config.' },
  { id: 'basics', label: 'Basics', description: 'Name and title.' },
  { id: 'profile', label: 'Profile', description: 'Summary section.' },
  { id: 'contact', label: 'Contact', description: 'Phone, email, links.' },
  { id: 'skills', label: 'Skills', description: 'Skills list.' },
  { id: 'languages', label: 'Languages', description: 'Languages list.' },
  { id: 'education', label: 'Education', description: 'Education list.' },
  {
    id: 'workExperience',
    label: 'Work experience',
    description: 'Timeline and responsibilities.',
  },
  { id: 'photo', label: 'Photo', description: 'photoUrl (optional).' },
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asOptionalString(value: unknown): string | undefined {
  const s = typeof value === 'string' ? value.trim() : ''
  return s ? s : undefined
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => (typeof v === 'string' ? v : '')).filter(Boolean)
}

function emptyCVData(): CVData {
  return {
    name: '',
    title: '',
    profile: '',
    contact: {
      phone: '',
      email: '',
      linkedin: '',
      github: '',
    },
    skills: [],
    languages: [],
    education: [],
    workExperience: [],
    photoUrl: undefined,
  }
}

function gptTemplateCvData(): CVData {
  return {
    name: 'YOUR FULL NAME',
    title: 'YOUR ROLE / TITLE',
    profile:
      'Write a short summary (2-4 sentences) about your experience, strengths, and the role you want.',
    contact: {
      phone: '+1 555 0100',
      email: 'name@example.com',
      linkedin: 'https://linkedin.com/in/your-handle',
      github: 'https://github.com/your-handle',
    },
    skills: [{ name: 'TypeScript' }, { name: 'React' }],
    languages: [{ name: 'English', level: 'B2' }],
    education: [
      {
        period: '2016 - 2020',
        institution: 'University name',
        degree: 'Degree / program',
      },
    ],
    workExperience: [
      {
        company: 'Company name',
        customer: 'Customer (optional)',
        role: 'Your role',
        period: 'Jan 2022 - Present',
        responsibilities: ['Achievement or responsibility #1', 'Bullet #2'],
        isNDA: false,
      },
    ],
    photoUrl: '',
  }
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'fixed'
  el.style.top = '0'
  el.style.left = '0'
  el.style.width = '1px'
  el.style.height = '1px'
  el.style.opacity = '0'
  el.style.pointerEvents = 'none'
  document.body.appendChild(el)

  el.focus()
  el.select()
  document.execCommand('copy')

  document.body.removeChild(el)
}

function normalizeCvData(input: unknown): CVData {
  if (!isRecord(input)) {
    throw new Error('JSON root must be an object.')
  }

  const contactRaw = isRecord(input.contact) ? input.contact : {}
  const skillsRaw = Array.isArray(input.skills) ? input.skills : []
  const languagesRaw = Array.isArray(input.languages) ? input.languages : []
  const educationRaw = Array.isArray(input.education) ? input.education : []
  const workRaw = Array.isArray(input.workExperience) ? input.workExperience : []

  return {
    name: asString(input.name),
    title: asString(input.title),
    profile: asString(input.profile),
    contact: {
      phone: asString(contactRaw.phone),
      email: asString(contactRaw.email),
      linkedin: asOptionalString(contactRaw.linkedin) ?? '',
      github: asOptionalString(contactRaw.github) ?? '',
    },
    skills: skillsRaw
      .map((s) => {
        if (typeof s === 'string') return { name: s }
        if (!isRecord(s)) return { name: '' }
        return { name: asString(s.name) }
      })
      .filter((s) => Boolean(s.name)),
    languages: languagesRaw
      .map((l) => {
        if (typeof l === 'string') return { name: l, level: '' }
        if (!isRecord(l)) return { name: '', level: '' }
        return { name: asString(l.name), level: asString(l.level) }
      })
      .filter((l) => Boolean(l.name)),
    education: educationRaw
      .map((e) => {
        if (!isRecord(e)) return { period: '', institution: '', degree: '' }
        return {
          period: asString(e.period),
          institution: asString(e.institution),
          degree: asString(e.degree),
        }
      })
      .filter((e) => Boolean(e.institution || e.degree || e.period)),
    workExperience: workRaw
      .map((w) => {
        if (!isRecord(w)) {
          return {
            company: '',
            customer: undefined,
            role: '',
            period: '',
            responsibilities: [],
            isNDA: undefined,
          }
        }
        return {
          company: asString(w.company),
          customer: asOptionalString(w.customer),
          role: asString(w.role),
          period: asString(w.period),
          responsibilities: asStringArray(w.responsibilities),
          isNDA: typeof w.isNDA === 'boolean' ? w.isNDA : undefined,
        }
      })
      .filter((w) => Boolean(w.company || w.role || w.period)),
    photoUrl: asOptionalString(input.photoUrl),
  }
}

function stringify(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function subsetForPanel(panel: PanelId, data: CVData): unknown {
  if (panel === 'full') return data
  if (panel === 'basics') return { name: data.name, title: data.title }
  if (panel === 'profile') return { profile: data.profile }
  if (panel === 'contact') return { contact: data.contact }
  if (panel === 'skills') return { skills: data.skills }
  if (panel === 'languages') return { languages: data.languages }
  if (panel === 'education') return { education: data.education }
  if (panel === 'workExperience') return { workExperience: data.workExperience }
  return { photoUrl: data.photoUrl ?? '' }
}

function applySubset(panel: PanelId, current: CVData, subset: unknown): CVData {
  if (panel === 'full') return normalizeCvData(subset)
  if (!isRecord(subset)) {
    throw new Error('Section JSON must be an object.')
  }
  const merged: Record<string, unknown> = { ...current, ...subset }
  return normalizeCvData(merged)
}

interface CVJsonEditorModalProps {
  isOpen: boolean
  data: CVData
  onClose: () => void
  onApply: (next: CVData) => void
}

export default function CVJsonEditorModal({
  isOpen,
  data,
  onClose,
  onApply,
}: CVJsonEditorModalProps) {
  const [activePanel, setActivePanel] = useState<PanelId>('full')
  const [draftData, setDraftData] = useState<CVData>(data)
  const [editorText, setEditorText] = useState<string>(stringify(data))
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const activeMeta = useMemo(
    () => PANELS.find((p) => p.id === activePanel) ?? PANELS[0],
    [activePanel]
  )

  const templateText = useMemo(() => stringify(gptTemplateCvData()), [])

  useEffect(() => {
    if (!isOpen) return
    setActivePanel('full')
    setDraftData(data)
    setEditorText(stringify(data))
    setError(null)
    setStatus(null)
    setToast(null)
  }, [isOpen, data])

  useEffect(() => {
    if (!isOpen) return
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  }, [isOpen, activePanel])

  const commitCurrentEditor = useCallback((): CVData | null => {
    try {
      const parsed = JSON.parse(editorText)
      const next = applySubset(activePanel, draftData, parsed)
      setDraftData(next)
      setError(null)
      return next
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Invalid JSON. Please check your input.'
      setError(message)
      return null
    }
  }, [activePanel, draftData, editorText])

  const handleApply = useCallback(() => {
    const committed = commitCurrentEditor()
    if (!committed) return
    onApply(committed)
    onClose()
  }, [commitCurrentEditor, onApply, onClose])

  const switchPanel = (nextPanel: PanelId) => {
    if (nextPanel === activePanel) return
    const committed = commitCurrentEditor()
    if (!committed) return
    setActivePanel(nextPanel)
    setEditorText(stringify(subsetForPanel(nextPanel, committed)))
    setError(null)
    setStatus(null)
  }

  const handleCopyTemplate = async () => {
    setStatus(null)
    try {
      await copyTextToClipboard(templateText)
      const message = 'Template JSON copied to clipboard. Paste it with Ctrl+V.'
      setStatus(message)
      setToast(message)
      window.setTimeout(() => setToast(null), 2200)
    } catch {
      const message = 'Failed to copy. Please copy the text manually.'
      setStatus(message)
      setToast(message)
      window.setTimeout(() => setToast(null), 2500)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
        e.preventDefault()
        handleApply()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, handleApply])

  if (!isOpen) return null

  return (
    <div className="print:hidden fixed inset-0 z-[60] flex items-center justify-center p-4 overscroll-contain">
      <div
        className="absolute inset-0 bg-black/50"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      />

      <div className="relative w-full max-w-6xl h-[84vh] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden overscroll-contain flex flex-col">
        {toast && (
          <div className="absolute left-1/2 top-3 -translate-x-1/2 z-10">
            <div className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-mono text-slate-900 shadow-sm">
              {toast}
            </div>
          </div>
        )}
        <div className="shrink-0 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 backdrop-blur px-4 py-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold font-mono text-slate-900">
              Editor
            </div>
            <div className="text-xs text-slate-500 truncate">
              {activeMeta.label} · {activeMeta.description}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="rounded-xl px-3 py-2 text-sm font-semibold font-mono bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30"
            >
              Copy template JSON
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-xl px-3 py-2 text-sm font-semibold font-mono bg-teal-700 text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20"
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[260px_1fr]">
          <div className="min-h-0 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50">
            <div className="h-full min-h-0 overflow-auto p-2">
              <div className="mb-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="text-xs font-semibold font-mono text-slate-900">
                  Quick workflow
                </div>
                <div className="mt-1 text-xs text-slate-600 leading-5">
                  Copy the template JSON, paste it into your GPT chat, ask it to fill
                  your real data, then paste the valid JSON back here (Full JSON) and
                  press Apply.
                </div>
              </div>
              <div className="grid gap-1">
                {PANELS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => switchPanel(p.id)}
                    className={`text-left rounded-xl px-3 py-2 transition-colors ${
                      activePanel === p.id
                        ? 'bg-white shadow-sm border border-slate-200'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    <div className="text-sm font-semibold font-mono text-slate-900">
                      {p.label}
                    </div>
                    <div className="text-xs text-slate-500">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden p-3">
              <textarea
                ref={textareaRef}
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                className="w-full h-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 leading-6 focus:outline-none focus:ring-4 focus:ring-teal-500/20 overscroll-contain"
                spellCheck={false}
              />
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-slate-500">
                  Tip: Press Ctrl+Enter to apply.
                </div>
                <div className="text-sm font-mono" aria-live="polite">
                  {error ? (
                    <span className="text-red-600">{error}</span>
                  ) : status ? (
                    <span className="text-emerald-700">{status}</span>
                  ) : (
                    <span className="text-slate-500">Ready</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

