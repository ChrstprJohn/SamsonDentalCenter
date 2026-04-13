import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import NotificationInbox from '../../components/patient/notification/NotificationInbox';
import NotificationDetailView from '../../components/patient/notification/NotificationDetailView';
import useNotifications from '../../hooks/useNotifications';
import { formatFullDateTime } from '../../hooks/useAppointments';
import { Clock } from 'lucide-react';
import { renderNotification } from '../../utils/notificationRenderer';

const NotificationsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { 
        notifications, 
        loading, 
        error, 
        markRead, 
        markAllRead 
    } = useNotifications();

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    // Sync selectedId with URL 'id' param
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setSelectedId(id);
        } else {
            setSelectedId(null);
        }
    }, [searchParams]);

    const handleToggleRead = async (id) => {
        await markRead(id);
    };

    const handleToggleStar = (id) => {
        // Star not yet implemented in backend
    };

    const handleDelete = (id) => {
        // Delete not yet implemented in backend
    };

    const handleNotificationClick = async (id) => {
        await markRead(id);
        setSelectedId(id);
    };

    // Map Backend structure to Frontend needs
    const mappedNotifications = notifications.map(n => {
        const rendered = renderNotification(n);
        return {
            id: n.id,
            title: rendered.title,
            message: rendered.message,
            fullMessage: rendered.message,
            category: n.type,
            time: n.sent_at ? formatFullDateTime(n.sent_at) : '',
            isRead: n.is_read,
            isStarred: false
        };
    });

    // Filter Logic
    const filtered = mappedNotifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             n.message.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;
        
        if (activeFilter === 'all') return true;
        if (activeFilter === 'starred') return n.isStarred;
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
        <>
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
                        onDelete={handleDelete}
                    />
                </div>
            ) : (
                <NotificationInbox 
                    notifications={filtered}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onToggleRead={handleToggleRead}
                    onToggleStar={handleToggleStar}
                    onDelete={handleDelete}
                    onNotificationClick={handleNotificationClick}
                    onMarkAllRead={markAllRead}
                />
            )}
        </>
    );
};

export default NotificationsPage;
