import { useServicesContext } from '../context/ServicesContext';

/**
 * Hook to access cached services from ServicesContext.
 * Services are fetched once on app load and cached globally.
 * This prevents multiple API calls across different pages.
 *
 * Must be used within ServicesProvider.
 *
 * @returns { services, loading, error, refetch }
 */
const useServices = () => {
    return useServicesContext();
};

export default useServices;
