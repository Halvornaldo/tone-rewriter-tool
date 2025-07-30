'use client'

import { motion } from 'framer-motion'
import { Calculator, Zap, DollarSign, BarChart3, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export default function AICostCalculatorPage() {
  const features = [
    {
      icon: Calculator,
      title: 'Precise Cost Estimation',
      description: 'Get accurate cost calculations for popular AI models including GPT-4, Claude, Gemini, and more.'
    },
    {
      icon: BarChart3,
      title: 'Usage Analytics',
      description: 'Track your token usage patterns and identify cost optimization opportunities.'
    },
    {
      icon: TrendingUp,
      title: 'Cost Comparison',
      description: 'Compare costs across different AI providers to find the most cost-effective solution.'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay updated with the latest pricing changes from AI model providers.'
    }
  ]

  const stats = [
    { label: 'Supported AI Models', value: '15+' },
    { label: 'Calculations Performed', value: '10K+' },
    { label: 'Cost Savings Identified', value: '$50K+' },
    { label: 'Active Users', value: '500+' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 -mt-16 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Calculator className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              AI Cost{' '}
              <span className="gradient-text">Calculator</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Calculate and optimize your AI model costs with precision. Compare providers, 
              track usage, and make data-driven decisions for your AI projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/ai-cost-calculator/calculator">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="group text-lg px-8 py-4"
                >
                  Start Calculating
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4"
              >
                <BarChart3 className="mr-2 w-5 h-5" />
                View Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Real-time pricing data
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                15+ AI models supported
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Free to use
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-10 w-16 h-16 bg-primary-200 rounded-lg opacity-20 flex items-center justify-center"
          >
            <DollarSign className="w-8 h-8 text-primary-600" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-1/3 right-10 w-12 h-12 bg-accent-200 rounded-full opacity-20 flex items-center justify-center"
          >
            <Zap className="w-6 h-6 text-accent-600" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/4 left-1/4 w-10 h-10 bg-primary-300 rounded-lg opacity-20 flex items-center justify-center"
          >
            <Calculator className="w-5 h-5 text-primary-700" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary-600 mb-2">{value}</div>
                <div className="text-gray-600 text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Calculator?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for developers, data scientists, and businesses who need accurate 
              AI cost estimation and optimization insights.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-gray-600">
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Models Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Supported AI Models
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate costs for the most popular AI models from leading providers.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'GPT-4',
              'GPT-3.5',
              'Claude 3',
              'Gemini Pro',
              'LLaMA 2',
              'Mistral',
              'PaLM 2',
              'Cohere',
              'Anthropic',
              'OpenAI',
              'Perplexity',
              'Together'
            ].map((model, index) => (
              <motion.div
                key={model}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-primary-50 transition-colors cursor-pointer"
              >
                <div className="font-medium text-gray-900">{model}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Start Optimizing Your AI Costs Today
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and businesses who are already saving money 
              with our AI cost calculator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ai-cost-calculator/calculator">
                <Button 
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  <Calculator className="mr-2 w-5 h-5" />
                  Launch Calculator
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}