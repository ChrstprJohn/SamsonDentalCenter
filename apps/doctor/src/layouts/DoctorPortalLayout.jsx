import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { Outlet } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import DoctorHeader from '../components/patient/DoctorHeader';
import Backdrop from '../components/patient/Backdrop';
import DoctorSidebar from '../components/patient/DoctorSidebar';
import { useTheme } from '../context/ThemeContext';

const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { setIsDarkModeAllowed } = useTheme();

    useLayoutEffect(() => {
        setIsDarkModeAllowed(true);
        return () => setIsDarkModeAllowed(false);
    }, [setIsDarkModeAllowed]);

    return (
        <div className='min-h-screen xl:flex bg-white sm:bg-transparent dark:bg-gray-900 dark:sm:bg-transparent'>
            <div>
                <DoctorSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered
                        ? 'lg:ml-[290px]'
                        : 'lg:ml-[90px]'
                } ${isMobileOpen ? 'ml-0' : ''}`}
            >
                <DoctorHeader />
                <div className='flex-grow pt-0 px-0 pb-0 sm:p-4 mx-auto w-full max-w-[1536px] md:p-6 bg-white sm:bg-transparent dark:bg-gray-900 dark:sm:bg-transparent'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const DoctorPortalLayout = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default DoctorPortalLayout;
