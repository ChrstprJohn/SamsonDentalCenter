import { Calendar, Clock, User, Mail, Phone, Stethoscope } from 'lucide-react';

const ConfirmStep = ({ formData, onSubmit, onBack, submitting, error }) => {
    const items = [
        { icon: Stethoscope, label: 'Service', value: formData.service_name },
        { icon: Calendar, label: 'Date', value: formData.date },
        { icon: Clock, label: 'Time', value: formData.time },
        { icon: User, label: 'Name', value: formData.full_name },
        { icon: Mail, label: 'Email', value: formData.email },
        { icon: Phone, label: 'Phone', value: formData.phone },
    ];

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Review Your Request</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Please review the details below before submitting your request.
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

            <div className='bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8'>
                <p className='text-sm text-amber-800 leading-relaxed'>
                    📧 A verification email will be sent to <strong>{formData.email}</strong>. 
                    You <strong>must</strong> click the link in that email to verify your request. 
                    Once verified, our clinic will review and approve your appointment.
                </p>
            </div>
            {/* Navigation */}
            <div className='flex justify-between'>
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className='text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5
                               disabled:opacity-50'
                >
                    ← Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-semibold
                               px-8 py-3 rounded-xl transition-colors shadow-lg shadow-sky-500/25
                               disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                >
                    {submitting ? (
                        <>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            Booking...
                        </>
                    ) : (
                        'Submit Request'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ConfirmStep;
