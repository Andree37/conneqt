import React, { cloneElement, useState } from 'react'

const BetterStepper = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            <a
              href={step.href}
              className={`group flex flex-col border-l-4 py-2 pl-4 ${
                currentStep === index ? 'border-indigo-600' : 'border-gray-300'
              } hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
            >
              <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                {step.id}
              </span>
              <span className="text-sm font-medium">{step.name}</span>
            </a>
          </li>
        ))}
      </ol>
      <div className="mt-8">
        {cloneElement(steps[currentStep].component, {
          goToNextStep,
          goToPrevStep,
          isLastStep: currentStep === steps.length - 1,
        })}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          className={`rounded-md px-4 py-2 ${
            currentStep === 0
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={goToPrevStep}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button
          className={`rounded-md px-4 py-2 ${
            currentStep === steps.length - 1
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={goToNextStep}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default BetterStepper
