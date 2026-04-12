import React from 'react';

const AppointmentCancelModal = ({ show, onClose, cancelReason, setCancelReason, rawId, cancelling, handleCancel }) => {
    if (!show) return null;

    return (
        <div
            className='fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm'
            onClick={(e) => { if (e.target === e.currentTarget && !cancelling) { onClose(); } }}
        >
            <div className='relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-[fadeIn_0.15s_ease-out] overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-xl bg-error-50 dark:bg-error-500/10 flex items-center justify-center text-error-500 shadow-sm'>
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M18 6L6 18' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                                <path d='M6 6l12 12' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                            </svg>
                        </div>
                        <div>
                            <h3 className='text-lg font-extrabold text-gray-900 dark:text-white font-outfit'>Cancel Appointment</h3>
                            <p className='text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider'>ID: {rawId.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={cancelling}
                        className='p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors disabled:opacity-40'
                    >
                        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className='p-6 space-y-5 bg-gray-50/30 dark:bg-transparent'>
                    <p className='text-[13px] sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium'>
                        Please let us know why you need to cancel. This helps the clinic improve its scheduling.
                    </p>
                    <div>
                        <label className='block text-[13px] sm:text-sm font-bold text-gray-900 dark:text-white mb-2'>
                            Reason <span className='text-gray-400 font-medium'>(optional)</span>
                        </label>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            disabled={cancelling}
                            placeholder='e.g. Schedule conflict, feeling better...'
                            rows={3}
                            maxLength={300}
                            className='w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-xl text-[13px] sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-all shadow-sm disabled:opacity-60'
                        />
                        <p className='text-[11px] text-gray-400 mt-2 text-right font-medium tracking-wide'>{cancelReason.length}/300 chars</p>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex gap-3 px-6 pb-6 pt-2 bg-gray-50/30 dark:bg-transparent'>
                    <button
                        onClick={onClose}
                        disabled={cancelling}
                        className='flex-1 px-4 py-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-60'
                    >
                        Keep It
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className='flex-1 px-4 py-3 bg-error-500 hover:bg-error-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-error-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2'
                    >
                        {cancelling ? (
                            <>
                                <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                                </svg>
                                Cancelling…
                            </>
                        ) : (
                            'Confirm Cancel'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCancelModal;
