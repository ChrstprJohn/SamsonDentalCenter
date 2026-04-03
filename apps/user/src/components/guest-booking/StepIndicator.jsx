import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, onStepClick, labels }) => {
    const defaultLabels = ['Service', 'Date & Time', 'Your Info', 'Review', 'Confirm'];
    const stepLabels = labels || defaultLabels;

    return (
        <div className='flex items-center justify-between gap-1 sm:gap-6 mb-12 sm:mb-16 w-full px-2'>
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
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black transition-all duration-300 ${
                                    isCompleted
                                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                                        : isActive
                                          ? 'bg-sky-500 text-white ring-4 ring-sky-500/20 shadow-lg shadow-sky-500/20 scale-110'
                                          : 'bg-slate-100 text-slate-400'
                                }`}
                            >
                                {isCompleted ? <Check size={16} /> : index + 1}
                            </div>
                            <span
                                className={`hidden lg:inline text-[11px] font-black uppercase tracking-widest ${
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
                                className={`flex-1 h-0.5 min-w-[12px] sm:min-w-[40px] mx-1 sm:mx-4 rounded-full transition-all duration-500 ${
                                    index < currentStep ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]' : 'bg-slate-200'
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
