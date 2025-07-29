import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Header, Footer } from '@/components/layout'
import { PageErrorBoundary } from '@/components/common/ErrorBoundary'
import { SkipLink, LiveRegion } from '@/lib/accessibility'
import { env } from '@/lib/env'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const createMetadata = (): Metadata => ({
  title: {
    default: `${env.NEXT_PUBLIC_SITE_NAME} - Full Stack Developer`,
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME} - Developer Portfolio`
  },
  description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
  keywords: ['developer', 'portfolio', 'web development', 'full stack', 'react', 'next.js', 'typescript'],
  authors: [{ name: env.NEXT_PUBLIC_SITE_NAME }],
  creator: env.NEXT_PUBLIC_SITE_NAME,
  publisher: env.NEXT_PUBLIC_SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.NEXT_PUBLIC_SITE_URL,
    title: `${env.NEXT_PUBLIC_SITE_NAME} - Full Stack Developer Portfolio`,
    description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${env.NEXT_PUBLIC_SITE_NAME} - Developer Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${env.NEXT_PUBLIC_SITE_NAME} - Full Stack Developer`,
    description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
    creator: '@yourusername',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
  alternates: {
    canonical: env.NEXT_PUBLIC_SITE_URL,
  },
})

export const metadata = createMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/* CSRF Token Meta Tag */}
        <meta name="csrf-token" content="__CSRF_TOKEN__" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://vercel.com" />
        <link rel="dns-prefetch" href="https://google-analytics.com" />
        
        {/* Theme and accessibility meta tags */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      
      <body className={`${inter.className} antialiased`}>
        {/* Skip Links for Accessibility */}
        <SkipLink href="#main-content">
          Skip to main content
        </SkipLink>
        <SkipLink href="#footer-navigation">
          Skip to footer navigation
        </SkipLink>
        
        {/* Page-level Error Boundary */}
        <PageErrorBoundary>
          <div className="min-h-screen bg-white flex flex-col">
            <Header />
            
            <main 
              id="main-content" 
              tabIndex={-1} 
              className="flex-1 focus:outline-none"
              role="main"
              aria-label="Main content"
            >
              {children}
            </main>
            
            <Footer />
          </div>
        </PageErrorBoundary>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          gutter={8}
          containerClassName="z-50"
          toastOptions={{
            duration: 4000,
            className: 'max-w-md',
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'rgb(34, 197, 94)',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: 'rgb(239, 68, 68)',
                secondary: '#fff',
              },
            },
            loading: {
              duration: Infinity,
              iconTheme: {
                primary: 'rgb(59, 130, 246)',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Live Region for Screen Reader Announcements */}
        <LiveRegion priority="polite" id="announcements" />
        
        {/* Performance and Analytics Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  // Report web vitals
                  if ('web-vitals' in window) {
                    webVitals.getCLS(reportWebVitals);
                    webVitals.getFID(reportWebVitals);
                    webVitals.getFCP(reportWebVitals);
                    webVitals.getLCP(reportWebVitals);
                    webVitals.getTTFB(reportWebVitals);
                  }
                  
                  // Initialize accessibility features
                  if (window.initializeAccessibility) {
                    window.initializeAccessibility();
                  }
                  
                  // Initialize performance monitoring
                  if (window.initializePerformanceMonitoring) {
                    window.initializePerformanceMonitoring();
                  }
                });
              }
              
              function reportWebVitals(metric) {
                // Send to analytics service
                if (window.gtag) {
                  window.gtag('event', metric.name, {
                    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    event_category: 'Web Vitals',
                    event_label: metric.id,
                    non_interaction: true,
                  });
                }
              }
              
              // Service Worker Registration
              if ('serviceWorker' in navigator && location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        {/* Google Analytics */}
        {env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    anonymize_ip: true,
                    respect_dnt: true,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}