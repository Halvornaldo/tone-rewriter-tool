'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { WizardStep } from '@/components/features/ai-calculator/WizardStep'
import { StepIndicator } from '@/components/features/ai-calculator/StepIndicator'
import { ModelSelectionStep } from '@/components/features/ai-calculator/steps/ModelSelectionStep'
import { UsageInputStep } from '@/components/features/ai-calculator/steps/UsageInputStep'
import { CostResultsStep } from '@/components/features/ai-calculator/steps/CostResultsStep'

export interface CalculatorData {
  selectedModel: string | null
  inputTokens: number
  outputTokens: number
  monthlyRequests: number
  costResults?: {
    inputCost: number
    outputCost: number
    totalCost: number
    monthlyCost: number
  }
}

const STEPS = [
  {
    id: 'model',
    title: 'Select AI Model',
    description: 'Choose the AI model you want to calculate costs for'
  },
  {
    id: 'usage',
    title: 'Enter Usage Data',
    description: 'Provide your expected token usage and request frequency'
  },
  {
    id: 'results',
    title: 'View Results',
    description: 'See your calculated costs and optimization recommendations'
  }
] as const

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    selectedModel: null,
    inputTokens: 1000,
    outputTokens: 500,
    monthlyRequests: 100
  })

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on completed or current steps
    if (stepIndex <= currentStep || (stepIndex === 1 && calculatorData.selectedModel)) {
      setCurrentStep(stepIndex)
    }
  }

  const updateCalculatorData = (updates: Partial<CalculatorData>) => {
    setCalculatorData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return calculatorData.selectedModel !== null
      case 1:
        return calculatorData.inputTokens > 0 && calculatorData.outputTokens > 0 && calculatorData.monthlyRequests > 0
      case 2:
        return true
      default:
        return false
    }
  }

  const canProceed = isStepValid(currentStep)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/ai-cost-calculator" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Link>
          
          <div className="flex items-center mb-2">
            <Calculator className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AI Cost Calculator</h1>
          </div>
          <p className="text-gray-600">
            Follow the steps below to calculate your AI model costs
          </p>
        </div>

        {/* Step Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <StepIndicator
                  stepNumber={index + 1}
                  isCompleted={index < currentStep || (index === currentStep && isStepValid(index))}
                  isCurrent={index === currentStep}
                  isClickable={index <= currentStep || (index === 1 && calculatorData.selectedModel)}
                  onClick={() => handleStepClick(index)}
                  title={step.title}
                  description={step.description}
                />
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <WizardStep
            title={STEPS[currentStep].title}
            description={STEPS[currentStep].description}
            stepNumber={currentStep + 1}
            totalSteps={STEPS.length}
            isActive={true}
          >
            {currentStep === 0 && (
              <ModelSelectionStep
                selectedModel={calculatorData.selectedModel}
                onModelSelect={(model) => updateCalculatorData({ selectedModel: model })}
              />
            )}
            
            {currentStep === 1 && (
              <UsageInputStep
                inputTokens={calculatorData.inputTokens}
                outputTokens={calculatorData.outputTokens}
                monthlyRequests={calculatorData.monthlyRequests}
                onUsageChange={(usage) => updateCalculatorData(usage)}
              />
            )}
            
            {currentStep === 2 && (
              <CostResultsStep
                calculatorData={calculatorData}
                onRecalculate={() => setCurrentStep(1)}
              />
            )}
          </WizardStep>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            Step {currentStep + 1} of {STEPS.length}
          </div>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={() => {
                // Handle completion - maybe save results or show success message
                console.log('Calculator completed!')
              }}
              className="flex items-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Complete
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}