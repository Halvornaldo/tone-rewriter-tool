export interface Author {
  id: string
  name: string
  bio: string
  avatar: string
  email?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    website?: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  postCount?: number
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children?: TableOfContentsItem[]
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: Author
  categories: Category[]
  tags: string[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    focusKeyword?: string
    canonicalUrl?: string
  }
  featuredImage?: {
    url: string
    alt: string
    caption?: string
  }
  publishedAt?: Date
  updatedAt: Date
  createdAt: Date
  status: 'draft' | 'published' | 'archived'
  readingTime: number
  viewCount?: number
  likeCount?: number
  featured?: boolean
  series?: {
    id: string
    name: string
    order: number
  }
  tableOfContents?: TableOfContentsItem[]
  relatedPosts?: BlogPost[]
  codeBlocks?: {
    language: string
    filename?: string
    code: string
  }[]
}

export interface BlogFilters {
  category?: string
  tag?: string
  author?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  search?: string
  dateRange?: {
    start?: Date
    end?: Date
  }
}

export interface BlogPostsResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface BlogSearchResult {
  id: string
  title: string
  slug: string
  excerpt: string
  categories: Category[]
  publishedAt?: Date
  relevanceScore: number
}

export interface BlogStats {
  totalPosts: number
  totalViews: number
  totalLikes: number
  averageReadingTime: number
  popularCategories: (Category & { postCount: number })[]
  recentPosts: BlogPost[]
  featuredPosts: BlogPost[]
}

export type BlogPostStatus = BlogPost['status']