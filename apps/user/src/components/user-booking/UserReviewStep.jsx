import { useAuth } from '../../context/AuthContext';
import { User, Mail, Stethoscope, Calendar, Clock } from 'lucide-react';

const UserReviewStep = ({ formData, book_for_others, onNext, onBack }) => {
    const { user } = useAuth();

    return (
        <div>
            <h2 className='text-xl font-bold text-slate-900 mb-2'>Review Your Details</h2>
            <p className='text-slate-500 text-sm mb-6'>
                Please review your information. Everything shown below is read-only.
            </p>

            <div className='bg-slate-50 rounded-xl p-6 mb-6 space-y-4'>
                {/* Your Details Section */}
                <div className='border-b border-slate-200 pb-4'>
                    <h3 className='text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2'>
                        <User
                            size={16}
                            className='text-sky-500'
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

                {/* Appointment Details Section */}
                <div>
                    <h3 className='text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2'>
                        <Stethoscope
                            size={16}
                            className='text-sky-500'
                        />
                        Appointment Details
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
                    </div>
                </div>

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

            {/* Info Banner */}
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
                    className='bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-xl 
                               transition-colors shadow-lg shadow-sky-500/25'
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default UserReviewStep;
