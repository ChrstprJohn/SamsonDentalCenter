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
 * @param {Object} notification - The notification object from DB
 * @param {Object} options - Rendering options
 * @param {boolean} options.isRich - Whether to return rich HTML for the message
 */
export const renderNotification = (notification, options = {}) => {
    const { isRich = false } = options;

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
    
    // Rich styling helper
    const highlight = (text) => {
        if (!isRich || !text) return text;
        return `<span class="font-bold text-gray-950 dark:text-white">${text}</span>`;
    };

    const formattedRange = formatDateTimeRange(date, start_time, end_time);
    const richService = highlight(service);
    const richRange = highlight(formattedRange);

    let title = data._title || notification.title;
    let message = data._fallback || notification.message;

    switch (type) {
        case 'CONFIRMATION':
        case 'APPROVAL':
            if (action === 'approved' || type === 'APPROVAL') {
                title = 'Appointment Approved!';
                message = `Good news! Your ${richService} appointment on ${richRange} has been approved. See you at the clinic!`;
            } else {
                title = 'Appointment Confirmed';
                message = `Your ${richService} appointment is confirmed for ${richRange}.`;
            }
            break;
            
        case 'CANCELLATION':
        case 'REJECTION':
            if (action === 'rejected' || type === 'REJECTION') {
                title = 'Appointment Request Declined';
                message = `Your request for ${richService} on ${richRange} was declined. ${reason ? 'Reason: ' + highlight(reason) : 'Please contact the clinic for more details.'}`;
            } else {
                title = 'Appointment Cancelled';
                message = `Your ${richService} appointment on ${richRange} has been cancelled.`;
            }
            break;

        case 'GENERAL':
            if (data.status === 'review') {
                title = 'Request Received & Under Review';
                message = `Your request for ${richService} on ${richRange} has been received. Our team is currently reviewing your schedule to ensure a dentist is available. We will notify you once it is officially confirmed.`;
            }
            break;

        case 'REMINDER':
        case 'REMINDER_48H':
            title = data._title || title;
            message = `Don't forget! Your ${richService} appointment is on ${richRange}.`;
            break;

        case 'DELAY':
            title = data._title || title;
            message = `Dr. ${highlight(data.dentist_name)} is running approximately ${highlight(data.estimated_delay_minutes)} minutes behind schedule. Your appointment at ${highlight(data.original_time)} may start late.`;
            break;

        default:
            // Use metadata titles/messages if available
            title = data._title || title;
            message = data._fallback || message;
    }

    return { title, message };
};
