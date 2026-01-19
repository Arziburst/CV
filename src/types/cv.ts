export interface ContactInfo {
  phone: string
  email: string
  linkedin?: string
  github?: string
}

export interface Skill {
  name: string
}

export interface Language {
  name: string
  level: string
}

export interface Education {
  period: string
  institution: string
  degree: string
}

export interface WorkExperience {
  company: string
  customer?: string
  role: string
  period: string
  responsibilities: string[]
  isNDA?: boolean
}

export interface CVData {
  name: string
  title: string
  profile: string
  contact: ContactInfo
  skills: Skill[]
  languages: Language[]
  education: Education[]
  workExperience: WorkExperience[]
  photoUrl?: string
}
