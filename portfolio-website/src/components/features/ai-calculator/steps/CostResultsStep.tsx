import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingDown, TrendingUp, RefreshCw, Download, Share2, AlertCircle, Star, Target } from 'lucide-react'
import { Button } from '@/components/ui'
import { CalculatorData } from '@/app/ai-cost-calculator/calculator/page'
import { 
  calculateCosts, 
  compareCosts, 
  getUsageRecommendations, 
  formatCurrency,
  getCostEfficiencyScore,
  CostCalculation,
  CostComparison
} from '@/lib/ai-cost-calculator'

interface CostResultsStepProps {
  calculatorData: CalculatorData
  onRecalculate: () => void
}

export const CostResultsStep: React.FC<CostResultsStepProps> = ({
  calculatorData,
  onRecalculate
}) => {
  const [calculation, setCalculation] = useState<CostCalculation | null>(null)
  const [comparison, setComparison] = useState<CostComparison | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [efficiencyScore, setEfficiencyScore] = useState<number>(0)

  useEffect(() => {
    const performCalculations = async () => {
      setIsLoading(true)
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (!calculatorData.selectedModel) return

      const usage = {
        inputTokens: calculatorData.inputTokens,
        outputTokens: calculatorData.outputTokens,
        monthlyRequests: calculatorData.monthlyRequests
      }

      try {
        const newCalculation = calculateCosts(calculatorData.selectedModel, usage)
        const newComparison = compareCosts(calculatorData.selectedModel, usage, 3)
        
        if (newCalculation) {
          const newRecommendations = getUsageRecommendations(newCalculation)
          const newEfficiencyScore = getCostEfficiencyScore(newCalculation)
          
          setCalculation(newCalculation)
          setComparison(newComparison)
          setRecommendations(newRecommendations)
          setEfficiencyScore(newEfficiencyScore)
        }
      } catch (error) {
        console.error('Failed to calculate costs:', error)
      }

      setIsLoading(false)
    }

    performCalculations()
  }, [calculatorData])

  const handleShare = async () => {
    if (!calculation) return

    const shareText = `AI Cost Calculator Results:
Model: ${calculation.model.name}
Monthly Cost: ${formatCurrency(calculation.costs.monthlyCost)}
Usage: ${calculation.usage.inputTokens}/${calculation.usage.outputTokens} tokens, ${calculation.usage.monthlyRequests} requests/month
Efficiency Score: ${efficiencyScore.toFixed(1)}/100`

    try {
      await navigator.share({
        title: 'AI Cost Calculator Results',
        text: shareText,
        url: window.location.href
      })
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText)
    }
  }

  const handleExport = () => {
    if (!calculation) return

    const data = {
      model: {
        id: calculation.model.id,
        name: calculation.model.name,
        provider: calculation.model.provider
      },
      usage: calculation.usage,
      costs: calculation.costs,
      breakdown: calculation.breakdown,
      recommendations,
      efficiencyScore,
      alternatives: comparison?.alternatives.map(alt => ({
        model: {
          id: alt.model.id,
          name: alt.model.name,
          provider: alt.model.provider
        },
        monthlyCost: alt.calculation.costs.monthlyCost,
        savings: alt.savings,
        savingsPercentage: alt.savingsPercentage
      })) || [],
      calculatedAt: calculation.calculatedAt.toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-cost-calculation-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading || !calculation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Calculating your costs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Main Cost Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cost-display text-center"
      >
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-2xl font-bold text-gray-900 mr-3">
              {calculation.model.name}
            </h3>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
              {calculation.model.provider}
            </span>
          </div>
          <p className="text-gray-600">
            {calculation.usage.inputTokens.toLocaleString()}/{calculation.usage.outputTokens.toLocaleString()} tokens • {calculation.usage.monthlyRequests.toLocaleString()} requests/month
          </p>
        </div>
        
        <div className="text-4xl font-bold text-primary-600 mb-2">
          {formatCurrency(calculation.costs.monthlyCost)}
        </div>
        <div className="text-gray-600">per month</div>
        
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div>{formatCurrency(calculation.costs.yearlyCost)} per year</div>
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Efficiency: {efficiencyScore.toFixed(1)}/100
          </div>
        </div>
      </motion.div>

      {/* Cost Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h4 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Input tokens cost</span>
            <span className="font-medium">{formatCurrency(calculation.costs.inputCostPerRequest)} per request</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Output tokens cost</span>
            <span className="font-medium">{formatCurrency(calculation.costs.outputCostPerRequest)} per request</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Total per request</span>
              <span className="font-medium">{formatCurrency(calculation.costs.totalCostPerRequest)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600">Daily Cost</div>
              <div className="font-medium">{formatCurrency(calculation.costs.dailyCost)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Tokens/Month</div>
              <div className="font-medium">{calculation.breakdown.totalTokensPerMonth.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alternative Models */}
      {comparison?.alternatives && comparison.alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-gray-900">Cost-Effective Alternatives</h4>
          </div>
          <div className="space-y-3">
            {comparison.alternatives.map((alt, index) => (
              <div key={alt.model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 mr-2">{alt.model.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {alt.model.provider}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatCurrency(alt.calculation.costs.monthlyCost)}/month
                  </div>
                </div>
                <div className="text-right">
                  {alt.savings > 0 ? (
                    <div className="text-green-600 font-medium">
                      <div>Save {formatCurrency(alt.savings)}/month</div>
                      <div className="text-xs">({alt.savingsPercentage.toFixed(1)}% less)</div>
                    </div>
                  ) : (
                    <div className="text-red-600 font-medium">
                      <div>+{formatCurrency(Math.abs(alt.savings))}/month</div>
                      <div className="text-xs">({Math.abs(alt.savingsPercentage).toFixed(1)}% more)</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-6"
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Cost Optimization Recommendations</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button
          onClick={onRecalculate}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Recalculate
        </Button>
        
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
        
        <Button
          onClick={handleShare}
          variant="primary"
          className="flex items-center"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </Button>
      </motion.div>
    </div>
  )
}