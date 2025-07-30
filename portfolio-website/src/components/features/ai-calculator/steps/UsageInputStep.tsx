import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, TrendingUp, Calculator, Users } from 'lucide-react'
import { Input } from '@/components/ui'

interface UsageInputStepProps {
  inputTokens: number
  outputTokens: number
  monthlyRequests: number
  onUsageChange: (usage: {
    inputTokens: number
    outputTokens: number
    monthlyRequests: number
  }) => void
}

interface UsagePreset {
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  inputTokens: number
  outputTokens: number
  monthlyRequests: number
}

const USAGE_PRESETS: UsagePreset[] = [
  {
    name: 'Light Usage',
    description: 'Small projects, occasional queries',
    icon: Users,
    inputTokens: 500,
    outputTokens: 200,
    monthlyRequests: 50
  },
  {
    name: 'Medium Usage',
    description: 'Regular development, moderate automation',
    icon: TrendingUp,
    inputTokens: 1500,
    outputTokens: 800,
    monthlyRequests: 300
  },
  {
    name: 'Heavy Usage',
    description: 'Production apps, high-volume processing',
    icon: Calculator,
    inputTokens: 5000,
    outputTokens: 2500,
    monthlyRequests: 1000
  }
]

export const UsageInputStep: React.FC<UsageInputStepProps> = ({
  inputTokens,
  outputTokens,
  monthlyRequests,
  onUsageChange
}) => {
  const [showHelp, setShowHelp] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0)
    onUsageChange({
      inputTokens: field === 'inputTokens' ? numValue : inputTokens,
      outputTokens: field === 'outputTokens' ? numValue : outputTokens,
      monthlyRequests: field === 'monthlyRequests' ? numValue : monthlyRequests
    })
  }

  const applyPreset = (preset: UsagePreset) => {
    onUsageChange({
      inputTokens: preset.inputTokens,
      outputTokens: preset.outputTokens,
      monthlyRequests: preset.monthlyRequests
    })
  }

  return (
    <div className="space-y-8">
      {/* Quick Presets */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {USAGE_PRESETS.map((preset, index) => (
            <motion.button
              key={preset.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => applyPreset(preset)}
              className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <preset.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{preset.name}</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Input: {preset.inputTokens.toLocaleString()} tokens</div>
                <div>Output: {preset.outputTokens.toLocaleString()} tokens</div>
                <div>Requests: {preset.monthlyRequests.toLocaleString()}/month</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Input Fields */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Input Tokens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center">
              <label htmlFor="inputTokens" className="block text-sm font-medium text-gray-700">
                Input Tokens (per request)
              </label>
              <button
                onClick={() => setShowHelp(showHelp === 'input' ? null : 'input')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            
            <Input
              id="inputTokens"
              type="number"
              min="0"
              value={inputTokens}
              onChange={(e) => handleInputChange('inputTokens', e.target.value)}
              className="calculator-input"
              placeholder="e.g., 1000"
            />
            
            {showHelp === 'input' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"
              >
                <p><strong>Input tokens</strong> are the tokens in your prompt/question sent to the AI model. 
                Typically 100-2000 tokens per request depending on context length.</p>
              </motion.div>
            )}
          </motion.div>

          {/* Output Tokens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center">
              <label htmlFor="outputTokens" className="block text-sm font-medium text-gray-700">
                Output Tokens (per request)
              </label>
              <button
                onClick={() => setShowHelp(showHelp === 'output' ? null : 'output')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            
            <Input
              id="outputTokens"
              type="number"
              min="0"
              value={outputTokens}
              onChange={(e) => handleInputChange('outputTokens', e.target.value)}
              className="calculator-input"
              placeholder="e.g., 500"
            />
            
            {showHelp === 'output' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"
              >
                <p><strong>Output tokens</strong> are the tokens in the AI model's response. 
                Usually 50-1000 tokens depending on response length.</p>
              </motion.div>
            )}
          </motion.div>

          {/* Monthly Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center">
              <label htmlFor="monthlyRequests" className="block text-sm font-medium text-gray-700">
                Monthly Requests
              </label>
              <button
                onClick={() => setShowHelp(showHelp === 'requests' ? null : 'requests')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            
            <Input
              id="monthlyRequests"
              type="number"
              min="0"
              value={monthlyRequests}
              onChange={(e) => handleInputChange('monthlyRequests', e.target.value)}
              className="calculator-input"
              placeholder="e.g., 100"
            />
            
            {showHelp === 'requests' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"
              >
                <p><strong>Monthly requests</strong> is how many times you'll call the AI model per month. 
                Consider your app's expected usage volume.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Usage Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <h4 className="font-medium text-gray-900 mb-3">Usage Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Input tokens/request:</span>
            <span className="font-medium">{inputTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Output tokens/request:</span>
            <span className="font-medium">{outputTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly requests:</span>
            <span className="font-medium">{monthlyRequests.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total input tokens/month:</span>
              <span className="font-medium text-primary-600">
                {(inputTokens * monthlyRequests).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total output tokens/month:</span>
              <span className="font-medium text-primary-600">
                {(outputTokens * monthlyRequests).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}