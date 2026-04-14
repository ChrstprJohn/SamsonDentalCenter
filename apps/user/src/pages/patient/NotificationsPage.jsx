import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import NotificationInbox from '../../components/patient/notification/NotificationInbox';
import NotificationDetailView from '../../components/patient/notification/NotificationDetailView';
import useNotifications from '../../hooks/useNotifications';
import { formatFullDateTime } from '../../hooks/useAppointments';
import { Clock, Inbox, Star, XCircle } from 'lucide-react';
import { renderNotification } from '../../utils/notificationRenderer';
import NotificationStatusSummary from '../../components/patient/notification/NotificationStatusSummary';

const NotificationsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { 
        notifications, 
        loading, 
        error, 
        markRead, 
        markAllRead,
        toggleStar,
        stats
    } = useNotifications();

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    // Sync selectedId with URL 'id' param - Auto mark-as-read ONLY on initial open
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setSelectedId(id);
        } else {
            setSelectedId(null);
        }
    }, [searchParams]);

    // Separate effect for auto-mark-as-read to avoid loops
    useEffect(() => {
        if (selectedId) {
            const n = notifications.find(notif => notif.id === selectedId);
            if (n && !n.is_read) {
                // We ONLY auto-mark as read if it hasn't been handled yet for this specific open session
                markRead(selectedId);
            }
        }
    }, [selectedId]); // ONLY depend on selectedId changing

    const handleToggleRead = async (id, isRead) => {
        await markRead(id, isRead);
    };

    const handleToggleStar = (id, isStarred) => {
        toggleStar(id, isStarred);
    };

    const handleNotificationClick = async (id) => {
        setSearchParams({ id });
    };

    // Map Backend structure to Frontend needs
    const mappedNotifications = notifications.map(n => {
        const rendered = renderNotification(n);
        const rich = renderNotification(n, { isRich: true });
        return {
            id: n.id,
            title: rendered.title,
            message: rendered.message,
            richMessage: rich.message,
            category: n.type,
            time: n.sent_at ? formatFullDateTime(n.sent_at) : '',
            isRead: n.is_read,
            isStarred: n.is_starred
        };
    });

    // Filter Logic
    const filtered = mappedNotifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             n.message.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;
        
        if (activeFilter === 'all') return true;
        if (activeFilter === 'starred') return n.isStarred;
        
        if (activeFilter === 'general') {
            return ['GENERAL', 'CONFIRMATION', 'REMINDER', 'REMINDER_48H', 'APPROVAL', 'DELAY', 'FOLLOW_UP', 'RESCHEDULE', 'RESTRICTION'].includes(n.category);
        }
        if (activeFilter === 'waitlist') {
            return n.category === 'WAITLIST';
        }
        if (activeFilter === 'cancellation') {
            return ['CANCELLATION', 'REJECTION', 'NO_SHOW'].includes(n.category);
        }
        
        return n.category.toLowerCase().includes(activeFilter.toLowerCase());
    });

    const selectedNotification = mappedNotifications.find(n => n.id === selectedId);

    // Dynamic breadcrumbs based on selection
    const breadcrumbTitle = selectedId ? 'Notification Detail' : 'Notifications';
    const parentName = selectedId ? 'Notifications' : null;
    const parentPath = selectedId ? '/patient/notifications' : null;

    if (loading && notifications.length === 0) {
        return (
            <>
                <PageBreadcrumb pageTitle={breadcrumbTitle} />
                <div className='flex items-center justify-center grow py-20'>
                    <div className='animate-pulse flex flex-col items-center gap-4'>
                        <Clock size={40} className='text-gray-200 dark:text-gray-800' />
                        <div className='h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded-full' />
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageBreadcrumb pageTitle={breadcrumbTitle} />
                <div className='flex items-center justify-center grow py-20 text-error-500'>
                    {error}
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <PageBreadcrumb 
                pageTitle={breadcrumbTitle} 
                parentName={parentName} 
                parentPath={parentPath}
            />
            
            {selectedId ? (
                <div className='flex-grow min-h-0 relative sm:mx-0'>
                    <NotificationDetailView 
                        notification={selectedNotification}
                        onBack={() => setSelectedId(null)}
                        onToggleRead={handleToggleRead}
                        onToggleStar={handleToggleStar}
                    />
                </div>
            ) : (
                <div className="flex flex-col grow">
                    <NotificationStatusSummary stats={stats} />

                    <NotificationInbox 
                        notifications={filtered}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onToggleRead={handleToggleRead}
                        onToggleStar={handleToggleStar}
                        onNotificationClick={handleNotificationClick}
                        onMarkAllRead={markAllRead}
                    />
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
