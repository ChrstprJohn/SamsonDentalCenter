import React, { useState } from 'react';
import DecisionModals from './DecisionModals';

const DecisionActions = ({ onApprove, onReject, onCancel, actionLoading }) => {
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });

    const openModal = (type) => setModalConfig({ isOpen: true, type });
    const closeModal = () => setModalConfig({ isOpen: false, type: null });

    const handleConfirm = (data) => {
        if (modalConfig.type === 'approve') {
            onApprove(data);
        } else {
            onReject(data);
        }
    };

    return (
        <div className='pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between'>
            {/* Left Side: Return Action */}
            <button 
                onClick={onCancel}
                className='h-12 px-8 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 active:scale-95'
            >
                Return to Pending List
            </button>

            {/* Right Side: Primary Actions */}
            <div className='flex items-center gap-4'>
                <button 
                    onClick={() => openModal('reject')}
                    className='h-12 px-8 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 transition-all active:scale-95'
                >
                    Reject Request
                </button>
                <button 
                    onClick={() => openModal('approve')}
                    className='h-12 px-12 rounded-2xl bg-brand-500 text-white text-[11px] font-black uppercase tracking-[0.15em] hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20 active:scale-95'
                >
                    Approve Request
                </button>
            </div>

            {/* Popups */}
            <DecisionModals 
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                onClose={closeModal}
                onConfirm={handleConfirm}
                actionLoading={actionLoading}
            />
        </div>
    );
};

export default DecisionActions;
