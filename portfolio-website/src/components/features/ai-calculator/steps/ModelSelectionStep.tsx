import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Star, TrendingUp, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AI_MODELS, AIModel } from '@/lib/ai-cost-calculator'

interface ModelSelectionStepProps {
  selectedModel: string | null
  onModelSelect: (modelId: string) => void
}

export const ModelSelectionStep: React.FC<ModelSelectionStepProps> = ({
  selectedModel,
  onModelSelect
}) => {
  return (
    <div className="space-y-6">
      {/* Popular Models Section */}
      <div>
        <div className="flex items-center mb-4">
          <Star className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Popular Models</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_MODELS.filter(model => model.popular).map((model, index) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={selectedModel === model.id}
              onSelect={() => onModelSelect(model.id)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* All Models Section */}
      <div>
        <div className="flex items-center mb-4">
          <Zap className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">All Models</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_MODELS.map((model, index) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={selectedModel === model.id}
              onSelect={() => onModelSelect(model.id)}
              index={index}
              compact
            />
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 border border-primary-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
            <span className="text-primary-800 font-medium">
              Selected: {AI_MODELS.find(m => m.id === selectedModel)?.name}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface ModelCardProps {
  model: AIModel
  isSelected: boolean
  onSelect: () => void
  index: number
  compact?: boolean
}

const ModelCard: React.FC<ModelCardProps> = ({ 
  model, 
  isSelected, 
  onSelect, 
  index,
  compact = false 
}) => {
  const formatContextWindow = (contextWindow: number): string => {
    if (contextWindow >= 1000) {
      return `${(contextWindow / 1000).toFixed(0)}K`
    }
    return contextWindow.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        'model-card',
        isSelected && 'selected',
        'relative'
      )}
    >
      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {model.recommended && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <TrendingUp className="w-3 h-3 mr-1" />
            Recommended
          </span>
        )}
        {model.popular && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </span>
        )}
      </div>

      {/* Model Info */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 mb-1">{model.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{model.provider}</p>
        {!compact && (
          <p className="text-sm text-gray-500 leading-relaxed">{model.description}</p>
        )}
      </div>

      {/* Pricing */}
      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-1" />
          <span>${model.pricing.input}/1K in</span>
        </div>
        <div className="text-gray-600">
          <span>${model.pricing.output}/1K out</span>
        </div>
      </div>

      {/* Tags and Context */}
      <div className="flex flex-wrap gap-1 mb-2">
        {model.tags.slice(0, compact ? 2 : 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-500">
        Context: {formatContextWindow(model.contextWindow)}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </motion.div>
      )}
    </motion.div>
  )
}