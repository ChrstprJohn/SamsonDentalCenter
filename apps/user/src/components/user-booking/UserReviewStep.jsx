import { useAuth } from '../../context/AuthContext';
import { User, Mail, Stethoscope, Calendar, Clock, AlertCircle, Info } from 'lucide-react';

const UserReviewStep = ({ formData, book_for_others, onNext, onBack }) => {
    const { user } = useAuth();

    // Determine scenario
    const hasBooking = formData?.time;
    const hasWaitlist = formData?.waitlist_time;
    const isWaitlistOnly = hasWaitlist && !hasBooking;
    const isDualSelection = hasBooking && hasWaitlist;

    // Determine if this is a specialized service
    const isSpecialized = formData.service_tier === 'specialized';

    // Dynamic step title based on scenario
    let stepTitle = 'Review Appointment';
    if (isWaitlistOnly) {
        stepTitle = 'Review Waitlist';
    } else if (isDualSelection) {
        stepTitle = 'Review Selections';
    }

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>{stepTitle}</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Please review your information. Everything shown below is read-only.
            </p>

            {/* ⚠️ WAITLIST-ONLY WARNING BANNER (Prominent, Persistent) */}
            {isWaitlistOnly && (
                <div className='bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6'>
                    <div className='flex items-start gap-3'>
                        <AlertCircle
                            size={20}
                            className='text-amber-600 shrink-0 mt-0.5'
                        />
                        <div>
                            <p className='text-sm font-bold text-amber-900 mb-2'>
                                ⚠️ IMPORTANT: Waitlist Only — No Appointment Confirmed
                            </p>
                            <p className='text-sm text-amber-800 mb-2'>
                                You are joining a WAITLIST, not booking an appointment. This means:
                            </p>
                            <ul className='text-sm text-amber-800 space-y-1 ml-2'>
                                <li>❌ You do NOT have a confirmed appointment yet</li>
                                <li>⏳ You will be notified when this time becomes available</li>
                                <li>
                                    ⏱️ You'll have 25 minutes to confirm or the slot goes to the
                                    next person
                                </li>
                                <li>📧 Check your email for the notification</li>
                            </ul>
                            <p className='text-sm text-amber-800 mt-2 font-medium'>
                                If you'd prefer a confirmed appointment, go back and select an
                                available time.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className='bg-slate-50 rounded-xl p-6 mb-6 space-y-4'>
                {/* Your Details Section */}
                <div className='border-b border-slate-200 pb-4'>
                    <h3 className='text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2'>
                        <User
                            size={16}
                            className='text-brand-500'
                        />
                        Your Details
                    </h3>
                    <div className='space-y-2 ml-6'>
                        <div className='text-sm'>
                            <span className='text-slate-500'>Name: </span>
                            <span className='font-medium text-slate-900'>
                                {user?.name || user?.email?.split('@')[0]}
                            </span>
                        </div>
                        <div className='text-sm'>
                            <span className='text-slate-500'>Email: </span>
                            <span className='font-medium text-slate-900'>{user?.email}</span>
                        </div>
                    </div>
                </div>

                {/* DUAL SELECTION: Show both sections */}
                {isDualSelection && (
                    <>
                        {/* Booking Section */}
                        <div className='border-b border-slate-200 pb-4'>
                            <h3 className='text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2'>
                                {isSpecialized ? (
                                    <>
                                        <Clock
                                            size={16}
                                            className='text-amber-500'
                                        />
                                        ⏳ Appointment (For Approval)
                                    </>
                                ) : (
                                    <>
                                        <Stethoscope
                                            size={16}
                                            className='text-brand-500'
                                        />
                                        ✅ Confirmed Appointment
                                    </>
                                )}
                            </h3>
                            <div className='space-y-2 ml-6'>
                                <div className='text-sm'>
                                    <span className='text-slate-500'>Service: </span>
                                    <span className='font-medium text-slate-900'>
                                        {formData.service_name}
                                    </span>
                                </div>
                                <div className='text-sm'>
                                    <span className='text-slate-500'>Date: </span>
                                    <span className='font-medium text-slate-900'>
                                        {formData.date}
                                    </span>
                                </div>
                                <div className='text-sm'>
                                    <span className='text-slate-500'>Time: </span>
                                    <span className='font-medium text-brand-600 text-lg'>
                                        {formData.time}
                                    </span>
                                </div>
                                {formData.dentist_id && (
                                    <div className='text-sm mt-1'>
                                        <span className='text-slate-500'>Dentist: </span>
                                        <span className='font-medium text-slate-900'>
                                            {/* Note: In a real app we'd show the name here. 
                                                Since we only have the ID, we'll indicate a specialist is chosen */}
                                            Specific Specialist Selected
                                        </span>
                                    </div>
                                )}
                                <div
                                    className={`text-xs font-medium mt-2 ${isSpecialized ? 'text-amber-600' : 'text-brand-600'
                                        }`}
                                >
                                    Status:{' '}
                                    {isSpecialized
                                        ? 'FOR APPROVAL when submitted (Specialized Service)'
                                        : 'CONFIRMED when submitted'}
                                </div>
                            </div>
                        </div>

                        {/* Waitlist Section */}
                        <div className='border-b border-slate-200 pb-4'>
                            <h3 className='text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2'>
                                <Clock
                                    size={16}
                                    className='text-amber-500'
                                />
                                ⏳ Waitlist Entry
                            </h3>
                            <div className='space-y-2 ml-6'>
                                <div className='text-sm'>
                                    <span className='text-slate-500'>Service: </span>
                                    <span className='font-medium text-slate-900'>
                                        {formData.service_name}
                                    </span>
                                </div>
                                <div className='text-sm'>
                                    <span className='text-slate-500'>Preferred Date: </span>
                                    <span className='font-medium text-slate-900'>
                                        {formData.waitlist_date}
                                    </span>
                                </div>
                                <div className='text-sm'>
                                    <span className='text-slate-500'>Preferred Time: </span>
                                    <span className='font-medium text-amber-600 text-lg'>
                                        {formData.waitlist_time}
                                    </span>
                                </div>
                                <div className='text-xs text-amber-600 font-medium mt-2'>
                                    Status: Added to waitlist when submitted
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* BOOKING ONLY: Show appointment details */}
                {hasBooking && !hasWaitlist && (
                    <div>
                        <h3 className='text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2'>
                            {isSpecialized ? (
                                <>
                                    <Clock
                                        size={16}
                                        className='text-amber-500'
                                    />
                                    Appointment (For Approval)
                                </>
                            ) : (
                                <>
                                    <Stethoscope
                                        size={16}
                                        className='text-brand-500'
                                    />
                                    Appointment Details
                                </>
                            )}
                        </h3>
                        <div className='space-y-2 ml-6'>
                            <div className='text-sm'>
                                <span className='text-slate-500'>Service: </span>
                                <span className='font-medium text-slate-900'>
                                    {formData.service_name}
                                </span>
                            </div>
                            <div className='text-sm'>
                                <span className='text-slate-500'>Date: </span>
                                <span className='font-medium text-slate-900'>{formData.date}</span>
                            </div>
                            <div className='text-sm'>
                                <span className='text-slate-500'>Time: </span>
                                <span className='font-medium text-slate-900'>{formData.time}</span>
                            </div>
                            {formData.dentist_id && (
                                <div className='text-sm mt-1'>
                                    <span className='text-slate-500'>Dentist: </span>
                                    <span className='font-medium text-slate-900 text-xs bg-brand-100 px-2 py-0.5 rounded-full'>
                                        Specific Specialist Selected
                                    </span>
                                </div>
                            )}
                            <div
                                className={`text-xs font-medium mt-2 ${isSpecialized ? 'text-amber-600' : 'text-brand-600'
                                    }`}
                            >
                                Status:{' '}
                                {isSpecialized
                                    ? 'FOR APPROVAL when submitted'
                                    : 'CONFIRMED when submitted'}
                            </div>
                        </div>
                    </div>
                )}

                {/* WAITLIST ONLY: Show waitlist details */}
                {hasWaitlist && !hasBooking && (
                    <div>
                        <h3 className='text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2'>
                            <Clock
                                size={16}
                                className='text-amber-500'
                            />
                            Waitlist Entry Details
                        </h3>
                        <div className='space-y-2 ml-6'>
                            <div className='text-sm'>
                                <span className='text-slate-500'>Service: </span>
                                <span className='font-medium text-slate-900'>
                                    {formData.service_name}
                                </span>
                            </div>
                            <div className='text-sm'>
                                <span className='text-slate-500'>Preferred Date: </span>
                                <span className='font-medium text-slate-900'>
                                    {formData.waitlist_date}
                                </span>
                            </div>
                            <div className='text-sm'>
                                <span className='text-slate-500'>Preferred Time: </span>
                                <span className='font-medium text-slate-900'>
                                    {formData.waitlist_time}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* If Booking For Others - Show Appointee Name */}
                {book_for_others && formData.booked_for_name && (
                    <div className='border-t border-slate-200 pt-4'>
                        <h3 className='text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2'>
                            <User
                                size={16}
                                className='text-amber-500'
                            />
                            Appointment For
                        </h3>
                        <div className='ml-6 text-sm font-medium text-slate-900'>
                            {formData.booked_for_name}
                        </div>
                    </div>
                )}
            </div>

            {/* ℹ️ INFO BOX for DUAL SELECTION (Educational, not warning) */}
            {isDualSelection && (
                <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6'>
                    <div className='flex gap-3'>
                        <Info
                            size={18}
                            className='text-blue-600 shrink-0 mt-0.5'
                        />
                        <div>
                            <p className='text-sm font-semibold text-blue-900 mb-2'>
                                Dual Selection Explained
                            </p>
                            <p className='text-sm text-blue-800 mb-2'>
                                You've chosen TWO options for flexibility:
                            </p>
                            <ul className='text-sm text-blue-800 space-y-1 ml-2'>
                                <li>
                                    {isSpecialized ? (
                                        <>
                                            ⏳ <strong>Primary:</strong> {formData.time} appointment
                                            will be <strong>FOR APPROVAL</strong>
                                        </>
                                    ) : (
                                        <>
                                            ✅ <strong>Primary:</strong> {formData.time} appointment
                                            will be <strong>CONFIRMED</strong>
                                        </>
                                    )}
                                </li>
                                <li>
                                    ⏳ <strong>Secondary:</strong> {formData.waitlist_time} waitlist
                                    for a backup option
                                </li>
                                <li>
                                    📧 If the {formData.waitlist_time} slot opens, you can decide to
                                    switch or keep {formData.time}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* ⏳ INFO BOX for SPECIALIZED SERVICE (Approval Required) */}
            {hasBooking && isSpecialized && !isDualSelection && (
                <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6'>
                    <div className='flex gap-3'>
                        <Info
                            size={18}
                            className='text-amber-600 shrink-0 mt-0.5'
                        />
                        <div>
                            <p className='text-sm font-semibold text-amber-900 mb-2'>
                                ⏳ Approval Required
                            </p>
                            <p className='text-sm text-amber-800 mb-2'>
                                This is a specialized service. Your appointment request will be
                                reviewed by our clinical team.
                            </p>
                            <ul className='text-sm text-amber-800 space-y-1 ml-2'>
                                <li>✓ We'll confirm within 24-48 hours</li>
                                <li>✓ Check your email for updates</li>
                                <li>✓ No charge until approved</li>
                                <li>
                                    ✓ {formData.dentist_id ? 'The selected dentist will be notified' : 'The dentist will be assigned during review'}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* ⏳ INFO BOX for SPECIALIZED SERVICE WITH WAITLIST (Dual) */}
            {isDualSelection && isSpecialized && (
                <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6'>
                    <div className='flex gap-3'>
                        <Info
                            size={18}
                            className='text-amber-600 shrink-0 mt-0.5'
                        />
                        <div>
                            <p className='text-sm font-semibold text-amber-900 mb-2'>
                                ⏳ Approval Required
                            </p>
                            <p className='text-sm text-amber-800 mb-2'>
                                Your {formData.time} appointment is a specialized service and
                                requires clinical review.
                            </p>
                            <ul className='text-sm text-amber-800 space-y-1 ml-2'>
                                <li>✓ Primary appointment: Will be confirmed within 24-48 hours</li>
                                <li>✓ Waitlist entry: Confirmed immediately</li>
                                <li>✓ Check your email for review updates</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Banner - Read Only */}
            <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6'>
                <p className='text-sm text-blue-800'>
                    <strong>ℹ️ All details are read-only.</strong> To make changes, click Back.
                </p>
            </div>

            {/* Navigation */}
            <div className='flex justify-between'>
                <button
                    onClick={onBack}
                    className='text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5'
                >
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    className='bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl 
                               transition-colors shadow-lg shadow-brand-500/25'
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default UserReviewStep;
