/**
 * AI Cost Calculator Core Logic
 * Handles pricing calculations for various AI models and providers
 */

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  pricing: {
    input: number  // per 1K tokens
    output: number // per 1K tokens
  }
  contextWindow: number
  tags: string[]
  features?: string[]
  limitations?: string[]
  popular?: boolean
  recommended?: boolean
}

export interface UsageParams {
  inputTokens: number
  outputTokens: number
  monthlyRequests: number
}

export interface CostCalculation {
  model: AIModel
  usage: UsageParams
  costs: {
    inputCostPerRequest: number
    outputCostPerRequest: number
    totalCostPerRequest: number
    dailyCost: number
    monthlyCost: number
    yearlyCost: number
  }
  breakdown: {
    inputTokensPerMonth: number
    outputTokensPerMonth: number
    totalTokensPerMonth: number
    inputCostPerMonth: number
    outputCostPerMonth: number
  }
  calculatedAt: Date
}

export interface CostComparison {
  currentModel: CostCalculation
  alternatives: Array<{
    model: AIModel
    calculation: CostCalculation
    savings: number
    savingsPercentage: number
  }>
}

// Comprehensive AI model database
export const AI_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Most capable GPT-4 model with latest training data and 128K context window',
    pricing: { input: 0.01, output: 0.03 },
    contextWindow: 128000,
    tags: ['Latest', 'High Quality', 'Large Context'],
    features: ['Advanced reasoning', 'Code generation', 'Large context window', 'Latest training data'],
    popular: true,
    recommended: true
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Original GPT-4 model with excellent reasoning capabilities',
    pricing: { input: 0.03, output: 0.06 },
    contextWindow: 8192,
    tags: ['Reliable', 'Proven', 'High Quality'],
    features: ['Superior reasoning', 'Complex problem solving', 'Creative writing'],
    limitations: ['Smaller context window', 'Higher cost']
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and cost-effective model suitable for most applications',
    pricing: { input: 0.001, output: 0.002 },
    contextWindow: 16385,
    tags: ['Cost-Effective', 'Fast', 'Versatile'],
    features: ['Good balance of speed and quality', 'Affordable pricing', 'Wide range of tasks'],
    popular: true
  },
  
  // Anthropic Claude Models
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most powerful Claude model for complex analytical and creative tasks',
    pricing: { input: 0.015, output: 0.075 },
    contextWindow: 200000,
    tags: ['Premium', 'Large Context', 'Advanced'],
    features: ['Superior analytical capabilities', 'Massive context window', 'Nuanced understanding'],
    limitations: ['Higher cost', 'Slower response times']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced performance and cost for most applications',
    pricing: { input: 0.003, output: 0.015 },
    contextWindow: 200000,
    tags: ['Balanced', 'Large Context', 'Reliable'],
    features: ['Good reasoning abilities', 'Large context window', 'Balanced cost/performance'],
    recommended: true
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fast and efficient model for simple tasks and high-volume usage',
    pricing: { input: 0.00025, output: 0.00125 },
    contextWindow: 200000,
    tags: ['Fast', 'Affordable', 'High Volume'],
    features: ['Very fast responses', 'Low cost', 'Good for simple tasks']
  },
  
  // Google Gemini Models
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s most capable model for text and code generation',
    pricing: { input: 0.0005, output: 0.0015 },
    contextWindow: 32768,
    tags: ['Google', 'Multimodal', 'Cost-Effective'],
    features: ['Multimodal capabilities', 'Strong reasoning', 'Competitive pricing']
  },
  {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision',
    provider: 'Google',
    description: 'Optimized for vision and multimodal understanding tasks',
    pricing: { input: 0.0005, output: 0.0015 },
    contextWindow: 32768,
    tags: ['Vision', 'Multimodal', 'Google'],
    features: ['Image understanding', 'Multimodal reasoning', 'Video analysis capabilities']
  },

  // Additional Models
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'High-performance model with strong multilingual capabilities',
    pricing: { input: 0.004, output: 0.012 },
    contextWindow: 32000,
    tags: ['Multilingual', 'European', 'High Performance'],
    features: ['Strong multilingual support', 'Code generation', 'Reasoning tasks']
  },
  {
    id: 'cohere-command',
    name: 'Command',
    provider: 'Cohere',
    description: 'Enterprise-focused model optimized for business applications',
    pricing: { input: 0.0015, output: 0.002 },
    contextWindow: 4096,
    tags: ['Enterprise', 'Business', 'Reliable'],
    features: ['Business-focused training', 'Enterprise safety', 'Consistent outputs']
  }
]

/**
 * Calculate costs for a specific AI model and usage pattern
 */
export function calculateCosts(modelId: string, usage: UsageParams): CostCalculation | null {
  const model = AI_MODELS.find(m => m.id === modelId)
  if (!model) return null

  const { inputTokens, outputTokens, monthlyRequests } = usage

  // Per-request costs
  const inputCostPerRequest = (inputTokens / 1000) * model.pricing.input
  const outputCostPerRequest = (outputTokens / 1000) * model.pricing.output
  const totalCostPerRequest = inputCostPerRequest + outputCostPerRequest

  // Monthly totals
  const inputTokensPerMonth = inputTokens * monthlyRequests
  const outputTokensPerMonth = outputTokens * monthlyRequests
  const totalTokensPerMonth = inputTokensPerMonth + outputTokensPerMonth
  const inputCostPerMonth = inputCostPerRequest * monthlyRequests
  const outputCostPerMonth = outputCostPerRequest * monthlyRequests
  const monthlyCost = totalCostPerRequest * monthlyRequests

  // Time-based projections
  const dailyCost = monthlyCost / 30
  const yearlyCost = monthlyCost * 12

  return {
    model,
    usage,
    costs: {
      inputCostPerRequest,
      outputCostPerRequest,
      totalCostPerRequest,
      dailyCost,
      monthlyCost,
      yearlyCost
    },
    breakdown: {
      inputTokensPerMonth,
      outputTokensPerMonth,
      totalTokensPerMonth,
      inputCostPerMonth,
      outputCostPerMonth
    },
    calculatedAt: new Date()
  }
}

/**
 * Compare costs across multiple AI models
 */
export function compareCosts(modelId: string, usage: UsageParams, limit = 5): CostComparison | null {
  const currentCalculation = calculateCosts(modelId, usage)
  if (!currentCalculation) return null

  const alternatives = AI_MODELS
    .filter(model => model.id !== modelId)
    .map(model => {
      const calculation = calculateCosts(model.id, usage)!
      const savings = currentCalculation.costs.monthlyCost - calculation.costs.monthlyCost
      const savingsPercentage = (savings / currentCalculation.costs.monthlyCost) * 100

      return {
        model,
        calculation,
        savings,
        savingsPercentage
      }
    })
    .sort((a, b) => b.savings - a.savings)
    .slice(0, limit)

  return {
    currentModel: currentCalculation,
    alternatives
  }
}

/**
 * Get usage recommendations based on cost thresholds
 */
export function getUsageRecommendations(calculation: CostCalculation): string[] {
  const recommendations: string[] = []
  const { costs, usage, model } = calculation

  // High cost warnings
  if (costs.monthlyCost > 1000) {
    recommendations.push('Consider optimizing your usage - monthly costs exceed $1,000')
  }
  
  if (costs.monthlyCost > 100) {
    recommendations.push('Look into batch processing to reduce API calls')
  }

  // Token optimization
  if (usage.inputTokens > 4000) {
    recommendations.push('Consider shortening prompts to reduce input token costs')
  }

  if (usage.outputTokens > 2000) {
    recommendations.push('Request shorter responses when possible to reduce output costs')
  }

  // Model-specific recommendations
  if (model.pricing.output > 0.05 && usage.outputTokens > 1000) {
    recommendations.push('This model has high output costs - consider a more cost-effective alternative for generation tasks')
  }

  if (usage.monthlyRequests > 10000 && model.pricing.input > 0.01) {
    recommendations.push('For high-volume usage, consider switching to a more cost-effective model')
  }

  // Caching recommendations
  if (usage.monthlyRequests > 100) {
    recommendations.push('Implement response caching for repeated queries to reduce costs')
  }

  return recommendations
}

/**
 * Estimate token count for text (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token on average
  return Math.ceil(text.length / 4)
}

/**
 * Format currency values consistently
 */
export function formatCurrency(amount: number, precision = 4): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: precision
  }).format(amount)
}

/**
 * Get cost efficiency score (lower is better)
 */
export function getCostEfficiencyScore(calculation: CostCalculation): number {
  const { costs, breakdown } = calculation
  
  // Score based on cost per token
  const costPerToken = costs.monthlyCost / breakdown.totalTokensPerMonth
  
  // Normalize to 0-100 scale (lower is better)
  return Math.min(100, costPerToken * 100000)
}

/**
 * Get model recommendations based on usage patterns
 */
export function getModelRecommendations(usage: UsageParams): AIModel[] {
  const { inputTokens, outputTokens, monthlyRequests } = usage
  
  // Calculate usage characteristics
  const isHighVolume = monthlyRequests > 1000
  const isLongContext = inputTokens > 8000
  const isGenerationHeavy = outputTokens > inputTokens
  
  let recommendedModels = [...AI_MODELS]
  
  // Filter based on usage patterns
  if (isHighVolume) {
    // Prioritize cost-effective models for high volume
    recommendedModels.sort((a, b) => 
      (a.pricing.input + a.pricing.output) - (b.pricing.input + b.pricing.output)
    )
  }
  
  if (isLongContext) {
    // Prioritize models with large context windows
    recommendedModels = recommendedModels.filter(m => m.contextWindow >= 32000)
  }
  
  if (isGenerationHeavy) {
    // Prioritize models with lower output costs
    recommendedModels.sort((a, b) => a.pricing.output - b.pricing.output)
  }
  
  return recommendedModels.slice(0, 3)
}