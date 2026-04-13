import { format } from 'date-fns';

/**
 * Helper to format date/time range in a premium way.
 */
const formatDateTimeRange = (date, startTime, endTime) => {
    if (!date || !startTime) return '';
    try {
        const d = new Date(date);
        const dateStr = format(d, 'MMMM d, yyyy');
        
        // Assume startTime/endTime are "HH:mm:ss" or "HH:mm"
        const formatTime = (t) => {
            const [h, m] = t.split(':');
            const hour = parseInt(h, 10);
            const ampm = hour >= 12 ? 'pm' : 'am';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${m}${ampm}`;
        };

        const start = formatTime(startTime);
        const end = endTime ? ` - ${formatTime(endTime)}` : '';
        
        return `${dateStr} at ${start}${end}`;
    } catch (e) {
        return `${date} ${startTime}`;
    }
};

/**
 * Reconstructs a notification's content based on its type and metadata.
 */
export const renderNotification = (notification) => {
    let data = null;
    try {
        if (typeof notification.message === 'string' && notification.message.startsWith('{')) {
            data = JSON.parse(notification.message);
        }
    } catch (e) {
        // Not JSON, use as-is
    }

    if (!data || !data._isJSON) {
        return {
            title: notification.title,
            message: notification.message
        };
    }

    const { type } = notification;
    const { service, date, start_time, end_time, reason, action } = data;
    const formattedRange = formatDateTimeRange(date, start_time, end_time);

    let title = data._title || notification.title;
    let message = data._fallback || notification.message;

    switch (type) {
        case 'CONFIRMATION':
            if (action === 'approved') {
                title = 'Appointment Approved!';
                message = `Good news! Your ${service} appointment on ${formattedRange} has been approved. See you at the clinic!`;
            } else {
                title = 'Appointment Confirmed';
                message = `Your ${service} appointment is confirmed for ${formattedRange}.`;
            }
            break;
            
        case 'CANCELLATION':
            if (action === 'rejected') {
                title = 'Appointment Request Declined';
                message = `Your request for ${service} on ${formattedRange} was declined. ${reason ? 'Reason: ' + reason : 'Please contact the clinic for more details.'}`;
            } else {
                title = 'Appointment Cancelled';
                message = `Your ${service} appointment on ${formattedRange} has been cancelled.`;
            }
            break;

        case 'GENERAL':
            if (data.status === 'review') {
                title = 'Request Received & Under Review';
                message = `Your request for ${service} on ${formattedRange} has been received. Our team is currently reviewing your schedule to ensure a dentist is available. We will notify you once it is officially confirmed.`;
            }
            break;

        case 'REMINDER':
        case 'REMINDER_48H':
            title = data._title || title;
            message = `Don't forget! Your ${service} appointment is on ${formattedRange}.`;
            break;

        case 'DELAY':
            title = data._title || title;
            message = `Dr. ${data.dentist_name} is running approximately ${data.estimated_delay_minutes} minutes behind schedule. Your appointment at ${data.original_time} may start late.`;
            break;

        default:
            // Use metadata titles/messages if available
            title = data._title || title;
            message = data._fallback || message;
    }

    return { title, message };
};
