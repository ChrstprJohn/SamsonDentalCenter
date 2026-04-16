import { Check } from 'lucide-react';

/**
 * Redesigned StepIndicator:
 * - Compact horizontal layout for sticky header
 * - Uses brand-500 palette
 * - Mobile-responsive: Hide labels on small screens
 */
const StepIndicator = ({ currentStep, onStepClick, labels }) => {
    const defaultLabels = ['Service', 'Date & Time', 'Your Info', 'Review', 'Confirm'];
    const stepLabels = labels || defaultLabels;

    return (
        <nav className='flex items-center justify-center gap-2 sm:gap-6'>
            {stepLabels.map((label, index) => {
                const isCompleted = index + 1 < currentStep;
                const isActive = index + 1 === currentStep;

                return (
                    <div key={label} className='flex items-center'>
                        <button
                            onClick={() => onStepClick(index)}
                            disabled={index + 1 > currentStep}
                            className={`flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 group transition-all ${
                                index + 1 <= currentStep ? 'cursor-pointer' : 'cursor-default opacity-50'
                            }`}
                        >
                            {/* Circle */}
                            <div
                                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                                    isCompleted
                                        ? 'bg-brand-500 text-white shadow-theme-xs'
                                        : isActive
                                          ? 'bg-brand-500 text-white ring-4 ring-brand-500/10 shadow-theme-xs scale-110'
                                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 shadow-theme-xs'
                                }`}
                            >
                                {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
                            </div>

                            {/* Label: Under on Mobile, Right on Desktop */}
                            <span
                                className={`text-[9px] sm:text-sm font-bold tracking-tight whitespace-nowrap transition-colors text-center sm:text-left ${
                                    isActive
                                        ? 'text-gray-900 dark:text-white'
                                        : isCompleted
                                          ? 'text-gray-600 dark:text-gray-300'
                                          : 'text-gray-400 dark:text-gray-500'
                                }`}
                            >
                                {label}
                            </span>
                        </button>

                        {/* Connector line - Visible on all devices, adjusted for mobile positioning */}
                        {index < stepLabels.length - 1 && (
                            <div className={`w-3 sm:w-8 h-[1.5px] ml-2 sm:ml-4 sm:mr-1 ${
                                index + 1 < currentStep ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-800'
                            } ${
                                // On mobile, we need to shift the line up a bit to align with the circle center (not the whole flex-col block)
                                '-mt-4 sm:mt-0'
                            }`} />
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default StepIndicator;
