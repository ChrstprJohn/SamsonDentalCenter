import { Calendar, Clock, Stethoscope, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserConfirmStep = ({ formData, book_for_others, onSubmit, onBack, submitting, error }) => {
    const { user } = useAuth();

    // Determine if this is a specialized service
    const specializedServices = [
        'Orthodontics',
        'Implants',
        'TMJ Splint',
        'Oral Surgery',
        'Laser Periodontal',
    ];
    const isSpecialized = specializedServices.includes(formData.service_name);

    const items = [
        { icon: Stethoscope, label: 'Service', value: formData.service_name },
        { icon: Calendar, label: 'Date', value: formData.date },
        { icon: Clock, label: 'Time', value: formData.time },
    ];

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Confirm Your Appointment</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Please review your appointment details below and click confirm to book.
            </p>

            {error && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6'>
                    {error}
                </div>
            )}

            <div className='bg-slate-50 rounded-xl p-6 mb-6 space-y-4'>
                {items.map(({ icon: Icon, label, value }) => (
                    <div
                        key={label}
                        className='flex items-center gap-3'
                    >
                        <Icon
                            size={16}
                            className='text-sky-500 shrink-0'
                        />
                        <span className='text-sm text-slate-500 w-16'>{label}</span>
                        <span className='text-sm font-medium text-slate-900'>{value}</span>
                    </div>
                ))}
            </div>

            {/* Show who appointment is for */}
            {book_for_others && formData.booked_for_name && (
                <div className='flex items-center gap-3 pt-2 border-t border-slate-200'>
                    <User
                        size={16}
                        className='text-amber-500 shrink-0'
                    />
                    <span className='text-sm text-slate-500 w-16'>For</span>
                    <span className='text-sm font-medium text-slate-900'>
                        {formData.booked_for_name}
                    </span>
                </div>
            )}

            {/* Confirmation email info */}
            <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 mt-6'>
                <p className='text-sm text-blue-800'>
                    <span className='font-semibold'>📧 Confirmation Email:</span>
                    <br />
                    <span className='text-xs'>
                        {book_for_others
                            ? `Sent to your account (${user?.email}), not to ${formData.booked_for_name}`
                            : `Sent to your account (${user?.email})`}
                    </span>
                </p>
            </div>

            {/* Two-Tier Confirmation Message */}
            {isSpecialized ? (
                <div className='bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8'>
                    <p className='text-sm text-amber-800'>
                        ⏳ This is a specialized service and will require approval. You'll be
                        notified via email once our team reviews your request (typically 24-48
                        hours).
                    </p>
                </div>
            ) : (
                <div className='bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8'>
                    <p className='text-sm text-emerald-800'>
                        ✅ Your appointment will be confirmed immediately. You'll receive a reminder
                        email before your appointment.
                    </p>
                </div>
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
                    disabled={submitting}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-xl 
                               transition-colors shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed 
                               flex items-center gap-2'
                >
                    {submitting ? (
                        <>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            Confirming...
                        </>
                    ) : (
                        'Confirm Appointment'
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserConfirmStep;
