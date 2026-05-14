import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import { AlertTriangle, CheckCircle2, Info, HelpCircle } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed? This action may have permanent effects.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning", // "warning", "success", "info", "danger"
    isLoading = false
}) => {
    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={20} />;
            case 'danger':
                return <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />;
            case 'info':
                return <Info className="text-blue-600 dark:text-blue-400" size={20} />;
            default:
                return <HelpCircle className="text-amber-600 dark:text-amber-400" size={20} />;
        }
    };

    const getVariantBg = () => {
        switch (variant) {
            case 'success':
                return 'bg-emerald-50 dark:bg-emerald-500/10';
            case 'danger':
                return 'bg-red-50 dark:bg-red-500/10';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-500/10';
            default:
                return 'bg-amber-50 dark:bg-amber-500/10';
        }
    };

    const getButtonClasses = () => {
        switch (variant) {
            case 'success':
                return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20';
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 shadow-red-500/20';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20';
            default:
                return 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20';
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            isBottomSheet={false} 
            className='sm:max-w-[480px] w-full'
            showCloseButton={false}
        >
            {/* Standard Header with Icon */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${getVariantBg()}`}>
                        {getIcon()}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-outfit">
                        {title}
                    </h3>
                </div>
            </div>

            <ModalBody className="py-6 px-8">
                <p className="text-[14px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                    {message}
                </p>
            </ModalBody>

            <ModalFooter className="flex gap-3 bg-gray-50/50 dark:bg-white/[0.02] p-6 border-t border-gray-100 dark:border-gray-800">
                <Button 
                    variant='outline' 
                    onClick={onClose} 
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-xl font-black text-[10px] uppercase tracking-widest border-gray-200 dark:border-gray-800"
                >
                    {cancelText}
                </Button>
                <Button 
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 h-11 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${getButtonClasses()}`}
                >
                    {isLoading ? (
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto' />
                    ) : (
                        confirmText
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};


export default ConfirmationModal;
