import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';

const UserBookingSuccess = ({ result, onReset }) => {
    const navigate = useNavigate();

    // Determine success type based on result payload
    const bookingResult = result?.bookingData || (result?.booked ? result : null);
    const waitlistResult = result?.waitlistData?.waitlist_entry || result?.waitlistData;
    
    const hasBooking = !!bookingResult?.booked;
    const hasWaitlist = !!waitlistResult;
    const isPending = bookingResult?.status === 'PENDING' || bookingResult?.requires_approval;
    const isDualSelection = hasBooking && hasWaitlist;
    const isWaitlistOnly = hasWaitlist && !hasBooking;

    // Determine icon, color and messaging based on scenario
    let Icon = CheckCircle;
    let iconColor = 'text-emerald-500';
    let primaryColor = 'emerald';
    let title = 'Success!';
    let tagline = '';
    let message = '';

    if (isDualSelection) {
        Icon = Sparkles;
        iconColor = 'text-amber-500';
        primaryColor = 'amber';
        title = isPending ? 'Request Received + Waitlist Added!' : 'Appointment Confirmed + Waitlist Added!';
        tagline = isPending ? 'Your request and backup option are processed! ✨' : 'You have a confirmed appointment and a backup option! ✨';
        message = isPending 
            ? "Your specialized service request is under review, and you've also been added to the waitlist for another time option."
            : "You've successfully secured an appointment and also been added to the waitlist for another time option. You'll receive confirmation emails for both.";
    } else if (hasBooking) {
        if (isPending) {
            Icon = Clock;
            iconColor = 'text-amber-500';
            primaryColor = 'amber';
            title = 'Request Received!';
            tagline = 'FOR APPROVAL ⏳';
            message =
                'Your appointment request has been submitted. The clinic will review and confirm your appointment within 24-48 hours.';
        } else {
            Icon = CheckCircle;
            iconColor = 'text-emerald-500';
            primaryColor = 'emerald';
            title = 'Appointment Confirmed!';
            tagline = 'Your appointment is booked ✅';
            message =
                "Your appointment has been successfully booked and confirmed. You'll receive a reminder email before your appointment date.";
        }
    } else if (isWaitlistOnly) {
        Icon = Clock;
        iconColor = 'text-blue-500';
        primaryColor = 'blue';
        title = 'Waitlisted Successfully!';
        tagline = 'You are on the waitlist ⏳';
        message =
            "You've been added to the waitlist for your preferred date and time. We'll notify you via email as soon as an appointment becomes available.";
    }

    return (
        <div className='text-center py-12'>
            <Icon
                size={56}
                className={`${iconColor} mx-auto mb-4`}
            />
            <h2 className='text-2xl font-bold text-slate-900 mb-1'>{title}</h2>
            {tagline && <p className='text-sm text-slate-600 mb-6 font-medium'>{tagline}</p>}
            <p className='text-slate-500 max-w-md mx-auto mb-8'>{message}</p>

            <div className={`grid ${isDualSelection ? 'md:grid-cols-2' : 'grid-cols-1 max-w-md'} gap-4 max-w-2xl mx-auto mb-8 text-left`}>
                {/* Booking Card */}
                {hasBooking && (
                    <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-5'>
                        <div className='flex items-center gap-2 mb-3'>
                            <div className='w-5 h-5 flex items-center justify-center'>
                                {isPending ? (
                                    <Clock size={18} className='text-amber-600' />
                                ) : (
                                    <CheckCircle size={18} className='text-emerald-600' />
                                )}
                            </div>
                            <h3 className='text-sm font-semibold text-slate-900'>
                                {isPending ? 'Appointment (For Approval)' : 'Appointment Confirmed'}
                            </h3>
                        </div>
                        <div className='space-y-2 text-sm'>
                            <div>
                                <p className='text-emerald-700 text-xs'>Service</p>
                                <p className='text-emerald-900 font-medium'>
                                    {bookingResult.service?.name || bookingResult.service_name}
                                </p>
                            </div>
                            <div>
                                <p className='text-emerald-700 text-xs'>Date & Time</p>
                                <p className='text-emerald-900 font-medium'>
                                    {bookingResult.date || bookingResult.appointment?.date} @ {bookingResult.time || bookingResult.appointment?.start_time}
                                </p>
                            </div>
                            {bookingResult.appointment?.id && (
                                <div>
                                    <p className='text-emerald-700 text-xs'>ID</p>
                                    <p className='text-emerald-900 font-mono text-xs'>
                                        {bookingResult.appointment.id.slice(0, 8).toUpperCase()}
                                    </p>
                                </div>
                            )}
                            <div className='pt-2 border-t border-emerald-200'>
                                <p className={`text-xs font-bold ${isPending ? 'text-amber-700' : 'text-emerald-800'}`}>
                                    {isPending ? '⏳ Status: FOR APPROVAL' : '✅ Status: CONFIRMED'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Waitlist Card */}
                {hasWaitlist && (
                    <div className='bg-blue-50 border border-blue-200 rounded-xl p-5'>
                        <div className='flex items-center gap-2 mb-3'>
                            <Clock size={18} className='text-blue-600' />
                            <h3 className='text-sm font-semibold text-blue-900'>On Waitlist</h3>
                        </div>
                        <div className='space-y-2 text-sm'>
                            <div>
                                <p className='text-blue-700 text-xs'>Service</p>
                                <p className='text-blue-900 font-medium'>
                                    {waitlistResult.service || waitlistResult.service_name}
                                </p>
                            </div>
                            <div>
                                <p className='text-blue-700 text-xs'>Date & Time</p>
                                <p className='text-blue-900 font-medium'>
                                    {waitlistResult.date} @ {waitlistResult.time}
                                </p>
                            </div>
                            {(waitlistResult.position || result.waitlistData?.position) && (
                                <div>
                                    <p className='text-blue-700 text-xs'>Position in Line</p>
                                    <p className='text-blue-900 font-medium'>
                                        #{waitlistResult.position || result.waitlistData.position}
                                    </p>
                                </div>
                            )}
                            <div className='pt-2 border-t border-blue-200'>
                                <p className='text-blue-800 text-xs font-medium'>
                                    ⏳ Status: WAITING
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Scenario Info Box */}
            {isWaitlistOnly && (
                <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-md mx-auto text-left'>
                    <p className='text-sm text-blue-800'>
                        <span className='font-semibold block mb-2'>📧 What's Next?</span>
                        <span className='text-xs block mb-1'>✉️ We'll notify you via email as soon as this slot becomes available.</span>
                        <span className='text-xs block mb-1'>⏰ You'll have 25 minutes to confirm once you receive the notification.</span>
                        <span className='text-xs'>🔄 You can manage your position from the patient dashboard.</span>
                    </p>
                </div>
            )}

            {isDualSelection && (
                <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto text-left'>
                    <p className='text-sm text-amber-800'>
                        <span className='font-semibold block mb-2'>✨ Two-Option Strategy</span>
                        <span className='text-xs block mb-1'>✅ You have a confirmed appointment for {bookingResult.time}.</span>
                        <span className='text-xs block mb-1'>📧 If the {waitlistResult.time} slot opens up, we'll notify you to swap.</span>
                        <span className='text-xs'>💬 Both entries are now visible in your dashboard.</span>
                    </p>
                </div>
            )}

            <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                <button
                    onClick={() => {
                        onReset();
                        navigate('/patient');
                    }}
                    className='flex-1 lg:flex-none inline-flex items-center justify-center font-bold text-sm bg-white text-slate-700 hover:bg-slate-50 transition-all duration-300 ring-1 ring-slate-200 px-8 py-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300'
                >
                    Go to Dashboard
                </button>
                <button
                    onClick={() => {
                        onReset();
                        navigate('/patient/book');
                    }}
                    className='bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-sky-500/25'
                >
                    Book Another Appointment
                </button>
            </div>
        </div>
    );
};

export default UserBookingSuccess;
