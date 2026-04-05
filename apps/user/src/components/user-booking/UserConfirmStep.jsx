import { useState } from 'react';
import {
    Calendar,
    Clock,
    Stethoscope,
    User,
    AlertCircle,
    Info,
    Zap,
    RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserConfirmStep = ({ formData, book_for_others, onSubmit, onBack, submitting, error }) => {
    // ✅ NEW: Track retry state (GAP-10)
    const [isRetrying, setIsRetrying] = useState(false);
    const { user } = useAuth();

    // Determine scenario
    const hasBooking = formData?.time;
    const hasWaitlist = formData?.waitlist_time;
    const isWaitlistOnly = hasWaitlist && !hasBooking;
    const isDualSelection = hasBooking && hasWaitlist;

    // Determine if this is a specialized service
    const isSpecialized = formData.service_tier === 'specialized';

    // Dynamic title based on scenario
    let stepTitle = 'Review & Submit Request';
    if (isWaitlistOnly) {
        stepTitle = 'Confirm Waitlist Entry';
    } else if (isDualSelection) {
        stepTitle = 'Review & Submit Request';
    }

    // ✅ NEW: Handle retry - resubmit with same data (GAP-10)
    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await onSubmit();
        } finally {
            setIsRetrying(false);
        }
    };

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>{stepTitle}</h2>
            <p className='text-slate-500 text-sm mb-6'>
                {isWaitlistOnly
                    ? 'Please review and confirm to be added to the waitlist.'
                    : 'Please review your appointment details and click submit to request your booking.'}
            </p>

            {/* ✅ UPDATED: Error Banner with Retry Button (GAP-10) */}
            {error && (
                <div className='bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6'>
                    <p className='text-red-700 text-sm font-bold mb-3 flex items-start gap-2'>
                        <AlertCircle
                            size={18}
                            className='shrink-0 mt-0.5'
                        />
                        {error}
                    </p>

                    <div className='flex flex-wrap gap-2 mb-3'>
                        {/* Retry Button - Primary Action */}
                        <button
                            onClick={handleRetry}
                            disabled={submitting || isRetrying}
                            className='
                                flex items-center gap-2 px-4 py-2
                                bg-red-600 hover:bg-red-700 disabled:bg-red-400
                                text-white font-medium rounded-lg
                                transition-colors duration-200 disabled:cursor-not-allowed
                            '
                        >
                            {submitting || isRetrying ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    Retrying...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={16} />
                                    Retry
                                </>
                            )}
                        </button>

                        {/* Back Button - Secondary Action */}
                        <button
                            onClick={onBack}
                            disabled={submitting || isRetrying}
                            className='
                                px-4 py-2 text-slate-700
                                border border-slate-300 hover:bg-slate-50
                                disabled:opacity-50 disabled:cursor-not-allowed
                                font-medium rounded-lg transition-colors
                            '
                        >
                            ← Go Back
                        </button>
                    </div>

                    {/* Helpful Tip */}
                    <div className='text-xs text-red-600 bg-red-100 p-2 rounded'>
                        <strong>💡 Tip:</strong> Check your connection and try again. If the problem
                        persists, go back and verify your selections.
                    </div>
                </div>
            )}

            {/* BOOKING ONLY: Display appointment details */}
            {hasBooking && !hasWaitlist && (
                <div className='bg-slate-50 rounded-xl p-6 mb-6 space-y-4'>
                    <div className='flex items-center gap-3'>
                        <Stethoscope
                            size={18}
                            className='text-sky-500 shrink-0'
                        />
                        <span className='text-sm text-slate-500'>Service</span>
                        <span className='text-sm font-medium text-slate-900'>
                            {formData.service_name}
                        </span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Calendar
                            size={18}
                            className='text-sky-500 shrink-0'
                        />
                        <span className='text-sm text-slate-500'>Date</span>
                        <span className='text-sm font-medium text-slate-900'>{formData.date}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Clock
                            size={18}
                            className='text-sky-500 shrink-0'
                        />
                        <span className='text-sm text-slate-500'>Time</span>
                        <span className='text-sm font-medium text-slate-900'>{formData.time}</span>
                    </div>
                    {formData.dentist_id && (
                        <div className='flex items-center gap-3 mt-1'>
                            <User
                                size={18}
                                className='text-sky-500 shrink-0'
                            />
                            <span className='text-sm text-slate-500'>Dentist</span>
                            <span className='text-sm font-medium text-slate-900'>
                                Specific Specialist Selected
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* WAITLIST ONLY: Display waitlist details */}
            {hasWaitlist && !hasBooking && (
                <>
                    <div className='bg-slate-50 rounded-xl p-6 mb-6 space-y-4'>
                        <div className='flex items-center gap-3'>
                            <Stethoscope
                                size={18}
                                className='text-amber-500 shrink-0'
                            />
                            <span className='text-sm text-slate-500'>Service</span>
                            <span className='text-sm font-medium text-slate-900'>
                                {formData.service_name}
                            </span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Calendar
                                size={18}
                                className='text-amber-500 shrink-0'
                            />
                            <span className='text-sm text-slate-500'>Preferred Date</span>
                            <span className='text-sm font-medium text-slate-900'>
                                {formData.waitlist_date}
                            </span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Clock
                                size={18}
                                className='text-amber-500 shrink-0'
                            />
                            <span className='text-sm text-slate-500'>Preferred Time</span>
                            <span className='text-sm font-medium text-slate-900'>
                                {formData.waitlist_time}
                            </span>
                        </div>
                    </div>

                    {/* ⚠️ Warning persists in Confirm step for waitlist-only */}
                    <div className='bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6'>
                        <div className='flex items-start gap-3'>
                            <AlertCircle
                                size={20}
                                className='text-amber-600 shrink-0 mt-0.5'
                            />
                            <div>
                                <p className='text-sm font-bold text-amber-900 mb-1'>
                                    Confirm Waitlist Entry
                                </p>
                                <p className='text-sm text-amber-800'>
                                    This will add you to the <strong>WAITLIST ONLY</strong>. No
                                    appointment is confirmed yet. You'll be notified when this slot
                                    becomes available.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* DUAL SELECTION: Show both appointments */}
            {isDualSelection && (
                <>
                    <div className='space-y-4 mb-6'>
                        {/* Booking Card */}
                        <div className='bg-sky-50 border border-sky-200 rounded-xl p-4'>
                            <h4 className='text-sm font-semibold text-sky-900 mb-3 flex items-center gap-2'>
                                <span className='text-lg'>⏳</span> Appointment (For Approval)
                            </h4>
                            <div className='space-y-2 ml-6'>
                                <div className='flex items-center gap-2 text-sm'>
                                    <Stethoscope
                                        size={16}
                                        className='text-sky-600'
                                    />
                                    <span className='text-slate-500'>Service:</span>
                                    <span className='font-medium'>{formData.service_name}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <Calendar
                                        size={16}
                                        className='text-sky-600'
                                    />
                                    <span className='text-slate-500'>Date:</span>
                                    <span className='font-medium'>{formData.date}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <Clock
                                        size={16}
                                        className='text-sky-600'
                                    />
                                    <span className='text-slate-500'>Time:</span>
                                    <span className='font-medium text-sky-600'>
                                        {formData.time}
                                    </span>
                                </div>
                                {formData.dentist_id && (
                                    <div className='flex items-center gap-2 text-sm mt-1'>
                                        <User
                                            size={16}
                                            className='text-sky-600'
                                        />
                                        <span className='text-slate-500'>Dentist:</span>
                                        <span className='font-medium'>Specific Specialist Selected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Waitlist Card */}
                        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4'>
                            <h4 className='text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2'>
                                <span className='text-lg'>⏳</span> Waitlist Entry
                            </h4>
                            <div className='space-y-2 ml-6'>
                                <div className='flex items-center gap-2 text-sm'>
                                    <Stethoscope
                                        size={16}
                                        className='text-amber-600'
                                    />
                                    <span className='text-slate-500'>Service:</span>
                                    <span className='font-medium'>{formData.service_name}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <Calendar
                                        size={16}
                                        className='text-amber-600'
                                    />
                                    <span className='text-slate-500'>Preferred Date:</span>
                                    <span className='font-medium'>{formData.waitlist_date}</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <Clock
                                        size={16}
                                        className='text-amber-600'
                                    />
                                    <span className='text-slate-500'>Preferred Time:</span>
                                    <span className='font-medium text-amber-600'>
                                        {formData.waitlist_time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info box explaining dual selection */}
                    <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6'>
                        <div className='flex gap-3'>
                            <Info
                                size={18}
                                className='text-blue-600 shrink-0 mt-0.5'
                            />
                            <div>
                                <p className='text-sm font-semibold text-blue-900 mb-2'>
                                    What Happens When You Confirm
                                </p>
                                <ol className='text-sm text-blue-800 space-y-1 ml-2 list-decimal'>
                                    <li>
                                        Your {formData.time} appointment will be{' '}
                                        <strong>FOR APPROVAL</strong>
                                    </li>
                                    <li>
                                        You'll be added to the {formData.waitlist_time}{' '}
                                        <strong>WAITLIST</strong>
                                    </li>
                                    <li>Both will show in your dashboard</li>
                                    <li>
                                        If {formData.waitlist_time} opens, you can choose to switch
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Show who appointment is for */}
            {book_for_others && formData.booked_for_name && (
                <div className='bg-slate-50 rounded-xl p-4 mb-6'>
                    <div className='flex items-center gap-3'>
                        <User
                            size={16}
                            className='text-amber-500 shrink-0'
                        />
                        <span className='text-sm text-slate-500'>Appointment For:</span>
                        <span className='text-sm font-medium text-slate-900'>
                            {formData.booked_for_name}
                        </span>
                    </div>
                </div>
            )}

            {/* Confirmation email info */}
            <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6'>
                <p className='text-sm text-blue-800'>
                    <span className='font-semibold'>📧 Confirmation Email:</span>
                    <br />
                    <span className='text-xs'>
                        {book_for_others
                            ? `Sent to your account (${user?.email}), not to ${formData.booked_for_name}`
                            : `Sent to ${user?.email}`}
                    </span>
                </p>
            </div>

            {/* SERVICE TIER MESSAGING: All online bookings now require approval */}
            {hasBooking && (
                <>
                    {/* Approval Required Info */}
                    <div className='bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4 flex items-start gap-3'>
                        <Clock
                            size={18}
                            className='text-amber-600 shrink-0 mt-0.5'
                        />
                        <div>
                            <p className='text-sm font-semibold text-amber-900 mb-1'>
                                ⏳ Requires Admin Approval
                            </p>
                            <p className='text-sm text-amber-800'>
                                To ensure the best care, all online requests are reviewed by our
                                clinical team. Your appointment will be confirmed once {formData.dentist_id ? 'your selected specialist is confirmed' : 'a dentist is assigned'} (usually within 24 hours).
                            </p>
                        </div>
                    </div>

                    {/* What Happens Next */}
                    <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8'>
                        <div className='flex gap-3'>
                            <Info
                                size={18}
                                className='text-blue-600 shrink-0 mt-0.5'
                            />
                            <div>
                                <p className='text-sm font-semibold text-blue-900 mb-2'>
                                    What Happens Next?
                                </p>
                                <ol className='text-sm text-blue-800 space-y-1 ml-2 list-decimal'>
                                    <li>Your request is submitted for review</li>
                                    <li>Our team reviews and {formData.dentist_id ? 'confirms the specialist' : 'assigns a dentist'}</li>
                                    <li>You'll receive a confirmation email once approved</li>
                                    <li>You can then view/manage it from your dashboard</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Navigation */}
            <div className='flex justify-between'>
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className='text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5 disabled:opacity-50'
                >
                    ← Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting || error}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-xl 
                               transition-colors shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed 
                               flex items-center gap-2'
                >
                    {submitting ? (
                        <>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            {isWaitlistOnly
                                ? 'Adding to Waitlist...'
                                : isDualSelection
                                  ? 'Submitting...'
                                  : isSpecialized
                                    ? 'Submitting Request...'
                                    : 'Submitting Request...'}
                        </>
                    ) : (
                        <>
                            {isWaitlistOnly ? '✓ Join Waitlist' : '✓ Submit Request'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserConfirmStep;
