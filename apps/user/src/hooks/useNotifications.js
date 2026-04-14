import { useNotificationState } from '../context/NotificationContext';

/**
 * Hook to manage patient notifications.
 * Now using global state via NotificationContext.
 */
const useNotifications = () => {
    return useNotificationState();
};

export default useNotifications;
