import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import NotificationInbox from '../../components/patient/notification/NotificationInbox';
import NotificationDetailView from '../../components/patient/notification/NotificationDetailView';

const SAMPLE_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Appointment Approved - Dr. Smith',
        message: 'Your dental cleaning appointment for next Tuesday has been officially approved. Please arrive 15 minutes early.',
        fullMessage: 'Dear Patient,\n\nWe are pleased to inform you that your appointment with Dr. Sarah Smith on Oct 24, 2024, at 10:00 AM has been approved. \n\nPlease arrive 15 minutes early to finalize any paperwork.\n\nThank you for choosing PrimeraDental!',
        category: 'Appointment',
        time: '10:00 AM',
        isRead: false,
        isStarred: true
    },
    {
        id: 2,
        title: 'New Waitlist Opening Available',
        message: 'A slot has opened up for this Friday afternoon at 2:30 PM. Claim it before it expires!',
        fullMessage: 'Exciting news! \n\nA new time slot for a Routine Checkup has just become available on Friday, Oct 11, at 2:30 PM. \n\nLog in to your waitlist dashboard to claim this spot immediately. This offer is valid for the next 5 minutes.',
        category: 'Waitlist',
        time: '9:45 AM',
        isRead: false,
        isStarred: false
    },
    {
        id: 3,
        title: 'Profile Security Alert',
        message: 'Your password was successfully updated recently. If this wasnt you, please contact support immediately.',
        fullMessage: 'Hello, \n\nThis is a courtesy notification to confirm that the password for your PrimeraDental account was successfully changed today at 9:00 AM. \n\nIf you did not perform this action, please contact our support team immediately to secure your account.',
        category: 'Updates',
        time: '9:12 AM',
        isRead: true,
        isStarred: false
    },
    {
        id: 4,
        title: 'Follow-up Care Instructions',
        message: 'Dr. John Doe has added a specific post-extraction care guide to your profile. Please review the instructions.',
        fullMessage: 'Dear Patient, \n\nDr. John Doe has added a specific post-extraction care guide to your profile. \n\nFollowing these steps carefully will ensure a smooth and speedy recovery. You can find the PDF under your profile documents.',
        category: 'Appointments',
        time: 'Yesterday',
        isRead: true,
        isStarred: false
    },
    {
        id: 5,
        title: 'Waitlist Offer Expired',
        message: 'The slot for Oct 15 is no longer available as the claim period has ended. We will notify you of future openings.',
        fullMessage: 'Hello, \n\nThis is a notification that your offer to claim the slot on Oct 15 has expired. \n\nDon\'t worry! Your original appointment is still secured, and we will continue to monitor for any other openings that match your preferences.',
        category: 'Waitlist',
        time: 'Oct 08',
        isRead: true,
        isStarred: false
    },
    {
        id: 6,
        title: 'Invoice Ready for Review - #INV-2024-001',
        message: 'Your billing statement for the recent procedure is now available in the billing section.',
        fullMessage: 'Hello, \n\nYour invoice for the procedure performed on Oct 05 is now available for review and payment. \n\nYou can view the detailed breakdown and make an online payment through the Billing & Payments section of your portal.',
        category: 'Billing',
        time: 'Oct 07',
        isRead: false,
        isStarred: false
    },
    {
        id: 7,
        title: 'Welcome to PrimeraDental!',
        message: 'Thank you for joining our community. We are excited to help you achieve your best smile.',
        fullMessage: 'Welcome to the family! \n\nWe are thrilled to have you as a patient. Through this portal, you can manage your appointments, view dental records, and communicate with our team. \n\nIf you have any questions, feel free to reach out!',
        category: 'General',
        time: 'Oct 05',
        isRead: true,
        isStarred: true
    },
    {
        id: 8,
        title: 'Insurance Information Updated',
        message: 'We have successfully verified your updated insurance details. Your profile is now current.',
        fullMessage: 'Hello, \n\nOur administrative team has finished processing your new insurance information. \n\nYour profile has been updated to reflect your current coverage. This will help ensure smooth billing for your upcoming visits.',
        category: 'Updates',
        time: 'Oct 02',
        isRead: true,
        isStarred: false
    },
    {
        id: 9,
        title: 'New Policy: Enhanced Safety Protocols',
        message: 'Please read our updated safety guidelines for in-office visits starting next month.',
        fullMessage: 'Dear Valued Patient, \n\nStarting next month, we are implementing enhanced safety protocols to ensure the health and comfort of our community. \n\nPlease review the updated guidelines on our website or through the link in your portal before your next visit.',
        category: 'Updates',
        time: 'Sep 28',
        isRead: true,
        isStarred: false
    },
    {
        id: 10,
        title: 'Patient Feedback Requested',
        message: 'How was your recent visit with Dr. Sarah Smith? We would love to hear your thoughts.',
        fullMessage: 'Hi there, \n\nWe hope you had a great experience during your recent visit. \n\nCould you spare 2 minutes to provide feedback on your appointment with Dr. Sarah Smith? Your input helps us continuously improve our care.',
        category: 'General',
        time: 'Sep 25',
        isRead: true,
        isStarred: false
    },
    {
        id: 11,
        title: 'Annual Checkup Reminder',
        message: 'It has been almost a year since your last comprehensive exam. Schedule your next visit today!',
        fullMessage: 'Hello, \n\nIt\'s time for your annual dental checkup! \n\nRegular exams are key to preventing issues and keeping your smile bright. Click the "Book Now" button on your dashboard to find a time that works for you.',
        category: 'Appointment',
        time: 'Sep 20',
        isRead: true,
        isStarred: false
    },
];

const NotificationsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    // Sync selectedId with URL 'id' param
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setSelectedId(parseInt(id));
        } else {
            setSelectedId(null);
        }
    }, [searchParams]);

    const handleToggleRead = (id) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, isRead: !n.isRead } : n
        ));
    };

    const handleToggleStar = (id) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, isStarred: !n.isStarred } : n
        ));
    };

    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const handleNotificationClick = (id) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, isRead: true } : n
        ));
        setSelectedId(id);
    };

    // Filter Logic
    const filtered = notifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             n.message.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;
        
        if (activeFilter === 'all') return true;
        if (activeFilter === 'starred') return n.isStarred;
        return n.category.toLowerCase().includes(activeFilter.toLowerCase());
    });

    const selectedNotification = notifications.find(n => n.id === selectedId);

    // Dynamic breadcrumbs based on selection
    const breadcrumbTitle = selectedId ? 'Notification Detail' : 'Notifications';
    const parentName = selectedId ? 'Notifications' : null;
    const parentPath = selectedId ? '/patient/notifications' : null;

    return (
        <div className='flex flex-col h-[calc(100vh-110px)]'>
            <PageBreadcrumb 
                pageTitle={breadcrumbTitle} 
                parentName={parentName} 
                parentPath={parentPath}
            />
            
            <div className='flex-grow min-h-0 relative'>
                {selectedId ? (
                    <NotificationDetailView 
                        notification={selectedNotification}
                        onBack={() => setSelectedId(null)}
                        onToggleRead={handleToggleRead}
                        onToggleStar={handleToggleStar}
                        onDelete={handleDelete}
                    />
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
                    />
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
