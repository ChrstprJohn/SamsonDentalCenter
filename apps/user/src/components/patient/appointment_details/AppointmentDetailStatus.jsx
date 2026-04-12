import React from 'react';
import { formatFullDateTime } from '../../../hooks/useAppointments';
import { Check, Clock, X, CircleDot } from 'lucide-react';

const AppointmentDetailStatus = ({
    originalStatus,
    createdAt,
    updatedAt,
    cancellationReason,
    rejectionReason,
    rawId,
}) => {
    const isCancelled =
        originalStatus === 'CANCELLED' ||
        originalStatus === 'LATE_CANCEL' ||
        originalStatus === 'NO_SHOW';
    const isConfirmed = originalStatus === 'CONFIRMED' || originalStatus === 'COMPLETED';
    const isCompleted = originalStatus === 'COMPLETED';

    const getTimeline = () => {
        return [
            {
                id: 'requested',
                title: 'Request Sent',
                desc: 'Your appointment request was submitted.',
                timeTitle: 'Requested At',
                timeDetail: formatFullDateTime(createdAt),
                status: 'completed', // Requested is always past
            },
            {
                id: 'confirmed',
                title: isCancelled ? 'Request Cancelled' : 'Confirmed by Clinic',
                desc: isCancelled
                    ? cancellationReason
                        ? `Cancelled: ${cancellationReason}`
                        : rejectionReason
                          ? `Rejected: ${rejectionReason}`
                          : 'This appointment was cancelled.'
                    : isConfirmed
                      ? 'Your appointment has been officially scheduled.'
                      : 'Awaiting review and approval from our team.',
                timeTitle: isCancelled ? 'Cancelled At' : isConfirmed ? 'Approved At' : 'Status',
                timeDetail:
                    isCancelled || isConfirmed
                        ? formatFullDateTime(updatedAt || createdAt)
                        : 'Under Review',
                status: isCancelled ? 'error' : isConfirmed ? 'completed' : 'active',
            },
            !isCancelled && {
                id: 'completed',
                title: 'Treatment Completed',
                desc: isCompleted
                    ? 'Thank you for visiting us! Your treatment is complete.'
                    : 'Your appointment will be marked complete after your visit.',
                timeTitle: isCompleted ? 'Completed At' : 'Status',
                timeDetail: isCompleted
                    ? formatFullDateTime(updatedAt || createdAt)
                    : 'Awaiting Visit',
                status: isCompleted ? 'completed' : 'pending',
            },
        ].filter(Boolean);
    };

    const timeline = getTimeline();

    const getIconForStatus = (status, isActive) => {
        if (status === 'completed')
            return (
                <Check
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                />
            );
        if (status === 'error')
            return (
                <X
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                />
            );
        if (isActive)
            return (
                <Clock
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                />
            );
        return (
            <CircleDot
                size={14}
                strokeWidth={3}
                className='text-brand-200 dark:text-gray-600'
            />
        );
    };

    const getColorsForStatus = (status) => {
        if (status === 'completed')
            return { bg: 'bg-brand-500', border: 'border-brand-500', line: 'bg-brand-500' };
        if (status === 'error')
            return {
                bg: 'bg-red-500',
                border: 'border-red-500',
                line: 'bg-gray-100 dark:bg-gray-800',
            };
        if (status === 'active')
            return {
                bg: 'bg-amber-400',
                border: 'border-amber-400',
                line: 'bg-gray-100 dark:bg-gray-800',
            };
        return {
            bg: 'bg-white dark:bg-gray-900',
            border: 'border-gray-200 dark:border-gray-700',
            line: 'bg-gray-100 dark:bg-gray-800',
        };
    };

    return (
        <div className='mb-12 sm:mb-16 animate-[fadeIn_0.2s_ease-out]'>
            <div className='flex items-center gap-4 mb-8 sm:mb-10'>
                <h2 className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest'>
                    Event Timeline
                </h2>
                <div className='h-px grow bg-gray-200 dark:bg-gray-800'></div>
                <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono font-medium'>
                    ID: {rawId?.slice(0, 8).toUpperCase()}
                </span>
            </div>

            {/* Vertical Shipment-style Tracker */}
            <div className='relative ml-4 sm:ml-6'>
                {timeline.map((item, index) => {
                    const isLast = index === timeline.length - 1;
                    const isActive = item.status === 'active';
                    const colors = getColorsForStatus(item.status);

                    return (
                        <div
                            key={item.id}
                            className='relative pl-10 sm:pl-12 pb-10 sm:pb-12 last:pb-0'
                        >
                            {/* Connecting Line */}
                            {!isLast && (
                                <div
                                    className={`absolute top-8 -bottom-2 -left-px w-0.5 rounded-full transition-all ${colors.line}`}
                                />
                            )}

                            {/* Dot / Icon */}
                            <div
                                className={`absolute top-2 -left-3 w-6 h-6 rounded-full flex items-center justify-center transition-all ${colors.bg}`}
                            >
                                {getIconForStatus(item.status, isActive)}
                            </div>

                            {/* Content */}
                            <div
                                className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${item.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}
                            >
                                <div className='flex-1 max-w-lg'>
                                    <h4
                                        className={`text-base sm:text-lg font-bold tracking-tight mb-2 ${item.status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}
                                    >
                                        {item.title}
                                    </h4>
                                    <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
                                        {item.desc}
                                    </p>
                                </div>
                                <div className='sm:text-right mt-2 sm:mt-0'>
                                    <div className='text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mb-1'>
                                        {item.timeTitle}
                                    </div>
                                    <div className='text-sm sm:text-base text-gray-900 dark:text-gray-200 font-mono font-medium'>
                                        {item.timeDetail}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AppointmentDetailStatus;
