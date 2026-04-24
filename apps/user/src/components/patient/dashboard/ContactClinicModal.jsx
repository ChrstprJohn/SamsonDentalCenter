import React from 'react';
import { Modal } from '../../ui/Modal';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactClinicModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px]">
            <div className="p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <Phone size={32} />
                    </div>
                    <h3 className="text-2xl font-black font-outfit text-gray-900 dark:text-white tracking-tight">
                        Contact Clinic
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Reach out to us for any questions or concerns.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone</p>
                            <a href="tel:+1234567890" className="text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                +1 (234) 567-890
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</p>
                            <a href="mailto:contact@samsondental.com" className="text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                contact@samsondental.com
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Location</p>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                123 Dental Street, City, Country
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default ContactClinicModal;
