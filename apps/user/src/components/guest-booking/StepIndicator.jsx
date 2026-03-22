import { Check } from 'lucide-react';

const stepLabels = ['Service', 'Date & Time', 'Your Info', 'Review'];

const StepIndicator = ({ currentStep, onStepClick }) => {
    return (
        <div className='flex items-center justify-center gap-2 sm:gap-4 mb-10'>
            {stepLabels.map((label, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <div
                        key={label}
                        className='flex items-center'
                    >
                        {/* Step circle + label */}
                        <button
                            onClick={() => onStepClick(index)}
                            disabled={index >= currentStep}
                            className={`flex items-center gap-2 transition-colors ${
                                index < currentStep ? 'cursor-pointer' : 'cursor-default'
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                                    isCompleted
                                        ? 'bg-sky-500 text-white'
                                        : isActive
                                          ? 'bg-sky-500 text-white ring-4 ring-sky-500/20'
                                          : 'bg-slate-100 text-slate-400'
                                }`}
                            >
                                {isCompleted ? <Check size={14} /> : index + 1}
                            </div>
                            <span
                                className={`hidden sm:inline text-sm font-medium ${
                                    isActive
                                        ? 'text-sky-600'
                                        : isCompleted
                                          ? 'text-slate-700'
                                          : 'text-slate-400'
                                }`}
                            >
                                {label}
                            </span>
                        </button>

                        {/* Connector line */}
                        {index < stepLabels.length - 1 && (
                            <div
                                className={`w-8 sm:w-12 h-0.5 mx-2 ${
                                    index < currentStep ? 'bg-sky-500' : 'bg-slate-200'
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
