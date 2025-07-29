import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-react'

export const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    { 
      name: 'GitHub', 
      href: 'https://github.com/yourusername', 
      icon: Github,
      external: true 
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com/in/yourusername', 
      icon: Linkedin,
      external: true 
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/yourusername', 
      icon: Twitter,
      external: true 
    },
    { 
      name: 'Email', 
      href: 'mailto:your.email@example.com', 
      icon: Mail,
      external: true 
    },
  ],
  footer: {
    sections: [
      {
        title: 'Navigation',
        links: [
          { name: 'Home', href: '/', external: false },
          { name: 'About', href: '/about', external: false },
          { name: 'Projects', href: '/projects', external: false },
          { name: 'Blog', href: '/blog', external: false },
          { name: 'Contact', href: '/contact', external: false },
        ],
      },
      {
        title: 'Projects',
        links: [
          { name: 'Web Applications', href: '/projects?category=web', external: false },
          { name: 'Mobile Apps', href: '/projects?category=mobile', external: false },
          { name: 'Open Source', href: '/projects?category=opensource', external: false },
          { name: 'Case Studies', href: '/projects?featured=true', external: false },
        ],
      },
      {
        title: 'Content',
        links: [
          { name: 'Latest Posts', href: '/blog', external: false },
          { name: 'Technical Articles', href: '/blog?category=technical', external: false },
          { name: 'Tutorials', href: '/blog?category=tutorials', external: false },
          { name: 'Newsletter', href: '/newsletter', external: false },
        ],
      },
      {
        title: 'Connect',
        links: [
          { name: 'GitHub', href: 'https://github.com/yourusername', external: true },
          { name: 'LinkedIn', href: 'https://linkedin.com/in/yourusername', external: true },
          { name: 'Twitter', href: 'https://twitter.com/yourusername', external: true },
          { name: 'Resume', href: '/resume.pdf', external: true },
        ],
      },
    ],
  },
} as const

export type NavigationItem = typeof navigation.main[number]
export type SocialItem = typeof navigation.social[number]