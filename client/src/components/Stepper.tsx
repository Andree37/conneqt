import React, { useState } from 'react'

const steps = [
  { id: 'Step 1', name: 'Job details', href: '#', status: 'complete' },
  { id: 'Step 2', name: 'Application form', href: '#', status: 'current' },
  { id: 'Step 3', name: 'Preview', href: '#', status: 'upcoming' },
]

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            {step.status === 'complete' ? (
              <a
                href={step.href}
                className={`group flex flex-col border-l-4 py-2 pl-4 ${
                  currentStep === index + 1
                    ? 'border-indigo-600'
                    : 'border-gray-300'
                } hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
              >
                <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : step.status === 'current' ? (
              <a
                href={step.href}
                className={`flex flex-col border-l-4 py-2 pl-4 ${
                  currentStep === index + 1
                    ? 'border-indigo-600'
                    : 'border-gray-300'
                } md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                aria-current="step"
              >
                <span className="text-sm font-medium text-indigo-600">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                href={step.href}
                className={`group flex flex-col border-l-4 py-2 pl-4 ${
                  currentStep === index + 1
                    ? 'border-gray-200'
                    : 'border-gray-300'
                } hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-8 flex justify-between">
        <button
          className={`rounded-md px-4 py-2 ${
            currentStep === 1
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={goToPrevStep}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className={`rounded-md px-4 py-2 ${
            currentStep === steps.length
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={goToNextStep}
          disabled={currentStep === steps.length}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Stepper
