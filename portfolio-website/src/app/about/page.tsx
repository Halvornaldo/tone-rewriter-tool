'use client'

import { motion } from 'framer-motion'
import { 
  Code, 
  Database, 
  Cloud, 
  Zap, 
  Users, 
  Heart, 
  Coffee, 
  Gamepad2, 
  Camera, 
  BookOpen, 
  Mail, 
  ExternalLink,
  Award,
  Target,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">T</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About Me
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every great application starts with understanding the problem it solves - and I've built my career on turning complex challenges into elegant solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Personal Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              My Journey
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                My path into development began during my university years when I encountered a frustrating problem: 
                the student portal was painfully slow and nearly impossible to use on mobile devices. Instead of just 
                complaining, I decided to build a better version as a side project. That simple web app, built with 
                basic HTML, CSS, and JavaScript, ended up being used by over 2,000 students.
              </p>
              
              <p className="text-gray-600 mb-6">
                That experience taught me something crucial: technology isn't just about writing clever code—it's about 
                solving real problems for real people. Since then, I've had the privilege of working with startups 
                racing to validate their ideas, established companies looking to modernize their systems, and 
                everything in between.
              </p>
              
              <p className="text-gray-600 mb-6">
                What drives me isn't just the satisfaction of building something that works, but understanding how 
                technology can create genuine value. Whether I'm architecting a scalable backend system, designing 
                an intuitive user interface, or optimizing database performance, I approach every project with the 
                same fundamental question: "How can this make someone's life better?"
              </p>
              
              <p className="text-gray-600">
                Over the past 5+ years, I've specialized in full-stack JavaScript development because I love being 
                able to see a project through from initial concept to deployed product. There's something magical 
                about taking an idea from a whiteboard sketch to a living, breathing application that people actually use.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technical Expertise */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
            >
              Technical Expertise
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Code,
                  title: 'Frontend Development',
                  description: 'Modern, responsive user interfaces built with React, Next.js, and TypeScript. I focus on performance, accessibility, and user experience.',
                  technologies: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js']
                },
                {
                  icon: Database,
                  title: 'Backend Development',
                  description: 'Scalable server architectures using Node.js and Python. RESTful APIs, GraphQL, and microservices that handle growth gracefully.',
                  technologies: ['Node.js', 'Express.js', 'Python', 'FastAPI', 'GraphQL']
                },
                {
                  icon: Cloud,
                  title: 'Cloud & DevOps',
                  description: 'Reliable deployment pipelines and infrastructure on AWS. Docker containers, CI/CD, and monitoring systems that keep apps running 24/7.',
                  technologies: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Terraform']
                },
                {
                  icon: Database,
                  title: 'Database Design',
                  description: 'Optimized data architectures that perform well under load. SQL and NoSQL databases, indexing strategies, and migration planning.',
                  technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch']
                },
                {
                  icon: Zap,
                  title: 'Performance Optimization',
                  description: 'Making applications fast and efficient. Bundle optimization, caching strategies, and database query optimization.',
                  technologies: ['Webpack', 'Vite', 'CDN', 'Caching', 'Bundle Analysis']
                },
                {
                  icon: Target,
                  title: 'Testing & Quality',
                  description: 'Comprehensive testing strategies that catch issues before production. Unit tests, integration tests, and end-to-end testing.',
                  technologies: ['Jest', 'Cypress', 'Playwright', 'Testing Library']
                }
              ].map((skill, index) => (
                <motion.div
                  key={skill.title}
                  variants={fadeInUp}
                  className="card p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary-100 rounded-lg mr-4">
                      <skill.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{skill.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{skill.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Experience */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
            >
              Career Highlights
            </motion.h2>
            
            <div className="space-y-8">
              {[
                {
                  icon: Award,
                  title: 'Led E-commerce Platform Overhaul',
                  company: 'TechCommerce Solutions',
                  description: 'Spearheaded complete platform redesign that reduced page load times by 79% and decreased cart abandonment from 68% to 31%. Implemented headless architecture serving 50K+ monthly users.',
                  achievements: ['79% improvement in page load times', '156% increase in mobile conversions', 'Reduced cart abandonment by 54%']
                },
                {
                  icon: Users,
                  title: 'Built Healthcare Analytics Dashboard',
                  company: 'MedTech Innovations',
                  description: 'Developed HIPAA-compliant analytics platform integrating 7 data sources across 12 healthcare facilities. Real-time insights led to 23% improvement in patient outcomes.',
                  achievements: ['Integrated 7 different data systems', '15 hours saved per week in manual processing', '40% reduction in patient wait times']
                },
                {
                  icon: Heart,
                  title: 'Open Source Project Success',
                  company: 'Personal Project',
                  description: 'Created and maintained CodeLens Chrome extension with 15K+ active users. Featured in developer newsletters and presented at 3 tech conferences.',
                  achievements: ['15K+ active users', '4.8/5 Chrome Web Store rating', '500+ GitHub stars']
                },
                {
                  icon: Zap,
                  title: 'Fintech Mobile App Development',
                  company: 'FinanceFirst Startup',
                  description: 'Built cross-platform personal finance app with bank integrations. Users save an average of $300+ monthly, with 85% retention rate after 30 days.',
                  achievements: ['10K+ downloads in 3 months', '$300+ average monthly savings per user', '85% user retention rate']
                }
              ].map((experience, index) => (
                <motion.div
                  key={experience.title}
                  variants={fadeInUp}
                  className="card p-6"
                >
                  <div className="flex items-start">
                    <div className="p-3 bg-primary-100 rounded-lg mr-4 flex-shrink-0">
                      <experience.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{experience.title}</h3>
                      <p className="text-primary-600 font-medium mb-3">{experience.company}</p>
                      <p className="text-gray-600 mb-4">{experience.description}</p>
                      <ul className="space-y-2">
                        {experience.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Development Philosophy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              My Development Philosophy
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6 text-center text-xl">
                "Great software is built on three pillars: clean, maintainable code; genuine understanding of user needs; and continuous learning."
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    icon: Code,
                    title: 'Code Quality First',
                    description: 'Every line of code I write is an investment in future maintainability. I believe in writing code that other developers can understand and build upon.'
                  },
                  {
                    icon: Users,
                    title: 'User-Centered Approach',
                    description: 'Technology should solve real problems for real people. I always start by understanding the user\'s needs before jumping into implementation.'
                  },
                  {
                    icon: Lightbulb,
                    title: 'Continuous Learning',
                    description: 'The tech landscape evolves rapidly, and I stay curious. I\'m always exploring new tools, patterns, and approaches to improve my craft.'
                  }
                ].map((principle, index) => (
                  <div key={principle.title} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                      <principle.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{principle.title}</h3>
                    <p className="text-gray-600">{principle.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Personal Interests */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              Beyond the Code
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8 text-center">
                When I'm not coding, I'm usually exploring other creative outlets or diving deep into topics that fuel my curiosity.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Coffee,
                    title: 'Coffee Enthusiast',
                    description: 'I take my coffee seriously - from exploring single-origin beans to perfecting brewing techniques. Currently experimenting with pour-over methods.'
                  },
                  {
                    icon: Camera,
                    title: 'Photography',
                    description: 'Capturing moments and compositions helps me see the world differently. Street photography and landscapes are my favorite subjects.'
                  },
                  {
                    icon: BookOpen,
                    title: 'Tech Writing',
                    description: 'I love sharing knowledge through blog posts and tutorials. Breaking down complex concepts into understandable explanations is a passion.'
                  },
                  {
                    icon: Gamepad2,
                    title: 'Gaming & VR',
                    description: 'Gaming keeps me connected to the latest in interactive technology. I\'m particularly interested in VR development and immersive experiences.'
                  }
                ].map((interest, index) => (
                  <motion.div
                    key={interest.title}
                    variants={fadeInUp}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
                      <interest.icon className="w-8 h-8 text-accent-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{interest.title}</h3>
                    <p className="text-gray-600 text-sm">{interest.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Side Projects</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                    Building a VS Code extension for better code documentation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                    Contributing to open-source accessibility tools
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                    Experimenting with WebAssembly for performance-critical applications
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Let's Create Something Amazing Together
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              I'm always excited to collaborate on interesting projects, whether you're a startup with a bold vision, 
              an established company looking to innovate, or a fellow developer wanting to share ideas.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Currently Available For:</h3>
                <ul className="space-y-1 text-primary-100">
                  <li>• Full-stack development projects</li>
                  <li>• Technical consulting & code reviews</li>
                  <li>• Speaking engagements & workshops</li>
                  <li>• Open source collaboration</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Response Time:</h3>
                <p className="text-primary-100 mb-2">I respond to all inquiries within 24 hours</p>
                <h3 className="text-lg font-semibold text-white mb-2">Preferred Contact:</h3>
                <p className="text-primary-100">Email or LinkedIn for professional inquiries</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                <Mail className="mr-2 w-5 h-5" />
                Start a Conversation
              </Link>
              <Link 
                href="/projects" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-300 text-lg font-medium rounded-md text-primary-100 hover:bg-primary-500 transition-colors duration-200"
              >
                <ExternalLink className="mr-2 w-5 h-5" />
                View My Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}