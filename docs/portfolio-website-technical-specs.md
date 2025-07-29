# Technical Specifications for Portfolio Website Frontend
## Based on Portfolio Website PRD v1.0

### Document Information
- **Version:** 1.0
- **Date:** January 29, 2025
- **Type:** Frontend Technical Specification
- **Status:** Ready for Implementation

---

## 1. Technology Stack Recommendations

### 1.1 Core Framework
**Next.js 14+ with App Router**
- **Rationale:** Server-side rendering for SEO, built-in optimization, excellent developer experience
- **Key Features to Utilize:**
  - App Router for file-based routing
  - Server Components for performance
  - Built-in Image optimization
  - API routes for contact form backend
  - Incremental Static Regeneration for blog posts

### 1.2 Language & Type Safety
**TypeScript 5.0+**
```typescript
// Example type definitions
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: Technology[];
  images: ProjectImage[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  categories: Category[];
  tags: string[];
  publishedAt: Date;
  readingTime: number;
}
```

### 1.3 Styling Solution
**Tailwind CSS 3.4+ with CSS Variables**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          // ... through 900
        },
        accent: {
          // Similar structure
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ]
}
```

### 1.4 Animation Libraries
**Framer Motion** for complex animations
```typescript
// Example usage
import { motion } from 'framer-motion';

const ProjectCard = ({ project }: { project: Project }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
  >
    {/* Card content */}
  </motion.div>
);
```

### 1.5 Additional Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "framer-motion": "^10.16.0",
    "react-intersection-observer": "^9.5.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@tanstack/react-query": "^5.0.0",
    "date-fns": "^2.30.0",
    "react-markdown": "^9.0.0",
    "prism-react-renderer": "^2.0.0",
    "react-hot-toast": "^2.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

## 2. Component Architecture

### 2.1 Directory Structure
```
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Homepage
│   │   ├── about/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx          # Projects listing
│   │   │   └── [slug]/page.tsx  # Project detail
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing
│   │   │   ├── [slug]/page.tsx  # Blog post
│   │   │   └── category/[category]/page.tsx
│   │   └── contact/page.tsx
│   ├── api/
│   │   ├── contact/route.ts      # Contact form handler
│   │   └── newsletter/route.ts   # Newsletter signup
│   ├── layout.tsx
│   ├── globals.css
│   └── providers.tsx
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   ├── sections/                 # Page sections
│   │   ├── Hero.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── RecentPosts.tsx
│   │   └── CallToAction.tsx
│   ├── project/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectFilter.tsx
│   │   └── ProjectGallery.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogGrid.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── ShareButtons.tsx
│   │   └── RelatedPosts.tsx
│   └── forms/
│       ├── ContactForm.tsx
│       └── NewsletterForm.tsx
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── api.ts                    # API client
│   ├── constants.ts
│   └── validators.ts             # Zod schemas
├── hooks/
│   ├── useIntersectionObserver.ts
│   ├── useScrollProgress.ts
│   ├── useMediaQuery.ts
│   └── useDebounce.ts
├── types/
│   ├── project.ts
│   ├── blog.ts
│   └── api.ts
└── styles/
    └── prism-theme.css
```

### 2.2 Component Hierarchy
```typescript
// Example of component composition
<Layout>
  <Header>
    <Navigation />
    <MobileMenu />
  </Header>
  
  <main>
    <Hero />
    <FeaturedProjects>
      <ProjectGrid>
        <ProjectCard />
      </ProjectGrid>
    </FeaturedProjects>
    <RecentPosts>
      <BlogGrid>
        <BlogCard />
      </BlogGrid>
    </RecentPosts>
    <CallToAction />
  </main>
  
  <Footer />
</Layout>
```

### 2.3 Reusable UI Components

#### Button Component
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  className,
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner className="mr-2" /> : null}
      {children}
    </button>
  );
};
```

---

## 3. Responsive Design Implementation

### 3.1 Breakpoint System
```css
/* Mobile First Approach */
/* Default: 320px - 767px (Mobile) */
/* sm: 768px - 1023px (Tablet) */
/* md: 1024px - 1439px (Desktop) */
/* lg: 1440px+ (Large Desktop) */
```

### 3.2 Responsive Grid System
```typescript
// ProjectGrid.tsx
export const ProjectGrid = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
```

### 3.3 Mobile Navigation Pattern
```typescript
export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button
        className="sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full sm:hidden bg-white z-50"
          >
            {/* Mobile menu content */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
```

### 3.4 Responsive Typography
```css
/* globals.css */
h1 {
  @apply text-3xl sm:text-4xl lg:text-5xl font-bold;
}

h2 {
  @apply text-2xl sm:text-3xl lg:text-4xl font-semibold;
}

p {
  @apply text-base sm:text-lg leading-relaxed;
}
```

---

## 4. State Management Approach

### 4.1 Client State Management
**Zustand for global UI state**
```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIStore {
  isMobileMenuOpen: boolean;
  isContactModalOpen: boolean;
  theme: 'light' | 'dark';
  toggleMobileMenu: () => void;
  toggleContactModal: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isContactModalOpen: false,
  theme: 'light',
  toggleMobileMenu: () => set((state) => ({ 
    isMobileMenuOpen: !state.isMobileMenuOpen 
  })),
  toggleContactModal: () => set((state) => ({ 
    isContactModalOpen: !state.isContactModalOpen 
  })),
  setTheme: (theme) => set({ theme }),
}));
```

### 4.2 Server State Management
**TanStack Query for data fetching**
```typescript
// hooks/useProjects.ts
export const useProjects = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => fetchProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// hooks/useBlogPosts.ts
export const useBlogPosts = (page: number = 1) => {
  return useInfiniteQuery({
    queryKey: ['blog-posts'],
    queryFn: ({ pageParam = 1 }) => fetchBlogPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};
```

### 4.3 Form State Management
**React Hook Form with Zod validation**
```typescript
// components/forms/ContactForm.tsx
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(50, 'Message must be at least 50 characters'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  
  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data);
      toast.success('Message sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields */}
    </form>
  );
};
```

---

## 5. Navigation and Routing Structure

### 5.1 Route Configuration
```typescript
// lib/navigation.ts
export const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    { name: 'GitHub', href: 'https://github.com/username', icon: GitHubIcon },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/username', icon: LinkedInIcon },
    { name: 'Twitter', href: 'https://twitter.com/username', icon: TwitterIcon },
  ],
};
```

### 5.2 Navigation Component
```typescript
export const Navigation = () => {
  const pathname = usePathname();
  
  return (
    <nav className="hidden sm:flex items-center space-x-8">
      {navigation.main.map((item) => {
        const isActive = pathname === item.href || 
                        (item.href !== '/' && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary-600',
              isActive ? 'text-primary-600' : 'text-gray-700'
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};
```

### 5.3 Breadcrumb Navigation
```typescript
export const Breadcrumbs = () => {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;
          
          return (
            <li key={path} className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
              {isLast ? (
                <span className="text-gray-900 font-medium">
                  {formatPathSegment(path)}
                </span>
              ) : (
                <Link href={href} className="text-gray-500 hover:text-gray-700">
                  {formatPathSegment(path)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
```

---

## 6. Animation and Interaction Patterns

### 6.1 Page Transitions
```typescript
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### 6.2 Scroll-Triggered Animations
```typescript
export const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
};
```

### 6.3 Hover Interactions
```typescript
export const ProjectCard = ({ project }: { project: Project }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.article
      className="relative overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-video">
        <Image
          src={project.images[0].url}
          alt={project.title}
          fill
          className="object-cover"
        />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
            >
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm line-clamp-3">
                  {project.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Rest of card content */}
    </motion.article>
  );
};
```

### 6.4 Loading States
```typescript
export const ProjectGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
};
```

---

## 7. Performance Optimization Strategies

### 7.1 Image Optimization
```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

export const OptimizedImage = ({ 
  src, 
  alt, 
  priority = false,
  ...props 
}: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL={generateBlurDataURL(src)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
};
```

### 7.2 Code Splitting
```typescript
// Dynamic imports for heavy components
const BlogEditor = dynamic(() => import('@/components/blog/BlogEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false,
});

const ProjectGallery = dynamic(() => import('@/components/project/ProjectGallery'), {
  loading: () => <GallerySkeleton />,
});
```

### 7.3 Data Fetching Optimization
```typescript
// app/projects/page.tsx
export default async function ProjectsPage() {
  // Parallel data fetching
  const [projects, categories, technologies] = await Promise.all([
    getProjects(),
    getCategories(),
    getTechnologies(),
  ]);
  
  return (
    <ProjectsLayout
      projects={projects}
      categories={categories}
      technologies={technologies}
    />
  );
}
```

### 7.4 Bundle Size Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};
```

### 7.5 Caching Strategy
```typescript
// lib/cache.ts
export const cacheConfig = {
  projects: {
    revalidate: 3600, // 1 hour
  },
  blogPosts: {
    revalidate: 1800, // 30 minutes
  },
  static: {
    revalidate: 86400, // 24 hours
  },
};

// Usage in page
export const revalidate = cacheConfig.projects.revalidate;
```

---

## 8. Accessibility Implementation

### 8.1 ARIA Labels and Roles
```typescript
export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <article
      role="article"
      aria-label={`Project: ${project.title}`}
      className="project-card"
    >
      <h3 id={`project-${project.id}-title`}>{project.title}</h3>
      <p aria-describedby={`project-${project.id}-title`}>
        {project.description}
      </p>
      <div role="list" aria-label="Technologies used">
        {project.technologies.map((tech) => (
          <span key={tech.id} role="listitem">
            {tech.name}
          </span>
        ))}
      </div>
    </article>
  );
};
```

### 8.2 Keyboard Navigation
```typescript
export const Navigation = () => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        setFocusedIndex((prev) => 
          prev < navigation.main.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowLeft':
        setFocusedIndex((prev) => 
          prev > 0 ? prev - 1 : navigation.main.length - 1
        );
        break;
      case 'Home':
        setFocusedIndex(0);
        break;
      case 'End':
        setFocusedIndex(navigation.main.length - 1);
        break;
    }
  };
  
  return (
    <nav role="navigation" aria-label="Main navigation">
      <ul role="list" className="flex space-x-4" onKeyDown={handleKeyDown}>
        {navigation.main.map((item, index) => (
          <li key={item.name} role="listitem">
            <Link
              href={item.href}
              tabIndex={focusedIndex === index ? 0 : -1}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

### 8.3 Skip Links
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

### 8.4 Form Accessibility
```typescript
export const ContactForm = () => {
  return (
    <form aria-label="Contact form">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name <span aria-label="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          aria-required="true"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-red-600 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>
      {/* Other form fields */}
    </form>
  );
};
```

---

## 9. Blog Functionality Technical Details

### 9.1 Content Management
```typescript
// lib/blog.ts
export interface BlogContent {
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: number;
  toc: TableOfContentsItem[];
}

export async function getBlogPost(slug: string): Promise<BlogContent> {
  const content = await fetchBlogContent(slug);
  const readingTime = calculateReadingTime(content);
  const toc = generateTableOfContents(content);
  
  return {
    frontmatter: parseFrontmatter(content),
    content: parseMarkdown(content),
    readingTime,
    toc,
  };
}
```

### 9.2 Markdown Rendering with Syntax Highlighting
```typescript
// components/blog/MarkdownRenderer.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const components = {
  pre: ({ children, ...props }: any) => (
    <div className="relative">
      <pre {...props} className="overflow-x-auto">
        {children}
      </pre>
      <CopyButton code={extractCode(children)} />
    </div>
  ),
  code: ({ children, className }: any) => {
    const isInline = !className;
    return (
      <code className={isInline ? 'inline-code' : className}>
        {children}
      </code>
    );
  },
  img: ({ src, alt }: any) => (
    <figure className="my-8">
      <OptimizedImage src={src} alt={alt} className="rounded-lg" />
      {alt && <figcaption className="text-center mt-2">{alt}</figcaption>}
    </figure>
  ),
};

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <MDXRemote
      source={content}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            [rehypePrismPlus, { ignoreMissing: true }],
          ],
        },
      }}
      components={components}
    />
  );
};
```

### 9.3 Blog Search Implementation
```typescript
// components/blog/BlogSearch.tsx
export const BlogSearch = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const { data: results, isLoading } = useQuery({
    queryKey: ['blog-search', debouncedQuery],
    queryFn: () => searchBlogPosts(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });
  
  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 pr-10 border rounded-lg"
        aria-label="Search blog posts"
      />
      <SearchIcon className="absolute right-3 top-3 text-gray-400" />
      
      {isLoading && <LoadingSpinner />}
      
      {results && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg">
          {results.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block p-4 hover:bg-gray-50"
            >
              <h4 className="font-medium">{post.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 9.4 Comments System Integration
```typescript
// components/blog/Comments.tsx
export const Comments = ({ postId }: { postId: string }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'username/portfolio-comments');
    script.setAttribute('issue-term', `blog-${postId}`);
    script.setAttribute('theme', 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    const comments = document.getElementById('comments');
    if (comments) {
      comments.appendChild(script);
    }
    
    return () => {
      const comments = document.getElementById('comments');
      if (comments) {
        comments.innerHTML = '';
      }
    };
  }, [postId]);
  
  return (
    <section aria-label="Comments">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div id="comments" />
    </section>
  );
};
```

---

## 10. Contact Form Implementation

### 10.1 Form Component with Validation
```typescript
// components/forms/ContactForm.tsx
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.enum(['general', 'project', 'collaboration', 'other']),
  message: z.string().min(50).max(1000),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  honeypot: z.string().max(0), // Anti-spam
});

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  
  const subject = watch('subject');
  
  const onSubmit = async (data: ContactFormData) => {
    // Remove honeypot from data
    const { honeypot, ...formData } = data;
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot field (hidden) */}
      <input
        type="text"
        {...register('honeypot')}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name *
          </label>
          <Input
            id="name"
            {...register('name')}
            error={errors.name?.message}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Subject *
        </label>
        <select
          id="subject"
          {...register('subject')}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select a subject</option>
          <option value="general">General Inquiry</option>
          <option value="project">Project Discussion</option>
          <option value="collaboration">Collaboration</option>
          <option value="other">Other</option>
        </select>
        {errors.subject && (
          <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
        )}
      </div>
      
      {(subject === 'project' || subject === 'collaboration') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium mb-2">
              Budget Range
            </label>
            <select
              id="budget"
              {...register('budget')}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select budget</option>
              <option value="<5k">Less than $5,000</option>
              <option value="5k-10k">$5,000 - $10,000</option>
              <option value="10k-25k">$10,000 - $25,000</option>
              <option value="25k+">$25,000+</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium mb-2">
              Timeline
            </label>
            <Input
              id="timeline"
              placeholder="e.g., 2-3 months"
              {...register('timeline')}
            />
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message * (min 50 characters)
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
        {errors.message && (
          <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          {watch('message')?.length || 0} / 1000 characters
        </p>
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="w-full sm:w-auto"
      >
        Send Message
      </Button>
    </form>
  );
};
```

### 10.2 API Route Handler
```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await limiter.check(identifier, 3); // 3 requests per minute
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = contactSchema.parse(body);
    
    // Send notification email to site owner
    await sendEmail({
      to: process.env.CONTACT_EMAIL!,
      subject: `New Contact Form Submission: ${validatedData.subject}`,
      template: 'contact-notification',
      data: validatedData,
    });
    
    // Send auto-response to sender
    await sendEmail({
      to: validatedData.email,
      subject: 'Thank you for your message',
      template: 'contact-auto-response',
      data: { name: validatedData.name },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 10.3 Email Templates
```typescript
// lib/email-templates/contact-notification.tsx
export const ContactNotificationTemplate = ({ data }: { data: ContactFormData }) => {
  return (
    <div>
      <h1>New Contact Form Submission</h1>
      <p><strong>From:</strong> {data.name} ({data.email})</p>
      <p><strong>Subject:</strong> {data.subject}</p>
      {data.budget && <p><strong>Budget:</strong> {data.budget}</p>}
      {data.timeline && <p><strong>Timeline:</strong> {data.timeline}</p>}
      <h2>Message:</h2>
      <p>{data.message}</p>
    </div>
  );
};
```

---

## 11. Environment Configuration

### 11.1 Environment Variables
```bash
# .env.local
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourportfolio.com
NEXT_PUBLIC_SITE_NAME="Your Name"
NEXT_PUBLIC_SITE_DESCRIPTION="Full-stack developer portfolio"

# API Keys
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxx

# Email Configuration
CONTACT_EMAIL=your.email@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@example.com
SMTP_PASS=your-app-password

# Database (if using)
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# Authentication (if using)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Content Management
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token
```

### 11.2 Configuration Files
```typescript
// config/site.ts
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
  },
  creator: '@username',
};
```

---

## 12. Testing Strategy

### 12.1 Unit Tests
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
```

### 12.2 Integration Tests
```typescript
// __tests__/contact-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/forms/ContactForm';

describe('ContactForm', () => {
  it('submits form with valid data', async () => {
    render(<ContactForm />);
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.selectOptions(screen.getByLabelText(/subject/i), 'project');
    await userEvent.type(
      screen.getByLabelText(/message/i), 
      'This is a test message that is at least 50 characters long for validation'
    );
    
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });
});
```

---

## 13. Deployment Checklist

### 13.1 Pre-deployment
- [ ] Run production build locally: `npm run build`
- [ ] Test all forms and interactions
- [ ] Verify all environment variables are set
- [ ] Run Lighthouse audit
- [ ] Check for console errors
- [ ] Validate SEO meta tags
- [ ] Test on multiple devices
- [ ] Verify analytics tracking
- [ ] Check all external links
- [ ] Optimize all images

### 13.2 Deployment Configuration
```javascript
// vercel.json
{
  "functions": {
    "app/api/contact/route.ts": {
      "maxDuration": 10
    }
  },
  "redirects": [
    {
      "source": "/resume",
      "destination": "/resume.pdf",
      "permanent": false
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 13.3 Post-deployment
- [ ] Verify site is accessible
- [ ] Test contact form submission
- [ ] Check Google Analytics is tracking
- [ ] Submit sitemap to Google Search Console
- [ ] Test social media sharing previews
- [ ] Monitor Core Web Vitals
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry)

---

## 14. Future Enhancements

### 14.1 Progressive Features
1. **Dark Mode Toggle**
   - System preference detection
   - Manual toggle with persistence
   - Smooth theme transitions

2. **Internationalization**
   - Multi-language support
   - Language detection
   - RTL language support

3. **Advanced Analytics**
   - Heatmap tracking
   - Custom event tracking
   - A/B testing framework

4. **Enhanced Interactivity**
   - Live chat integration
   - Interactive code playgrounds
   - Real-time collaboration features

### 14.2 Performance Enhancements
1. **Service Worker**
   - Offline functionality
   - Background sync
   - Push notifications

2. **Advanced Caching**
   - Redis integration
   - Edge caching
   - Stale-while-revalidate

3. **Media Optimization**
   - Video lazy loading
   - Adaptive bitrate streaming
   - WebRTC for live demos

---

This technical specification provides a comprehensive guide for implementing a modern, performant, and accessible portfolio website. Each section includes practical code examples and implementation details that developers can use immediately to begin building the application.