import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Cost Calculator - Optimize Your AI Model Spending',
  description: 'Calculate and optimize costs for popular AI models including GPT-4, Claude, Gemini, and more. Compare providers and track usage to make data-driven decisions.',
  keywords: [
    'AI cost calculator',
    'GPT-4 pricing',
    'Claude pricing',
    'AI model costs',
    'OpenAI calculator',
    'Anthropic pricing',
    'AI cost optimization',
    'LLM pricing',
    'machine learning costs',
    'AI budget planning'
  ],
  openGraph: {
    title: 'AI Cost Calculator - Optimize Your AI Model Spending',
    description: 'Calculate and optimize costs for popular AI models. Compare providers and track usage patterns.',
    type: 'website',
    images: [
      {
        url: '/og-ai-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Cost Calculator - Optimize Your AI Model Spending',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Cost Calculator - Optimize Your AI Model Spending',
    description: 'Calculate and optimize costs for popular AI models. Compare providers and track usage patterns.',
    images: ['/og-ai-calculator.jpg'],
  },
  alternates: {
    canonical: '/ai-cost-calculator',
  },
}

export default function AICostCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}