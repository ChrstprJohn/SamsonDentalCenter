import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { Outlet } from 'react-router-dom';
import PatientHeader from '../components/patient/PatientHeader';
import Backdrop from '../components/patient/Backdrop';
import PatientSidebar from '../components/patient/PatientSidebar';

const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className='min-h-screen xl:flex'>
            <div>
                <PatientSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered
                        ? 'lg:ml-[290px]'
                        : 'lg:ml-[90px]'
                } ${isMobileOpen ? 'ml-0' : ''}`}
            >
                <PatientHeader />
                <div className='p-4 mx-auto max-w-[1536px] md:p-6'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const PatientPortalLayout = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default PatientPortalLayout;
