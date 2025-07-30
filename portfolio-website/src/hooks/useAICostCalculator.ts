import { useState, useCallback, useMemo } from 'react'
import { 
  AIModel, 
  UsageParams, 
  CostCalculation, 
  CostComparison,
  AI_MODELS,
  calculateCosts,
  compareCosts,
  getUsageRecommendations,
  getModelRecommendations,
  getCostEfficiencyScore
} from '@/lib/ai-cost-calculator'

export interface CalculatorState {
  selectedModel: string | null
  usage: UsageParams
  isCalculating: boolean
  error: string | null
  lastCalculated: Date | null
}

export interface CalculatorActions {
  setSelectedModel: (modelId: string) => void
  updateUsage: (usage: Partial<UsageParams>) => void
  calculate: () => Promise<CostCalculation | null>
  reset: () => void
  clearError: () => void
}

export interface CalculatorResults {
  calculation: CostCalculation | null
  comparison: CostComparison | null
  recommendations: string[]
  efficiencyScore: number
  recommendedModels: AIModel[]
}

const DEFAULT_USAGE: UsageParams = {
  inputTokens: 1000,
  outputTokens: 500,
  monthlyRequests: 100
}

const DEFAULT_STATE: CalculatorState = {
  selectedModel: null,
  usage: DEFAULT_USAGE,
  isCalculating: false,
  error: null,
  lastCalculated: null
}

/**
 * Custom hook for managing AI cost calculator state and operations
 */
export function useAICostCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE)
  const [calculation, setCalculation] = useState<CostCalculation | null>(null)
  const [comparison, setComparison] = useState<CostComparison | null>(null)

  // Actions
  const setSelectedModel = useCallback((modelId: string) => {
    setState(prev => ({
      ...prev,
      selectedModel: modelId,
      error: null
    }))
  }, [])

  const updateUsage = useCallback((updates: Partial<UsageParams>) => {
    setState(prev => ({
      ...prev,
      usage: { ...prev.usage, ...updates },
      error: null
    }))
  }, [])

  const calculate = useCallback(async (): Promise<CostCalculation | null> => {
    if (!state.selectedModel) {
      setState(prev => ({ ...prev, error: 'Please select an AI model' }))
      return null
    }

    setState(prev => ({ ...prev, isCalculating: true, error: null }))

    try {
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800))

      const newCalculation = calculateCosts(state.selectedModel, state.usage)
      
      if (!newCalculation) {
        throw new Error('Failed to calculate costs for the selected model')
      }

      const newComparison = compareCosts(state.selectedModel, state.usage, 5)

      setCalculation(newCalculation)
      setComparison(newComparison)

      setState(prev => ({
        ...prev,
        isCalculating: false,
        lastCalculated: new Date()
      }))

      return newCalculation
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      
      setState(prev => ({
        ...prev,
        isCalculating: false,
        error: errorMessage
      }))

      return null
    }
  }, [state.selectedModel, state.usage])

  const reset = useCallback(() => {
    setState(DEFAULT_STATE)
    setCalculation(null)
    setComparison(null)
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Computed values
  const selectedModelData = useMemo(() => {
    return state.selectedModel ? AI_MODELS.find(m => m.id === state.selectedModel) : null
  }, [state.selectedModel])

  const recommendations = useMemo(() => {
    return calculation ? getUsageRecommendations(calculation) : []
  }, [calculation])

  const efficiencyScore = useMemo(() => {
    return calculation ? getCostEfficiencyScore(calculation) : 0
  }, [calculation])

  const recommendedModels = useMemo(() => {
    return getModelRecommendations(state.usage)
  }, [state.usage])

  // Validation
  const isValidUsage = useMemo(() => {
    const { inputTokens, outputTokens, monthlyRequests } = state.usage
    return inputTokens > 0 && outputTokens > 0 && monthlyRequests > 0
  }, [state.usage])

  const canCalculate = useMemo(() => {
    return state.selectedModel && isValidUsage && !state.isCalculating
  }, [state.selectedModel, isValidUsage, state.isCalculating])

  // Cost estimates for quick preview
  const quickEstimate = useMemo(() => {
    if (!state.selectedModel || !isValidUsage) return null
    
    try {
      return calculateCosts(state.selectedModel, state.usage)
    } catch {
      return null
    }
  }, [state.selectedModel, state.usage, isValidUsage])

  const actions: CalculatorActions = {
    setSelectedModel,
    updateUsage,
    calculate,
    reset,
    clearError
  }

  const results: CalculatorResults = {
    calculation,
    comparison,
    recommendations,
    efficiencyScore,
    recommendedModels
  }

  return {
    // State
    state,
    selectedModelData,
    isValidUsage,
    canCalculate,
    quickEstimate,
    
    // Actions
    actions,
    
    // Results
    results,
    
    // Models data
    models: AI_MODELS
  }
}

/**
 * Hook for managing calculator history and favorites
 */
export function useCalculatorHistory() {
  const [history, setHistory] = useState<CostCalculation[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const addToHistory = useCallback((calculation: CostCalculation) => {
    setHistory(prev => {
      const newHistory = [calculation, ...prev.slice(0, 9)] // Keep last 10
      
      // Save to localStorage
      try {
        localStorage.setItem('ai-calculator-history', JSON.stringify(newHistory))
      } catch (error) {
        console.warn('Failed to save calculator history:', error)
      }
      
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem('ai-calculator-history')
    } catch (error) {
      console.warn('Failed to clear calculator history:', error)
    }
  }, [])

  const toggleFavorite = useCallback((modelId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
      
      // Save to localStorage
      try {
        localStorage.setItem('ai-calculator-favorites', JSON.stringify(newFavorites))
      } catch (error) {
        console.warn('Failed to save calculator favorites:', error)
      }
      
      return newFavorites
    })
  }, [])

  const isFavorite = useCallback((modelId: string) => {
    return favorites.includes(modelId)
  }, [favorites])

  // Load from localStorage on mount
  const loadStoredData = useCallback(() => {
    try {
      const storedHistory = localStorage.getItem('ai-calculator-history')
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory))
      }
      
      const storedFavorites = localStorage.getItem('ai-calculator-favorites')
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.warn('Failed to load stored calculator data:', error)
    }
  }, [])

  return {
    history,
    favorites,
    addToHistory,
    clearHistory,
    toggleFavorite,
    isFavorite,
    loadStoredData
  }
}