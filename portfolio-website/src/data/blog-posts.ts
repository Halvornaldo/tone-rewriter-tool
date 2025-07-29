import { BlogPost, Author, Category } from '@/types/blog'

// Author data
const torAuthor: Author = {
  id: 'tor-dev',
  name: 'Tor',
  bio: 'Full-stack developer passionate about modern web technologies, performance optimization, and building scalable applications.',
  avatar: '/images/tor-avatar.jpg',
  email: 'tor@example.com',
  social: {
    github: 'https://github.com/tor-dev',
    linkedin: 'https://linkedin.com/in/tor-dev',
    twitter: 'https://twitter.com/tor_dev'
  }
}

// Categories
const categories: Category[] = [
  {
    id: 'react',
    name: 'React',
    slug: 'react',
    description: 'React.js development tips and best practices',
    color: '#61DAFB'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript development and advanced techniques',
    color: '#3178C6'
  },
  {
    id: 'performance',
    name: 'Performance',
    slug: 'performance',
    description: 'Web performance optimization strategies',
    color: '#FF6B35'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    slug: 'nextjs',
    description: 'Next.js framework development',
    color: '#000000'
  },
  {
    id: 'database',
    name: 'Database',
    slug: 'database',
    description: 'Database design and optimization',
    color: '#336791'
  },
  {
    id: 'api',
    name: 'API Development',
    slug: 'api',
    description: 'REST and GraphQL API development',
    color: '#FF6B6B'
  },
  {
    id: 'security',
    name: 'Security',
    slug: 'security',
    description: 'Web security best practices',
    color: '#4ECDC4'
  }
]

// Helper function to calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.split(' ').length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Blog posts data
const blogPosts: BlogPost[] = [
  {
    id: 'next-js-app-router-best-practices',
    title: 'Next.js App Router: Advanced Patterns and Performance Optimization',
    slug: 'next-js-app-router-best-practices',
    excerpt: 'Discover advanced patterns and performance optimization techniques for Next.js 13+ App Router, including streaming, parallel routes, and server components best practices.',
    content: `
# Next.js App Router: Advanced Patterns and Performance Optimization

The Next.js App Router represents a paradigm shift in how we build React applications. Since its stable release in Next.js 13, it has introduced powerful concepts like Server Components, streaming, and parallel routes. After working extensively with the App Router in production applications, I've discovered several patterns and optimizations that can significantly improve both developer experience and application performance.

## Understanding Server Components Architecture

Server Components are at the heart of the App Router's performance benefits. Unlike traditional React components that render on the client, Server Components execute on the server and send their rendered output to the browser.

\`\`\`tsx
// app/dashboard/page.tsx - Server Component by default
import { getUserData, getAnalytics } from '@/lib/api'

async function DashboardPage() {
  // These API calls happen on the server
  const [userData, analytics] = await Promise.all([
    getUserData(),
    getAnalytics()
  ])

  return (
    <div className="dashboard">
      <UserProfile user={userData} />
      <AnalyticsChart data={analytics} />
      <InteractiveWidget /> {/* This will be a Client Component */}
    </div>
  )
}
\`\`\`

The key insight here is that Server Components allow us to eliminate client-side API calls for initial page loads, reducing the JavaScript bundle size and improving Core Web Vitals.

## Implementing Streaming with Suspense

One of the most powerful features of the App Router is streaming. By wrapping slow-loading components in Suspense boundaries, we can deliver content progressively:

\`\`\`tsx
// app/dashboard/layout.tsx
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <nav>Dashboard Navigation</nav>
      <main>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          {children}
        </Suspense>
      </main>
      <aside>
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <DashboardSidebar />
        </Suspense>
      </aside>
    </div>
  )
}
\`\`\`

This pattern ensures that fast content renders immediately while slower components stream in as they become available.

## Parallel Routes for Complex UIs

Parallel routes allow multiple pages to render simultaneously in the same layout. This is particularly useful for dashboard-style applications:

\`\`\`tsx
// app/dashboard/@analytics/page.tsx
async function AnalyticsSlot() {
  const data = await getAnalyticsData()
  return <AnalyticsPanel data={data} />
}

// app/dashboard/@notifications/page.tsx  
async function NotificationsSlot() {
  const notifications = await getNotifications()
  return <NotificationsList notifications={notifications} />
}

// app/dashboard/layout.tsx
function Layout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  notifications: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8">{children}</div>
      <div className="col-span-4">
        {analytics}
        {notifications}
      </div>
    </div>
  )
}
\`\`\`

## Performance Optimization Strategies

### 1. Strategic Client Component Usage

The general rule is to keep components as Server Components unless they need interactivity. When you do need Client Components, push the \`"use client"\` directive as far down the component tree as possible:

\`\`\`tsx
// ❌ Don't do this - makes entire component tree client-side
"use client"
import { useState } from 'react'

function ProductPage({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  
  return (
    <div>
      <ProductHeader product={product} />
      <ProductImages images={product.images} />
      <VariantSelector 
        variants={product.variants}
        selected={selectedVariant}
        onSelect={setSelectedVariant}
      />
    </div>
  )
}

// ✅ Better - isolate interactivity
function ProductPage({ product }) {
  return (
    <div>
      <ProductHeader product={product} />
      <ProductImages images={product.images} />
      <InteractiveVariantSelector variants={product.variants} />
    </div>
  )
}
\`\`\`

### 2. Optimizing Data Fetching

Use the built-in fetch caching and deduplication features:

\`\`\`tsx
// Next.js automatically deduplicates and caches these requests
async function getProduct(id: string) {
  const res = await fetch(\`https://api.example.com/products/\${id}\`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  return res.json()
}

// Multiple components can call this without duplicate requests
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  return <ProductDisplay product={product} />
}
\`\`\`

### 3. Loading UI Patterns

Create sophisticated loading states that match your actual content:

\`\`\`tsx
// app/products/[id]/loading.tsx
function ProductLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="grid grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  )
}
\`\`\`

## Error Handling and Recovery

The App Router provides excellent error boundaries. Create meaningful error pages:

\`\`\`tsx
// app/products/[id]/error.tsx
'use client'

function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64">
      <h2 className="text-xl font-semibold mb-4">
        Something went wrong loading this product
      </h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  )
}
\`\`\`

## Key Takeaways

1. **Embrace Server Components**: They reduce JavaScript bundle size and improve initial page load performance
2. **Use Streaming Strategically**: Wrap slow components in Suspense to progressively enhance the user experience
3. **Optimize Data Fetching**: Leverage Next.js's built-in caching and deduplication
4. **Keep Client Components Minimal**: Push interactivity as far down the component tree as possible
5. **Create Meaningful Loading States**: Users appreciate feedback while content loads

The App Router might require a mental model shift, but the performance and developer experience benefits are substantial. By following these patterns, you'll build faster, more maintainable Next.js applications that provide excellent user experiences.

The future of React development is server-first, and the App Router is leading the way. Start experimenting with these patterns in your projects, and you'll quickly see the benefits in both performance metrics and user satisfaction.
    `,
    author: torAuthor,
    categories: [categories.find(c => c.id === 'nextjs')!, categories.find(c => c.id === 'react')!, categories.find(c => c.id === 'performance')!],
    tags: ['Next.js', 'React', 'Server Components', 'Performance', 'App Router', 'Streaming'],
    seo: {
      metaTitle: 'Next.js App Router: Advanced Patterns and Performance Optimization',
      metaDescription: 'Learn advanced Next.js App Router patterns including Server Components, streaming, and performance optimization techniques for modern React applications.',
      focusKeyword: 'Next.js App Router'
    },
    publishedAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-15'),
    createdAt: new Date('2024-10-15'),
    status: 'published',
    readingTime: 0, // Will be calculated
    featured: true
  },

  {
    id: 'typescript-advanced-patterns',
    title: 'TypeScript Advanced Patterns: Building Type-Safe APIs and Complex Utilities',
    slug: 'typescript-advanced-patterns',
    excerpt: 'Explore advanced TypeScript patterns including conditional types, template literal types, and utility type creation for building robust, type-safe applications.',
    content: `
# TypeScript Advanced Patterns: Building Type-Safe APIs and Complex Utilities

TypeScript has evolved from a simple type layer over JavaScript into a sophisticated type system capable of expressing complex relationships and constraints. After years of pushing TypeScript to its limits in production applications, I've discovered patterns that not only improve type safety but also enhance the developer experience significantly.

## Template Literal Types for API Route Safety

One of the most powerful features introduced in TypeScript 4.1 is template literal types. These allow us to create incredibly type-safe API clients:

\`\`\`typescript
// Define API routes with parameters
type ApiRoutes = {
  '/users': { method: 'GET'; response: User[] }
  '/users/{id}': { method: 'GET'; response: User; params: { id: string } }
  '/users/{id}/posts': { method: 'GET'; response: Post[]; params: { id: string } }
  '/posts': { method: 'POST'; body: CreatePostRequest; response: Post }
}

// Extract parameter names from route strings
type ExtractParams<T extends string> = 
  T extends \`\${infer _Start}{\${infer Param}}\${infer Rest}\`
    ? { [K in Param]: string } & ExtractParams<Rest>
    : {}

// Type-safe API client
class TypedApiClient {
  async request<T extends keyof ApiRoutes>(
    route: T,
    options: {
      params?: ExtractParams<T>
      body?: ApiRoutes[T] extends { body: infer B } ? B : never
    } = {}
  ): Promise<ApiRoutes[T]['response']> {
    let url = route as string
    
    // Replace parameters in URL
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url = url.replace(\`{\${key}}\`, value)
      })
    }

    const response = await fetch(url, {
      method: ApiRoutes[route]['method'],
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: { 'Content-Type': 'application/json' }
    })

    return response.json()
  }
}

// Usage with full type safety
const client = new TypedApiClient()

// ✅ TypeScript knows this returns User[]
const users = await client.request('/users')

// ✅ TypeScript enforces the id parameter
const user = await client.request('/users/{id}', { 
  params: { id: '123' } 
})

// ❌ TypeScript error: missing required params
const userPosts = await client.request('/users/{id}/posts') // Error!
\`\`\`

## Conditional Types for Smart Utility Functions

Conditional types allow us to create utility functions that adapt their behavior based on input types:

\`\`\`typescript
// Smart deep partial that preserves array structures
type SmartPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? SmartPartial<U>[]
    : T[P] extends object
    ? SmartPartial<T[P]>
    : T[P]
}

// Database update utility that only allows partial updates
type UpdateInput<T> = SmartPartial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

interface User {
  id: string
  name: string
  email: string
  profile: {
    bio: string
    avatar: string
    preferences: {
      theme: 'light' | 'dark'
      notifications: boolean
    }
  }
  posts: Post[]
  createdAt: Date
  updatedAt: Date
}

// Type-safe update function
async function updateUser(id: string, updates: UpdateInput<User>) {
  // Implementation here
  // TypeScript ensures only valid fields can be updated
}

// Usage examples
await updateUser('123', {
  name: 'New Name',
  profile: {
    preferences: {
      theme: 'dark' // ✅ Valid nested update
    }
  }
  // id: 'new-id' // ❌ Error: Cannot update id
})
\`\`\`

## Advanced Mapped Types for Form Validation

Creating type-safe form validation schemas becomes elegant with mapped types:

\`\`\`typescript
// Validation rule types
type ValidationRule<T> = {
  required?: boolean
  min?: T extends string ? number : T extends number ? number : never
  max?: T extends string ? number : T extends number ? number : never
  pattern?: T extends string ? RegExp : never
  custom?: (value: T) => string | null
}

// Generate validation schema type from data type
type ValidationSchema<T> = {
  [K in keyof T]: ValidationRule<T[K]>
}

// Form validation utility
class FormValidator<T extends Record<string, any>> {
  constructor(private schema: ValidationSchema<T>) {}

  validate(data: Partial<T>): { errors: Partial<Record<keyof T, string>>; isValid: boolean } {
    const errors: Partial<Record<keyof T, string>> = {}

    for (const [key, rule] of Object.entries(this.schema)) {
      const value = data[key as keyof T]
      const typedKey = key as keyof T

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[typedKey] = \`\${String(key)} is required\`
        continue
      }

      if (value !== undefined && rule.min && String(value).length < rule.min) {
        errors[typedKey] = \`\${String(key)} must be at least \${rule.min} characters\`
      }

      if (value !== undefined && rule.pattern && !rule.pattern.test(String(value))) {
        errors[typedKey] = \`\${String(key)} format is invalid\`
      }

      if (value !== undefined && rule.custom) {
        const customError = rule.custom(value)
        if (customError) {
          errors[typedKey] = customError
        }
      }
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    }
  }
}

// Usage with full type safety
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

const loginValidator = new FormValidator<LoginForm>({
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // min: 5 // ✅ Valid for string
    // min: 'test' // ❌ Error: must be number for string type
  },
  password: {
    required: true,
    min: 8,
    custom: (value) => {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Password must contain uppercase, lowercase, and number'
      }
      return null
    }
  },
  rememberMe: {
    // pattern: /test/ // ❌ Error: pattern not available for boolean
  }
})
\`\`\`

## Recursive Types for Nested Data Structures

TypeScript's recursive type capabilities shine when working with tree-like data structures:

\`\`\`typescript
// Generic tree node type
type TreeNode<T> = {
  value: T
  children?: TreeNode<T>[]
  parent?: TreeNode<T>
}

// Path utilities for nested objects
type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? \`\${K}.\${Path<T[K]>}\` | K
    : K
  : never

type PathValue<T, P extends string> = P extends \`\${infer K}.\${infer Rest}\`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never

// Type-safe deep object access
function getByPath<T, P extends Path<T>>(
  obj: T,
  path: P
): PathValue<T, P> | undefined {
  const keys = path.split('.')
  let current: any = obj

  for (const key of keys) {
    if (current == null) return undefined
    current = current[key]
  }

  return current
}

// Usage example
interface Config {
  database: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
  api: {
    baseUrl: string
    timeout: number
  }
}

const config: Config = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'admin',
      password: 'secret'
    }
  },
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  }
}

// ✅ TypeScript knows this returns string | undefined
const dbHost = getByPath(config, 'database.host')

// ✅ TypeScript knows this returns string | undefined  
const username = getByPath(config, 'database.credentials.username')

// ❌ TypeScript error: invalid path
const invalid = getByPath(config, 'database.invalid.path')
\`\`\`

## Performance Considerations and Best Practices

When working with advanced TypeScript patterns, keep these performance tips in mind:

### 1. Limit Recursion Depth
TypeScript has limits on type recursion. For deeply nested structures, consider flattening or limiting depth:

\`\`\`typescript
// Limit recursion depth to prevent TypeScript from giving up
type DeepPartial<T, Depth extends number = 5> = Depth extends 0
  ? T
  : {
      [P in keyof T]?: T[P] extends object
        ? DeepPartial<T[P], Prev<Depth>>
        : T[P]
    }

type Prev<N extends number> = [-1, 0, 1, 2, 3, 4, 5][N]
\`\`\`

### 2. Use Type Assertions Carefully
When TypeScript can't infer complex types, strategic type assertions can help:

\`\`\`typescript
// Sometimes TypeScript needs help with complex conditional types
function processApiResponse<T extends keyof ApiRoutes>(
  route: T,
  response: unknown
): ApiRoutes[T]['response'] {
  // Validate response structure here
  return response as ApiRoutes[T]['response']
}
\`\`\`

## Key Takeaways

1. **Template Literal Types**: Create incredibly type-safe APIs and string manipulation utilities
2. **Conditional Types**: Build adaptive utilities that change behavior based on input types  
3. **Mapped Types**: Generate complex type transformations from existing types
4. **Recursive Types**: Handle nested data structures with full type safety
5. **Performance Matters**: Be mindful of recursion depth and compilation time

Advanced TypeScript patterns enable us to catch more errors at compile time, provide better developer experience, and create more maintainable codebases. While these patterns might seem complex initially, they pay dividends in reduced runtime errors and improved code quality.

The key is to start simple and gradually introduce more advanced patterns as your team becomes comfortable with them. TypeScript's type system is incredibly powerful—learning to leverage it effectively is one of the best investments you can make as a developer.
    `,
    author: torAuthor,
    categories: [categories.find(c => c.id === 'typescript')!, categories.find(c => c.id === 'api')!],
    tags: ['TypeScript', 'Advanced Types', 'Template Literals', 'Conditional Types', 'Type Safety', 'Utility Types'],
    seo: {
      metaTitle: 'TypeScript Advanced Patterns: Building Type-Safe APIs and Complex Utilities',
      metaDescription: 'Master advanced TypeScript patterns including template literal types, conditional types, and recursive utilities for building robust applications.',
      focusKeyword: 'TypeScript Advanced Patterns'
    },
    publishedAt: new Date('2024-09-28'),
    updatedAt: new Date('2024-09-28'),
    createdAt: new Date('2024-09-28'),
    status: 'published',
    readingTime: 0,
    featured: true
  },

  {
    id: 'react-performance-optimization-guide',
    title: 'React Performance Optimization: From Rendering to Bundle Size',
    slug: 'react-performance-optimization-guide',
    excerpt: 'A comprehensive guide to React performance optimization covering re-renders, bundle splitting, memory management, and Core Web Vitals improvements.',
    content: `
# React Performance Optimization: From Rendering to Bundle Size

React applications can suffer from performance issues as they grow in complexity. After optimizing numerous React applications in production, I've developed a systematic approach to identifying and fixing performance bottlenecks. This guide covers everything from micro-optimizations to architectural changes that can dramatically improve your app's performance.

## Understanding React's Rendering Cycle

Before diving into optimizations, it's crucial to understand when and why React re-renders components. React re-renders occur when:

1. State changes (via useState, useReducer)
2. Props change
3. Parent component re-renders
4. Context value changes

Let's start with the most common performance issues and their solutions.

## Optimizing Re-renders with React.memo and useMemo

The most frequent performance issue in React apps is unnecessary re-renders. Here's how to identify and fix them:

\`\`\`tsx
// ❌ This component re-renders on every parent update
function ExpensiveUserCard({ user, onEdit }) {
  const formattedJoinDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>Joined: {formattedJoinDate}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  )
}

// ✅ Optimized version with memoization
const OptimizedUserCard = React.memo(function UserCard({ user, onEdit }) {
  // Memoize expensive date formatting
  const formattedJoinDate = useMemo(() => {
    return new Date(user.joinedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [user.joinedAt])

  // Memoize callback to prevent unnecessary re-renders of children
  const handleEdit = useCallback(() => {
    onEdit(user.id)
  }, [user.id, onEdit])

  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>Joined: {formattedJoinDate}</p>
      <button onClick={handleEdit}>Edit</button>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for complex props
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.avatar === nextProps.user.avatar &&
    prevProps.user.joinedAt === nextProps.user.joinedAt &&
    prevProps.onEdit === nextProps.onEdit
  )
})
\`\`\`

## Advanced List Virtualization

For large lists, virtualization is essential. Here's a custom hook for implementing windowing:

\`\`\`tsx
interface UseVirtualScrollOptions {
  itemCount: number
  itemHeight: number
  containerHeight: number
  overscan?: number
}

function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5
}: UseVirtualScrollOptions) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    itemCount - 1
  )

  const startIndex = Math.max(0, visibleStart - overscan)
  const endIndex = Math.min(itemCount - 1, visibleEnd + overscan)

  const totalHeight = itemCount * itemHeight
  const offsetY = startIndex * itemHeight

  const visibleItems = useMemo(() => {
    const items = []
    for (let i = startIndex; i <= endIndex; i++) {
      items.push(i)
    }
    return items
  }, [startIndex, endIndex])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    }
  }
}

// Usage in a component
function VirtualizedList({ items }: { items: any[] }) {
  const ITEM_HEIGHT = 60
  const CONTAINER_HEIGHT = 400

  const { visibleItems, totalHeight, offsetY, onScroll } = useVirtualScroll({
    itemCount: items.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT
  })

  return (
    <div
      style={{ height: CONTAINER_HEIGHT, overflow: 'auto' }}
      onScroll={onScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map((index) => (
            <div
              key={items[index].id}
              style={{ height: ITEM_HEIGHT }}
            >
              <UserCard user={items[index]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
\`\`\`

## Smart Bundle Splitting Strategies

Bundle splitting is crucial for performance. Here's how to implement intelligent code splitting:

\`\`\`tsx
// Route-based splitting (most common)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))

// Component-based splitting for heavy components
const ChartWidget = lazy(() => 
  import('./components/ChartWidget').then(module => ({
    default: module.ChartWidget
  }))
)

// Feature-based splitting with loading states
function FeatureLoader<T>({ 
  loader, 
  fallback = <div>Loading...</div> 
}: {
  loader: () => Promise<{ default: React.ComponentType<T> }>
  fallback?: React.ReactNode
}) {
  const LazyComponent = lazy(loader)
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  )
}

// Advanced: Conditional loading based on user permissions
function ConditionalFeature({ 
  hasPermission, 
  children 
}: { 
  hasPermission: boolean
  children: React.ReactNode 
}) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (hasPermission && !shouldLoad) {
      // Preload the component when permission is granted
      setShouldLoad(true)
    }
  }, [hasPermission, shouldLoad])

  if (!hasPermission) {
    return <div>Access denied</div>
  }

  if (!shouldLoad) {
    return <div>Loading permissions...</div>
  }

  return <>{children}</>
}
\`\`\`

## Memory Management and Leak Prevention

Memory leaks can severely impact performance. Here are patterns to prevent them:

\`\`\`tsx
// Custom hook for managing subscriptions
function useSubscription<T>(
  subscribe: (callback: (value: T) => void) => () => void,
  initialValue?: T
) {
  const [value, setValue] = useState<T | undefined>(initialValue)

  useEffect(() => {
    const unsubscribe = subscribe(setValue)
    return unsubscribe
  }, [subscribe])

  return value
}

// Cleanup timers and intervals
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const interval = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(interval)
  }, [delay])
}

// Cancel async operations on unmount
function useCancelablePromise() {
  const cancelRef = useRef<boolean>(false)

  useEffect(() => {
    return () => {
      cancelRef.current = true
    }
  }, [])

  const makeCancelable = useCallback(<T>(promise: Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      promise.then(
        value => {
          if (!cancelRef.current) {
            resolve(value)
          }
        },
        error => {
          if (!cancelRef.current) {
            reject(error)
          }
        }
      )
    })
  }, [])

  return makeCancelable
}
\`\`\`

## Optimizing Context Performance

Context can cause performance issues when not used carefully:

\`\`\`tsx
// ❌ This causes all consumers to re-render when any value changes
const AppContext = createContext({
  user: null,
  theme: 'light',
  notifications: [],
  updateUser: () => {},
  toggleTheme: () => {},
  addNotification: () => {}
})

// ✅ Split contexts by concern
const UserContext = createContext(null)
const ThemeContext = createContext('light')
const NotificationContext = createContext([])

// ✅ Optimize context providers with useMemo
function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    updateUser: setUser
  }), [user])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// ✅ Create selector hooks for granular subscriptions
function createContextSelector<T>(context: React.Context<T>) {
  return function useContextSelector<R>(
    selector: (value: T) => R,
    equalityFn: (a: R, b: R) => boolean = Object.is
  ): R {
    const contextValue = useContext(context)
    const [selectedValue, setSelectedValue] = useState(() => 
      selector(contextValue)
    )

    const savedSelector = useRef(selector)
    const savedEqualityFn = useRef(equalityFn)

    useLayoutEffect(() => {
      savedSelector.current = selector
      savedEqualityFn.current = equalityFn
    })

    useLayoutEffect(() => {
      const newValue = savedSelector.current(contextValue)
      if (!savedEqualityFn.current(selectedValue, newValue)) {
        setSelectedValue(newValue)
      }
    }, [contextValue, selectedValue])

    return selectedValue
  }
}
\`\`\`

## Core Web Vitals Optimization

Focus on the metrics that matter for user experience:

\`\`\`tsx
// Largest Contentful Paint (LCP) optimization
function HeroSection() {
  return (
    <section>
      {/* Preload critical images */}
      <link rel="preload" as="image" href="/hero-image.jpg" />
      
      {/* Use optimized image formats */}
      <picture>
        <source srcSet="/hero-image.webp" type="image/webp" />
        <source srcSet="/hero-image.avif" type="image/avif" />
        <img 
          src="/hero-image.jpg" 
          alt="Hero"
          loading="eager"
          width={1200}
          height={600}
        />
      </picture>
    </section>
  )
}

// Cumulative Layout Shift (CLS) prevention
function ImageWithPlaceholder({ src, alt, width, height }) {
  const [loaded, setLoaded] = useState(false)
  
  return (
    <div 
      style={{ 
        position: 'relative',
        width,
        height,
        backgroundColor: '#f0f0f0'
      }}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      {!loaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          Loading...
        </div>
      )}
    </div>
  )
}

// First Input Delay (FID) optimization
function useOptimizedEventHandler<T extends Event>(
  handler: (event: T) => void,
  deps: React.DependencyList
) {
  return useCallback((event: T) => {
    // Defer heavy computations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => handler(event))
    } else {
      setTimeout(() => handler(event), 0)
    }
  }, deps)
}
\`\`\`

## Performance Monitoring and Debugging

Set up monitoring to catch performance regressions:

\`\`\`tsx
// Performance monitoring hook
function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 16) { // Flag renders over 16ms
        console.warn(\`Slow render in \${componentName}: \${renderTime}ms\`)
      }
    }
  })
}

// Bundle size monitoring
function reportBundleSize() {
  if ('navigator' in window && 'connection' in navigator) {
    const connection = (navigator as any).connection
    
    console.log('Network info:', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    })
  }
}
\`\`\`

## Key Takeaways

1. **Profile First**: Use React DevTools Profiler to identify actual bottlenecks before optimizing
2. **Memoization Strategy**: Use React.memo, useMemo, and useCallback judiciously—not everywhere
3. **Bundle Splitting**: Implement route-based and feature-based code splitting
4. **List Optimization**: Virtualize large lists and use proper keys
5. **Memory Management**: Clean up subscriptions, timers, and async operations
6. **Context Optimization**: Split contexts by concern and use selector patterns
7. **Core Web Vitals**: Focus on LCP, FID, and CLS for user experience

Remember that premature optimization is the root of all evil. Always measure performance before and after optimizations to ensure they're actually beneficial. The React DevTools Profiler and browser DevTools are your best friends in this process.

Performance optimization is an iterative process. Start with the biggest impact changes (like bundle splitting and eliminating unnecessary re-renders) before moving to micro-optimizations. Your users—and your Core Web Vitals scores—will thank you.
    `,
    author: torAuthor,
    categories: [categories.find(c => c.id === 'react')!, categories.find(c => c.id === 'performance')!],
    tags: ['React', 'Performance', 'Optimization', 'Bundle Splitting', 'Core Web Vitals', 'Memoization'],
    seo: {
      metaTitle: 'React Performance Optimization: From Rendering to Bundle Size',
      metaDescription: 'Complete guide to React performance optimization covering re-renders, bundle splitting, memory management, and Core Web Vitals improvements.',
      focusKeyword: 'React Performance Optimization'
    },
    publishedAt: new Date('2024-09-12'),
    updatedAt: new Date('2024-09-12'),
    createdAt: new Date('2024-09-12'),
    status: 'published',
    readingTime: 0
  },

  {
    id: 'database-design-patterns-scaling',
    title: 'Database Design Patterns for Scaling Modern Applications',
    slug: 'database-design-patterns-scaling',
    excerpt: 'Explore advanced database design patterns including CQRS, event sourcing, sharding strategies, and multi-tenant architectures for scalable applications.',
    content: `
# Database Design Patterns for Scaling Modern Applications

As applications grow, database design becomes critical for maintaining performance and scalability. After architecting databases for applications serving millions of users, I've learned that the right patterns can make the difference between a system that scales gracefully and one that crumbles under load.

## Understanding the Scaling Challenge

Modern applications face unique database challenges:
- High read/write ratios (often 100:1 or higher)
- Complex data relationships requiring joins across large tables
- Multi-tenant architectures serving isolated data
- Real-time analytics alongside transactional workloads
- Global distribution requirements

Let's explore proven patterns that address these challenges.

## CQRS: Separating Reads from Writes

Command Query Responsibility Segregation (CQRS) is powerful for applications with complex read requirements:

\`\`\`typescript
// Command side - optimized for writes
interface WriteDatabase {
  users: {
    id: string
    email: string
    password_hash: string
    created_at: Date
    updated_at: Date
  }
  
  orders: {
    id: string
    user_id: string
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
    total: number
    created_at: Date
  }
  
  order_items: {
    id: string
    order_id: string
    product_id: string
    quantity: number
    price: number
  }
}

// Query side - optimized for reads
interface ReadDatabase {
  user_profiles: {
    id: string
    email: string
    full_name: string
    total_orders: number
    lifetime_value: number
    last_order_date: Date
  }
  
  order_summaries: {
    id: string
    user_email: string
    user_name: string
    status: string
    total: number
    item_count: number
    created_at: Date
    items: Array<{
      product_name: string
      quantity: number
      price: number
    }>
  }
}

// Command handlers - write to normalized tables
class OrderCommandHandler {
  async createOrder(command: CreateOrderCommand): Promise<void> {
    await this.writeDb.transaction(async (trx) => {
      const order = await trx('orders').insert({
        id: command.orderId,
        user_id: command.userId,
        status: 'pending',
        total: command.total,
        created_at: new Date()
      })

      await trx('order_items').insert(
        command.items.map(item => ({
          id: generateId(),
          order_id: command.orderId,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      )
    })

    // Emit event for read model updates
    await this.eventBus.publish(new OrderCreatedEvent(command))
  }
}

// Query handlers - read from denormalized views
class OrderQueryHandler {
  async getOrderSummary(orderId: string): Promise<OrderSummary> {
    // Single query instead of complex joins
    return await this.readDb('order_summaries')
      .where('id', orderId)
      .first()
  }

  async getUserOrderHistory(userId: string, limit = 20): Promise<OrderSummary[]> {
    return await this.readDb('order_summaries')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
  }
}
\`\`\`

## Event Sourcing for Audit and Recovery

Event sourcing stores all changes as immutable events, providing powerful audit trails and recovery capabilities:

\`\`\`typescript
// Event definitions
interface DomainEvent {
  id: string
  aggregateId: string
  aggregateType: string
  eventType: string
  eventData: any
  version: number
  timestamp: Date
  metadata?: any
}

interface UserRegisteredEvent extends DomainEvent {
  eventType: 'UserRegistered'
  eventData: {
    email: string
    hashedPassword: string
  }
}

interface UserEmailUpdatedEvent extends DomainEvent {
  eventType: 'UserEmailUpdated'
  eventData: {
    oldEmail: string
    newEmail: string
  }
}

// Event store implementation
class EventStore {
  async saveEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    await this.db.transaction(async (trx) => {
      // Optimistic concurrency control
      const currentVersion = await trx('event_streams')
        .where('aggregate_id', aggregateId)
        .max('version as maxVersion')
        .first()

      if (currentVersion?.maxVersion !== expectedVersion) {
        throw new ConcurrencyError('Aggregate was modified by another process')
      }

      // Insert events atomically
      await trx('event_streams').insert(
        events.map(event => ({
          id: event.id,
          aggregate_id: event.aggregateId,
          aggregate_type: event.aggregateType,
          event_type: event.eventType,
          event_data: JSON.stringify(event.eventData),
          version: event.version,
          timestamp: event.timestamp,
          metadata: event.metadata ? JSON.stringify(event.metadata) : null
        }))
      )
    })

    // Publish events for read model updates
    for (const event of events) {
      await this.eventBus.publish(event)
    }
  }

  async getEvents(aggregateId: string, fromVersion = 0): Promise<DomainEvent[]> {
    const rows = await this.db('event_streams')
      .where('aggregate_id', aggregateId)
      .where('version', '>', fromVersion)
      .orderBy('version')

    return rows.map(row => ({
      id: row.id,
      aggregateId: row.aggregate_id,
      aggregateType: row.aggregate_type,
      eventType: row.event_type,
      eventData: JSON.parse(row.event_data),
      version: row.version,
      timestamp: row.timestamp,
      metadata: row.metadata ? JSON.parse(row.metadata) : null
    }))
  }
}

// Aggregate reconstruction from events
class UserAggregate {
  private constructor(
    public readonly id: string,
    public email: string,
    public hashedPassword: string,
    public version: number,
    private uncommittedEvents: DomainEvent[] = []
  ) {}

  static async fromHistory(eventStore: EventStore, id: string): Promise<UserAggregate> {
    const events = await eventStore.getEvents(id)
    
    if (events.length === 0) {
      throw new Error(\`User \${id} not found\`)
    }

    let user: UserAggregate | null = null

    for (const event of events) {
      switch (event.eventType) {
        case 'UserRegistered':
          user = new UserAggregate(
            id,
            event.eventData.email,
            event.eventData.hashedPassword,
            event.version
          )
          break
          
        case 'UserEmailUpdated':
          if (user) {
            user.email = event.eventData.newEmail
            user.version = event.version
          }
          break
      }
    }

    return user!
  }

  updateEmail(newEmail: string): void {
    const event: UserEmailUpdatedEvent = {
      id: generateId(),
      aggregateId: this.id,
      aggregateType: 'User',
      eventType: 'UserEmailUpdated',
      eventData: {
        oldEmail: this.email,
        newEmail
      },
      version: this.version + 1,
      timestamp: new Date()
    }

    this.email = newEmail
    this.version++
    this.uncommittedEvents.push(event)
  }

  async save(eventStore: EventStore): Promise<void> {
    if (this.uncommittedEvents.length === 0) return

    await eventStore.saveEvents(
      this.id,
      this.uncommittedEvents,
      this.version - this.uncommittedEvents.length
    )

    this.uncommittedEvents = []
  }
}
\`\`\`

## Sharding Strategies for Horizontal Scaling

When vertical scaling reaches its limits, horizontal sharding becomes necessary:

\`\`\`typescript
// Sharding configuration
interface ShardConfig {
  shardKey: string
  shards: Array<{
    id: string
    connectionString: string
    keyRange: {
      min: string
      max: string
    }
  }>
}

class ShardedDatabase {
  private shards: Map<string, Database>
  private config: ShardConfig

  constructor(config: ShardConfig) {
    this.config = config
    this.shards = new Map()
    
    // Initialize shard connections
    config.shards.forEach(shard => {
      this.shards.set(shard.id, new Database(shard.connectionString))
    })
  }

  // Consistent hashing for shard selection
  private getShardId(key: string): string {
    const hash = this.hashFunction(key)
    
    for (const shard of this.config.shards) {
      if (hash >= shard.keyRange.min && hash <= shard.keyRange.max) {
        return shard.id
      }
    }
    
    throw new Error(\`No shard found for key: \${key}\`)
  }

  private hashFunction(key: string): string {
    // Use consistent hashing algorithm (e.g., SHA-256)
    return crypto.createHash('sha256').update(key).digest('hex')
  }

  // Sharded operations
  async findUser(userId: string): Promise<User | null> {
    const shardId = this.getShardId(userId)
    const shard = this.shards.get(shardId)!
    
    return await shard('users').where('id', userId).first()
  }

  async findUsersByRegion(region: string): Promise<User[]> {
    // Cross-shard query - use map-reduce pattern
    const promises = Array.from(this.shards.values()).map(shard =>
      shard('users').where('region', region)
    )

    const results = await Promise.all(promises)
    return results.flat()
  }

  // Distributed transactions using 2-phase commit
  async transferBalance(fromUserId: string, toUserId: string, amount: number): Promise<void> {
    const fromShardId = this.getShardId(fromUserId)
    const toShardId = this.getShardId(toUserId)

    if (fromShardId === toShardId) {
      // Same shard - use local transaction
      const shard = this.shards.get(fromShardId)!
      await shard.transaction(async (trx) => {
        await trx('users')
          .where('id', fromUserId)
          .decrement('balance', amount)
          
        await trx('users')
          .where('id', toUserId)
          .increment('balance', amount)
      })
    } else {
      // Cross-shard transaction - implement 2PC
      await this.distributedTransaction([fromShardId, toShardId], async (shards) => {
        await shards[fromShardId]('users')
          .where('id', fromUserId)
          .decrement('balance', amount)
          
        await shards[toShardId]('users')
          .where('id', toUserId)
          .increment('balance', amount)
      })
    }
  }

  private async distributedTransaction(
    shardIds: string[],
    operation: (shards: Record<string, Database>) => Promise<void>
  ): Promise<void> {
    const transactions: Record<string, any> = {}
    const shardConnections: Record<string, Database> = {}

    try {
      // Phase 1: Prepare
      for (const shardId of shardIds) {
        const shard = this.shards.get(shardId)!
        transactions[shardId] = await shard.transaction()
        shardConnections[shardId] = transactions[shardId]
      }

      await operation(shardConnections)

      // Phase 2: Commit
      for (const trx of Object.values(transactions)) {
        await trx.commit()
      }
    } catch (error) {
      // Rollback all transactions
      for (const trx of Object.values(transactions)) {
        await trx.rollback()
      }
      throw error
    }
  }
}
\`\`\`

## Multi-Tenant Architecture Patterns

Supporting multiple tenants efficiently requires careful schema design:

\`\`\`sql
-- Pattern 1: Shared Database, Shared Schema with Tenant ID
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- Pattern 2: Shared Database, Separate Schemas
CREATE SCHEMA tenant_123;
CREATE TABLE tenant_123.users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pattern 3: Separate Databases (highest isolation)
-- Each tenant gets their own database
\`\`\`

\`\`\`typescript
// Multi-tenant data access layer
interface TenantContext {
  tenantId: string
  schemaName?: string
  databaseName?: string
}

class MultiTenantRepository {
  constructor(
    private connectionPool: DatabaseConnectionPool,
    private isolationStrategy: 'shared-schema' | 'separate-schema' | 'separate-database'
  ) {}

  private async getConnection(context: TenantContext): Promise<Database> {
    switch (this.isolationStrategy) {
      case 'shared-schema':
        return this.connectionPool.getConnection()
        
      case 'separate-schema':
        const conn = this.connectionPool.getConnection()
        await conn.raw(\`SET search_path TO \${context.schemaName}\`)
        return conn
        
      case 'separate-database':
        return this.connectionPool.getConnection(context.databaseName!)
    }
  }

  async findUsers(context: TenantContext, filters: any = {}): Promise<User[]> {
    const db = await this.getConnection(context)
    
    let query = db('users')
    
    // Add tenant filtering for shared schema
    if (this.isolationStrategy === 'shared-schema') {
      query = query.where('tenant_id', context.tenantId)
    }
    
    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.where(key, value)
    })
    
    return await query
  }

  async createUser(context: TenantContext, userData: CreateUserData): Promise<User> {
    const db = await this.getConnection(context)
    
    const user = {
      id: generateId(),
      ...userData,
      ...(this.isolationStrategy === 'shared-schema' && { tenant_id: context.tenantId }),
      created_at: new Date()
    }
    
    await db('users').insert(user)
    return user
  }
}

// Tenant-aware service layer
class UserService {
  constructor(private repository: MultiTenantRepository) {}

  async getUsers(tenantId: string, filters?: any): Promise<User[]> {
    const context: TenantContext = {
      tenantId,
      schemaName: \`tenant_\${tenantId}\`,
      databaseName: \`tenant_\${tenantId}_db\`
    }
    
    return await this.repository.findUsers(context, filters)
  }
}
\`\`\`

## Caching Strategies for Database Performance

Implement multi-level caching to reduce database load:

\`\`\`typescript
class CachedRepository {
  constructor(
    private database: Database,
    private redis: Redis,
    private memoryCache: LRUCache<string, any>
  ) {}

  async getUser(id: string): Promise<User | null> {
    // L1: Memory cache (fastest)
    const memoryCacheKey = \`user:\${id}\`
    let user = this.memoryCache.get(memoryCacheKey)
    if (user) {
      return user
    }

    // L2: Redis cache
    const redisCacheKey = \`user:\${id}\`
    const cached = await this.redis.get(redisCacheKey)
    if (cached) {
      user = JSON.parse(cached)
      this.memoryCache.set(memoryCacheKey, user)
      return user
    }

    // L3: Database
    user = await this.database('users').where('id', id).first()
    if (user) {
      // Cache in both levels
      this.memoryCache.set(memoryCacheKey, user)
      await this.redis.setex(redisCacheKey, 3600, JSON.stringify(user))
    }

    return user
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    await this.database('users').where('id', id).update(updates)
    
    // Invalidate caches
    this.memoryCache.delete(\`user:\${id}\`)
    await this.redis.del(\`user:\${id}\`)
    
    // Could also update cache with new data instead of invalidating
  }

  // Cache warming for predictable access patterns
  async warmUserCache(userIds: string[]): Promise<void> {
    const users = await this.database('users').whereIn('id', userIds)
    
    const pipeline = this.redis.pipeline()
    users.forEach(user => {
      const key = \`user:\${user.id}\`
      pipeline.setex(key, 3600, JSON.stringify(user))
      this.memoryCache.set(key, user)
    })
    
    await pipeline.exec()
  }
}
\`\`\`

## Key Takeaways

1. **CQRS**: Separate read and write models for complex applications with high read ratios
2. **Event Sourcing**: Store all changes as events for audit trails and recovery capabilities
3. **Sharding**: Use consistent hashing and plan for cross-shard operations
4. **Multi-Tenancy**: Choose isolation strategy based on security and performance requirements
5. **Caching**: Implement multi-level caching with proper invalidation strategies
6. **Monitoring**: Track query performance, connection pool usage, and cache hit rates

Database design patterns should be chosen based on your specific requirements. Start simple and evolve your architecture as your application grows. The key is to plan for scale from the beginning while avoiding over-engineering for problems you don't yet have.

Remember that each pattern comes with tradeoffs. CQRS adds complexity but improves read performance. Event sourcing provides audit capabilities but increases storage requirements. Sharding enables horizontal scaling but complicates queries. Choose patterns that align with your application's specific needs and growth trajectory.
    `,
    author: torAuthor,
    categories: [categories.find(c => c.id === 'database')!, categories.find(c => c.id === 'performance')!],
    tags: ['Database Design', 'CQRS', 'Event Sourcing', 'Sharding', 'Multi-Tenant', 'Scaling', 'Architecture'],
    seo: {
      metaTitle: 'Database Design Patterns for Scaling Modern Applications',
      metaDescription: 'Learn advanced database design patterns including CQRS, event sourcing, sharding strategies, and multi-tenant architectures for scalable applications.',
      focusKeyword: 'Database Design Patterns'
    },
    publishedAt: new Date('2024-08-25'),
    updatedAt: new Date('2024-08-25'),
    createdAt: new Date('2024-08-25'),
    status: 'published',
    readingTime: 0
  },

  {
    id: 'api-security-best-practices',
    title: 'API Security: Beyond Authentication - Advanced Protection Strategies',
    slug: 'api-security-best-practices',
    excerpt: 'Comprehensive guide to API security covering authentication, authorization, rate limiting, input validation, and protection against common vulnerabilities.',
    content: `
# API Security: Beyond Authentication - Advanced Protection Strategies

API security is more critical than ever as APIs become the backbone of modern applications. After securing APIs handling millions of requests per day, I've learned that effective API security requires multiple layers of protection, from basic authentication to sophisticated threat detection systems.

## The Multi-Layered Security Approach

API security isn't just about authentication. It requires a comprehensive strategy:

1. **Network Security** - Transport encryption, IP filtering
2. **Authentication & Authorization** - Who can access what
3. **Input Validation** - Protecting against injection attacks  
4. **Rate Limiting** - Preventing abuse and DoS attacks
5. **Monitoring & Logging** - Detecting threats in real-time
6. **Data Protection** - Encryption and PII handling

Let's dive deep into each layer with practical implementations.

## Advanced Authentication Patterns

While JWT tokens are common, there are more secure approaches for different scenarios:

\`\`\`typescript
// Secure JWT implementation with refresh tokens
interface TokenPair {
  accessToken: string
  refreshToken: string
}

interface JWTPayload {
  sub: string  // user ID
  iat: number  // issued at
  exp: number  // expires at  
  scope: string[]  // permissions
  jti: string  // unique token ID
}

class SecureTokenService {
  private blacklistedTokens = new Set<string>()
  
  async generateTokenPair(userId: string, scope: string[]): Promise<TokenPair> {
    const tokenId = generateSecureId()
    
    const payload: JWTPayload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      scope,
      jti: tokenId
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      algorithm: 'HS256'
    })

    // Refresh token - longer lived, stored securely
    const refreshToken = await this.createRefreshToken(userId, tokenId)
    
    return { accessToken, refreshToken }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
    const storedToken = await this.redis.get(\`refresh:\${refreshToken}\`)
    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const { userId, scope, tokenId } = JSON.parse(storedToken)
    
    // Invalidate old refresh token (one-time use)
    await this.redis.del(\`refresh:\${refreshToken}\`)
    
    // Generate new token pair
    return this.generateTokenPair(userId, scope)
  }

  async blacklistToken(tokenId: string): Promise<void> {
    this.blacklistedTokens.add(tokenId)
    // Store in Redis with TTL matching token expiry
    await this.redis.setex(\`blacklist:\${tokenId}\`, 900, 'true')
  }

  async validateToken(token: string): Promise<JWTPayload | null> {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
      
      // Check blacklist
      if (this.blacklistedTokens.has(payload.jti) || 
          await this.redis.exists(\`blacklist:\${payload.jti}\`)) {
        return null
      }

      return payload
    } catch (error) {
      return null
    }
  }

  private async createRefreshToken(userId: string, tokenId: string): Promise<string> {
    const refreshToken = generateSecureId(32)
    const expiry = 7 * 24 * 60 * 60 // 7 days
    
    await this.redis.setex(
      \`refresh:\${refreshToken}\`,
      expiry,
      JSON.stringify({ userId, tokenId, scope: [] })
    )
    
    return refreshToken
  }
}
\`\`\`

## Fine-Grained Authorization with RBAC

Role-Based Access Control (RBAC) provides granular permission management:

\`\`\`typescript
interface Permission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

interface Role {
  id: string
  name: string
  permissions: Permission[]
}

interface User {
  id: string
  roles: Role[]
}

class AuthorizationService {
  async checkPermission(
    user: User,
    resource: string,
    action: string,
    context: Record<string, any> = {}
  ): Promise<boolean> {
    for (const role of user.roles) {
      for (const permission of role.permissions) {
        if (this.matchesPermission(permission, resource, action, context)) {
          return true
        }
      }
    }
    return false
  }

  private matchesPermission(
    permission: Permission,
    resource: string,
    action: string,
    context: Record<string, any>
  ): boolean {
    // Check resource and action match
    if (!this.matchesPattern(permission.resource, resource) ||
        !this.matchesPattern(permission.action, action)) {
      return false
    }

    // Check conditions if present
    if (permission.conditions) {
      return this.evaluateConditions(permission.conditions, context)
    }

    return true
  }

  private matchesPattern(pattern: string, value: string): boolean {
    // Support wildcards: users:* matches users:read, users:write
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1)
      return value.startsWith(prefix)
    }
    return pattern === value
  }

  private evaluateConditions(
    conditions: Record<string, any>,
    context: Record<string, any>
  ): boolean {
    for (const [key, expectedValue] of Object.entries(conditions)) {
      const actualValue = context[key]
      
      if (typeof expectedValue === 'object' && expectedValue.operator) {
        if (!this.evaluateOperator(actualValue, expectedValue)) {
          return false
        }
      } else if (actualValue !== expectedValue) {
        return false
      }
    }
    return true
  }

  private evaluateOperator(actualValue: any, condition: any): boolean {
    switch (condition.operator) {
      case 'eq': return actualValue === condition.value
      case 'neq': return actualValue !== condition.value
      case 'gt': return actualValue > condition.value
      case 'gte': return actualValue >= condition.value
      case 'lt': return actualValue < condition.value
      case 'lte': return actualValue <= condition.value
      case 'in': return condition.value.includes(actualValue)
      case 'contains': return actualValue.includes(condition.value)
      default: return false
    }
  }
}

// Authorization middleware
function authorize(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user // Set by authentication middleware
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const context = {
      userId: user.id,
      organizationId: req.params.organizationId,
      ...req.query,
      ...req.params
    }

    const hasPermission = await authService.checkPermission(
      user,
      resource,
      action,
      context
    )

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

// Usage in routes
app.get('/api/users/:id', 
  authenticate,
  authorize('users', 'read'),
  getUserController
)

app.post('/api/organizations/:organizationId/projects',
  authenticate,
  authorize('projects', 'create'),
  createProjectController
)
\`\`\`

## Advanced Rate Limiting Strategies

Implement sophisticated rate limiting beyond simple request counting:

\`\`\`typescript
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator: (req: Request) => string
  skipSuccessful?: boolean
  skipFailed?: boolean
}

class AdvancedRateLimiter {
  constructor(private redis: Redis) {}

  // Sliding window rate limiter
  async slidingWindowRateLimit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const windowStart = now - windowMs

    const pipeline = this.redis.pipeline()
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart)
    
    // Count current requests in window
    pipeline.zcard(key)
    
    // Add current request
    pipeline.zadd(key, now, \`\${now}-\${Math.random()}\`)
    
    // Set expiry
    pipeline.expire(key, Math.ceil(windowMs / 1000))

    const results = await pipeline.exec()
    const currentCount = results[1][1] as number

    if (currentCount >= limit) {
      // Remove the request we just added since it's denied
      await this.redis.zpopmax(key)
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: now + windowMs
      }
    }

    return {
      allowed: true,
      remaining: limit - currentCount - 1,
      resetTime: now + windowMs
    }
  }

  // Token bucket rate limiter for burst handling
  async tokenBucketRateLimit(
    key: string,
    capacity: number,
    refillRate: number,
    tokensRequested = 1
  ): Promise<{ allowed: boolean; tokensRemaining: number }> {
    const now = Date.now()
    const bucketKey = \`bucket:\${key}\`

    const script = \`
      local bucket = redis.call('HMGET', KEYS[1], 'tokens', 'lastRefill')
      local tokens = tonumber(bucket[1]) or ARGV[2]
      local lastRefill = tonumber(bucket[2]) or ARGV[4]
      
      local now = tonumber(ARGV[4])
      local capacity = tonumber(ARGV[2])
      local refillRate = tonumber(ARGV[3])
      local tokensRequested = tonumber(ARGV[1])
      
      -- Calculate tokens to add based on time elapsed
      local timePassed = (now - lastRefill) / 1000
      local tokensToAdd = math.floor(timePassed * refillRate)
      
      -- Update token count, capped at capacity
      tokens = math.min(capacity, tokens + tokensToAdd)
      
      if tokens >= tokensRequested then
        tokens = tokens - tokensRequested
        redis.call('HMSET', KEYS[1], 'tokens', tokens, 'lastRefill', now)
        redis.call('EXPIRE', KEYS[1], 3600)
        return {1, tokens}
      else
        redis.call('HMSET', KEYS[1], 'tokens', tokens, 'lastRefill', now)
        redis.call('EXPIRE', KEYS[1], 3600)
        return {0, tokens}
      end
    \`

    const result = await this.redis.eval(
      script,
      1,
      bucketKey,
      tokensRequested.toString(),
      capacity.toString(),
      refillRate.toString(),
      now.toString()
    ) as [number, number]

    return {
      allowed: result[0] === 1,
      tokensRemaining: result[1]
    }
  }

  // Adaptive rate limiting based on response times
  async adaptiveRateLimit(
    key: string,
    baseLimit: number,
    responseTime: number
  ): Promise<{ allowed: boolean; currentLimit: number }> {
    const metricsKey = \`metrics:\${key}\`
    
    // Track average response time
    await this.redis.lpush(\`\${metricsKey}:response_times\`, responseTime)
    await this.redis.ltrim(\`\${metricsKey}:response_times\`, 0, 99) // Keep last 100

    const responseTimes = await this.redis.lrange(\`\${metricsKey}:response_times\`, 0, -1)
    const avgResponseTime = responseTimes.reduce((sum, time) => sum + parseFloat(time), 0) / responseTimes.length

    // Adjust limit based on performance
    let adjustedLimit = baseLimit
    if (avgResponseTime > 1000) { // If avg response > 1s
      adjustedLimit = Math.floor(baseLimit * 0.5) // Reduce limit by 50%
    } else if (avgResponseTime < 200) { // If avg response < 200ms
      adjustedLimit = Math.floor(baseLimit * 1.5) // Increase limit by 50%
    }

    const result = await this.slidingWindowRateLimit(key, adjustedLimit, 60000)
    
    return {
      allowed: result.allowed,
      currentLimit: adjustedLimit
    }
  }
}

// Rate limiting middleware
function rateLimitMiddleware(config: RateLimitConfig) {
  const limiter = new AdvancedRateLimiter(redis)
  
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = config.keyGenerator(req)
    
    const result = await limiter.slidingWindowRateLimit(
      key,
      config.maxRequests,
      config.windowMs
    )

    res.set({
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
    })

    if (!result.allowed) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      })
    }

    next()
  }
}
\`\`\`

## Input Validation and Sanitization

Protect against injection attacks with comprehensive input validation:

\`\`\`typescript
import Joi from 'joi'
import DOMPurify from 'isomorphic-dompurify'

// Custom Joi extensions for security
const secureJoi = Joi.extend({
  type: 'string',
  base: Joi.string(),
  messages: {
    'string.noSqlInjection': 'Input contains potential SQL injection patterns',
    'string.noXss': 'Input contains potential XSS patterns',
    'string.sanitized': 'Input has been sanitized'
  },
  rules: {
    noSqlInjection: {
      validate(value, helpers) {
        const sqlPatterns = [
          /('|(\\'))|(;)|(\\|)|(\*)|(%)|(<)|(>)|(\{)|(\})/i,
          /((\%3D)|(=))[^\n]*((\%27)|(\')|((\%3C)|<)|((\%3E)|>))/i,
          /w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
          /((\%27)|(\'))union/i
        ]
        
        for (const pattern of sqlPatterns) {
          if (pattern.test(value)) {
            return { value, errors: helpers.error('string.noSqlInjection') }
          }
        }
        
        return value
      }
    },
    
    sanitizeHtml: {
      validate(value, helpers) {
        const sanitized = DOMPurify.sanitize(value, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
          ALLOWED_ATTR: []
        })
        
        if (sanitized !== value) {
          return { 
            value: sanitized, 
            errors: helpers.message({ custom: 'Input was sanitized for security' })
          }
        }
        
        return sanitized
      }
    }
  }
})

// Comprehensive validation schemas
const schemas = {
  createUser: secureJoi.object({
    email: secureJoi.string()
      .email()
      .max(255)
      .lowercase()
      .required(),
    
    password: secureJoi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character'
      }),
    
    name: secureJoi.string()
      .max(100)
      .noSqlInjection()
      .sanitizeHtml()
      .required(),
    
    bio: secureJoi.string()
      .max(500)
      .sanitizeHtml()
      .optional()
  }),

  updateProfile: secureJoi.object({
    name: secureJoi.string()
      .max(100)
      .noSqlInjection()
      .sanitizeHtml()
      .optional(),
    
    bio: secureJoi.string()
      .max(500)
      .sanitizeHtml()
      .optional(),
    
    website: secureJoi.string()
      .uri({ scheme: ['http', 'https'] })
      .optional()
  }),

  // Parameterized query validation
  getUserById: secureJoi.object({
    id: secureJoi.string()
      .uuid()
      .required()
  })
}

// Validation middleware
function validate(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      })
    }

    req.body = value
    next()
  }
}

// Parameterized queries to prevent SQL injection
class SecureRepository {
  async findUser(id: string): Promise<User | null> {
    // ✅ Using parameterized query
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }

  async searchUsers(searchTerm: string, limit: number): Promise<User[]> {
    // ✅ Parameterized with proper escaping
    const result = await this.db.query(
      'SELECT * FROM users WHERE name ILIKE $1 LIMIT $2',
      [\`%\${searchTerm}%\`, limit]
    )
    return result.rows
  }

  // ❌ Never do this - vulnerable to SQL injection
  async unsafeSearch(searchTerm: string): Promise<User[]> {
    const query = \`SELECT * FROM users WHERE name LIKE '%\${searchTerm}%'\`
    return await this.db.query(query)
  }
}
\`\`\`

## Security Monitoring and Threat Detection

Implement comprehensive monitoring to detect and respond to threats:

\`\`\`typescript
interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit_exceeded' | 'suspicious_activity' | 'data_breach_attempt'
  userId?: string
  ip: string
  userAgent: string
  endpoint: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: Record<string, any>
}

class SecurityMonitor {
  private suspiciousIPs = new Set<string>()
  
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    // Log to security system
    await this.securityLogger.log({
      level: event.severity,
      message: \`Security event: \${event.type}\`,
      ...event
    })

    // Check for patterns that indicate attacks
    await this.analyzeSecurityEvent(event)
    
    // Alert if critical
    if (event.severity === 'critical') {
      await this.alertSecurityTeam(event)
    }
  }

  private async analyzeSecurityEvent(event: SecurityEvent): Promise<void> {
    switch (event.type) {
      case 'auth_failure':
        await this.analyzeAuthFailures(event)
        break
      case 'rate_limit_exceeded':
        await this.analyzeRateLimitViolations(event)
        break
      case 'suspicious_activity':
        await this.analyzeSuspiciousActivity(event)
        break
    }
  }

  private async analyzeAuthFailures(event: SecurityEvent): Promise<void> {
    const key = \`auth_failures:\${event.ip}\`
    const failures = await this.redis.incr(key)
    await this.redis.expire(key, 300) // 5 minute window

    if (failures >= 5) {
      this.suspiciousIPs.add(event.ip)
      
      // Temporarily block IP
      await this.redis.setex(\`blocked_ip:\${event.ip}\`, 1800, 'true') // 30 min block
      
      await this.logSecurityEvent({
        type: 'suspicious_activity',
        ip: event.ip,
        userAgent: event.userAgent,
        endpoint: event.endpoint,
        timestamp: new Date(),
        severity: 'high',
        details: { reason: 'multiple_auth_failures', count: failures }
      })
    }
  }

  private async analyzeRateLimitViolations(event: SecurityEvent): Promise<void> {
    const key = \`rate_violations:\${event.ip}\`
    const violations = await this.redis.incr(key)
    await this.redis.expire(key, 3600) // 1 hour window

    if (violations >= 3) {
      await this.logSecurityEvent({
        type: 'suspicious_activity',
        ip: event.ip,
        userAgent: event.userAgent,
        endpoint: event.endpoint,
        timestamp: new Date(),
        severity: 'medium',
        details: { reason: 'repeated_rate_limit_violations', count: violations }
      })
    }
  }

  async isIPBlocked(ip: string): Promise<boolean> {
    return await this.redis.exists(\`blocked_ip:\${ip}\`) === 1
  }

  private async alertSecurityTeam(event: SecurityEvent): Promise<void> {
    // Send to security team via Slack, email, PagerDuty, etc.
    await this.notificationService.sendSecurityAlert({
      title: \`Critical Security Event: \${event.type}\`,
      description: \`IP \${event.ip} triggered \${event.type}\`,
      severity: event.severity,
      details: event
    })
  }
}

// Security middleware
function securityMiddleware(monitor: SecurityMonitor) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress
    
    // Check if IP is blocked
    if (await monitor.isIPBlocked(ip)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Monitor for suspicious patterns
    const userAgent = req.get('User-Agent') || ''
    
    // Detect potential bot attacks
    if (this.isSuspiciousUserAgent(userAgent)) {
      await monitor.logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        endpoint: req.path,
        timestamp: new Date(),
        severity: 'medium',
        details: { reason: 'suspicious_user_agent' }
      })
    }

    next()
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /curl/i,
      /wget/i,
      /python/i,
      /bot/i,
      /scanner/i,
      /^$/  // Empty user agent
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent))
  }
}
\`\`\`

## Key Takeaways

1. **Defense in Depth**: Implement multiple security layers, not just authentication
2. **Secure by Default**: Use secure configurations and fail securely
3. **Input Validation**: Never trust user input—validate and sanitize everything
4. **Rate Limiting**: Implement sophisticated rate limiting to prevent abuse
5. **Monitoring**: Log security events and analyze patterns for threats
6. **Regular Updates**: Keep dependencies updated and conduct security audits
7. **Principle of Least Privilege**: Grant minimum necessary permissions

API security is an ongoing process, not a one-time implementation. Regularly review your security posture, conduct penetration testing, and stay updated with the latest security threats and best practices.

Remember that security and usability often have trade-offs. The key is finding the right balance for your application's risk profile while maintaining a good user experience. Start with these foundational patterns and adapt them to your specific requirements and threat model.
    `,
    author: torAuthor,
    categories: [categories.find(c => c.id === 'security')!, categories.find(c => c.id === 'api')!],
    tags: ['API Security', 'Authentication', 'Authorization', 'Rate Limiting', 'Input Validation', 'Security Monitoring'],
    seo: {
      metaTitle: 'API Security: Beyond Authentication - Advanced Protection Strategies',
      metaDescription: 'Comprehensive guide to API security covering authentication, authorization, rate limiting, input validation, and protection against common vulnerabilities.',
      focusKeyword: 'API Security'
    },
    publishedAt: new Date('2024-08-05'),
    updatedAt: new Date('2024-08-05'),
    createdAt: new Date('2024-08-05'),
    status: 'published',
    readingTime: 0,
    featured: true
  }
]

// Calculate reading times
blogPosts.forEach(post => {
  post.readingTime = calculateReadingTime(post.content)
})

export { blogPosts, categories, torAuthor }