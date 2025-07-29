export interface Technology {
  id: string
  name: string
  icon?: string
  color?: string
  category: 'frontend' | 'backend' | 'database' | 'tool' | 'mobile' | 'other'
}

export interface ProjectImage {
  id: string
  url: string
  alt: string
  caption?: string
  isPrimary?: boolean
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  technologies: Technology[]
  images: ProjectImage[]
  liveUrl?: string
  githubUrl?: string
  caseStudyUrl?: string
  featured: boolean
  status: 'completed' | 'in-progress' | 'archived'
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'library' | 'other'
  tags: string[]
  metrics?: {
    performance?: string
    users?: string
    uptime?: string
    other?: Record<string, string>
  }
  testimonial?: {
    content: string
    author: string
    role: string
    company?: string
    avatar?: string
  }
  timeline?: {
    start: Date
    end?: Date
    duration?: string
  }
  role?: string
  teamSize?: number
  challenges?: string[]
  solutions?: string[]
  learnings?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProjectFilters {
  category?: string
  technology?: string
  status?: string
  featured?: boolean
  search?: string
}

export interface ProjectsResponse {
  projects: Project[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export type ProjectStatus = Project['status']
export type ProjectCategory = Project['category']