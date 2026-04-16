import React from 'react';
import { formatFullDateTime } from '../../../hooks/useAppointments';
import { Check, Clock, X, CircleDot } from 'lucide-react';

const AppointmentDetailStatus = ({
    originalStatus,
    createdAt,
    updatedAt,
    cancellationReason,
    rejectionReason,
    approvalStatus,
    rawId,
}) => {
    const isCancelled =
        originalStatus === 'CANCELLED' ||
        originalStatus === 'LATE_CANCEL' ||
        originalStatus === 'NO_SHOW';
    const isApproved = (approvalStatus || '').toLowerCase() === 'approved' || originalStatus === 'CONFIRMED' || originalStatus === 'COMPLETED';
    const isRejected = (approvalStatus || '').toLowerCase() === 'rejected';
    const isPending = originalStatus === 'PENDING' && !isApproved && !isRejected;
    const isCompleted = originalStatus === 'COMPLETED';

    const getSteps = () => {
        // Step 1: Request (Always same)
        const step1 = {
            id: 'requested',
            title: 'Request Submitted',
            desc: 'Your appointment request was submitted.',
            time: formatFullDateTime(createdAt),
            status: 'completed',
        };

        // Step 2: Response/Action
        let step2 = { id: 'status' };
        
        // REJECTED BRANCH: Clean 2-step flow
        if (isRejected) {
            step2 = {
                ...step2,
                title: 'Request Declined',
                desc: rejectionReason 
                    ? `Rejection Reason: ${rejectionReason}`
                    : "Unfortunately, the Doctor cannot accommodate this time.",
                time: formatFullDateTime(updatedAt),
                status: 'error',
                color: 'red',
            };
            return [step1, step2];
        }

        // CANCELLED BEFORE APPROVAL: Clean 2-step flow
        if (isCancelled && !isApproved) {
            step2 = {
                ...step2,
                title: 'Request Cancelled',
                desc: cancellationReason 
                    ? `Cancellation Reason: ${cancellationReason}`
                    : 'User cancelled the appointment.',
                time: formatFullDateTime(updatedAt),
                status: 'error',
                color: 'red',
            };
            return [step1, step2];
        }

        // APPROVED STATE
        if (isApproved) {
            step2 = {
                ...step2,
                title: 'Appointment Confirmed',
                desc: 'Our Doctor has approved your requested schedule.',
                time: formatFullDateTime(updatedAt),
                status: 'completed',
                color: 'brand',
            };
        } 
        // STILL PENDING
        else {
            step2 = {
                ...step2,
                title: 'Reviewing Request',
                desc: 'Awaiting review and approval from our Doctor.',
                status: 'active',
                color: 'amber',
            };
        }

        // Step 3: Visit/Outcome (Only if Approved or Pending)
        // Note: For pending, it stays "Awaiting Visit" until approved.
        let step3 = { id: 'visit' };
        
        if (isCompleted) {
            step3 = {
                ...step3,
                title: 'Visit Completed',
                desc: 'Thank you for visiting us! Your treatment is complete.',
                status: 'completed',
            };
        } 
        else if (isCancelled && isApproved) {
            // Cancelled after it was already approved
            step3 = {
                ...step3,
                title: 'Appointment Cancelled',
                desc: cancellationReason 
                    ? `Cancellation Reason: ${cancellationReason}`
                    : 'User cancelled the appointment.',
                time: formatFullDateTime(updatedAt),
                status: 'error',
                color: 'red',
            };
        }
        else if (isApproved) {
            step3 = {
                ...step3,
                title: 'Awaiting Visit',
                desc: "We'll notify you for your upcoming visit. marked completed after visit.",
                status: 'pending-active',
            };
        }
        else {
            step3 = {
                ...step3,
                title: 'Awaiting Visit',
                desc: 'Your appointment will be marked complete after your visit.',
                status: 'pending',
            };
        }

        return [step1, step2, step3];
    };

    const steps = getSteps();

    const getIcon = (status) => {
        if (status === 'completed') return <Check size={18} strokeWidth={3} />;
        if (status === 'error') return <X size={18} strokeWidth={3} />;
        if (status === 'active' || status === 'pending-active') return <CircleDot size={18} strokeWidth={3} />;
        return <div className='w-2.5 h-2.5 rounded-full bg-current opacity-30' />;
    };

    return (
        <div className='animate-[fadeIn_0.2s_ease-out]'>
            {/* Horizontal Timeline Container */}
            <div className='relative w-full overflow-x-auto no-scrollbar pb-2 sm:pb-6'>
                <div className='flex items-start justify-center'>
                    <div className='flex items-start justify-between w-full max-w-4xl sm:px-4'>
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        const isCompletedStep = step.status === 'completed';
                        const isErrorStep = step.status === 'error';
                        const isActiveStep = step.status === 'active' || step.status === 'pending-active';
                        
                        return (
                            <div key={step.id} className='relative flex flex-col items-center text-center flex-1'>
                                {/* Connector Line */}
                                {!isLast && (
                                    <div className='absolute top-[1.125rem] sm:top-6 left-1/2 w-full h-[2px] bg-gray-100 dark:bg-white/5'>
                                        <div 
                                            className={`h-full transition-all duration-700 ${isCompletedStep ? 'bg-brand-500 w-full' : 'w-0'}`} 
                                        />
                                    </div>
                                )}

                                {/* Step Icon/Dot */}
                                <div className='relative z-10 mb-3 sm:mb-6'>
                                    <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                                        isCompletedStep 
                                            ? 'bg-brand-500 text-white shadow-brand-500/20' 
                                            : isErrorStep 
                                                ? 'bg-red-500 text-white shadow-red-500/20'
                                                : isActiveStep
                                                    ? 'bg-white dark:bg-gray-800 border-2 border-brand-500 text-brand-500'
                                                    : 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 text-gray-300'
                                    }`}>
                                        <div className='scale-[0.8] sm:scale-100'>
                                            {getIcon(step.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Step Label */}
                                <div className='px-4'>
                                    <h4 className='text-[13px] sm:text-[14px] font-black mb-1.5 transition-colors text-slate-900 dark:text-white'>
                                        {step.title}
                                    </h4>
                                    <p className='text-[11px] sm:text-[12px] font-bold leading-relaxed max-w-[160px] transition-colors text-slate-600 dark:text-gray-400'>
                                        {step.desc}
                                    </p>
                                    {step.time && (
                                        <div className='mt-2 text-[10px] text-slate-400 dark:text-gray-500 font-mono font-bold uppercase tracking-wider opacity-60'>
                                            {step.time}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
);
};

export default AppointmentDetailStatus;
