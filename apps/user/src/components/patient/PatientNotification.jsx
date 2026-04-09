import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside';

const PatientNotification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifying, setNotifying] = useState(true);
    const notificationRef = useRef(null);

    useClickOutside(notificationRef, () => {
        if (isOpen) setIsOpen(false);
    });

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setNotifying(false);
    };

    return (
        <div className='relative' ref={notificationRef}>
            <button
                className='relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-10 w-10 hover:bg-gray-100 lg:h-11 lg:w-11'
                onClick={toggleDropdown}
                aria-label='Notifications'
            >
                {notifying && (
                    <span className='absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400'>
                        <span className='absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping'></span>
                    </span>
                )}
                <svg
                    className='fill-current'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z'
                        fill='currentColor'
                    />
                </svg>
            </button>

            {isOpen && (
                <div className='absolute right-[-100px] sm:right-0 mt-3 flex h-auto max-h-[480px] w-[300px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg z-50 sm:w-[350px]'>
                    <div className='flex items-center justify-between pb-3 mb-3 border-b border-gray-100'>
                        <h5 className='text-lg font-semibold text-gray-800'>
                            Notification
                        </h5>
                    </div>
                    <ul className='flex flex-col h-auto overflow-y-auto no-scrollbar gap-1'>
                        <li>
                            <Link 
                                to='/patient/notifications?id=1'
                                onClick={() => setIsOpen(false)}
                                className='flex gap-3 rounded-lg border-b border-gray-50 p-3 hover:bg-gray-50 transition-colors'
                            >
                                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 text-brand-500 flex-shrink-0'>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin='round' strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className='block text-left'>
                                    <p className='text-sm text-gray-800 mb-1 leading-tight'>
                                        <span className='font-bold block'>Appointment Approved</span>
                                        Dr. Smith approved your cleaning...
                                    </p>
                                    <span className='text-[10px] text-gray-400 font-medium'>10:00 AM</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to='/patient/notifications?id=3'
                                onClick={() => setIsOpen(false)}
                                className='flex gap-3 rounded-lg border-b border-gray-50 p-3 hover:bg-gray-50 transition-colors text-left font-normal'
                            >
                                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 text-brand-500 flex-shrink-0'>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className='block'>
                                    <p className='text-sm text-gray-800 mb-1 leading-tight'>
                                        <span className='font-bold block'>Profile Security Alert</span>
                                        Your password was updated recently...
                                    </p>
                                    <span className='text-[10px] text-gray-400 font-medium'>9:12 AM</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                    <Link
                        to='/patient/notifications'
                        className='block px-4 py-3 mt-3 text-sm font-bold text-center text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20'
                        onClick={() => setIsOpen(false)}
                    >
                        View All Notifications
                    </Link>
                </div>
            )}
        </div>
    );
};

export default PatientNotification;
