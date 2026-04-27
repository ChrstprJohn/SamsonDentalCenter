import React from 'react';
import { Modal, Button } from '../../ui';
import { ClipboardList, StickyNote, CheckCircle2, Clock, User, Phone } from 'lucide-react';

const CheckOutModal = ({ isOpen, onClose, appointment, onConfirm, isReadOnly = false }) => {
    if (!appointment) return null;

    const servicesRendered = [
        {
            name: "Consultation",
            category: "General",
            description: "Routine oral health assessment and treatment planning."
        },
        {
            name: "Endodontic Treatment",
            category: "Specialized",
            description: "Root canal therapy for deep infection management."
        },
        {
            name: "Oral Prophylaxis",
            category: "General",
            description: "Professional cleaning and plaque removal."
        }
    ];

    const sampleDoctorNotes = "Procedure completed without complications. Patient advised to return in 2 weeks for the final crown placement. Prescribed Ibuprofen 400mg for post-op discomfort.";

    const handleConfirm = () => {
        onConfirm(appointment.id);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[640px]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 rounded-t-3xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-outfit tracking-tight">
                    {isReadOnly ? 'Appointment Details' : 'Finalize Check Out'}
                </h2>
                {!isReadOnly && (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Review treatment details and patient information.
                    </p>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 space-y-6">
                
                {/* Comprehensive Patient & Appointment Info Card */}
                <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.01] overflow-hidden shadow-sm">
                    {/* Top Section: Patient & Doctor */}
                    <div className="p-5 flex items-start justify-between gap-4 border-b border-gray-50 dark:border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img 
                                    src={appointment.patientAvatar} 
                                    alt={appointment.patient} 
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white dark:border-gray-800 shadow-md object-cover"
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white font-outfit text-lg sm:text-xl truncate">
                                    {appointment.patient}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <User size={12} className="text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Patient</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Attending Doctor</span>
                            <p className="text-sm font-bold text-gray-900 dark:text-white font-outfit uppercase">
                                {appointment.doctor || "Dr. Emily Chen"}
                            </p>
                        </div>
                    </div>

                    {/* Middle Section: Appointment Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-gray-50 dark:divide-white/5 bg-white dark:bg-gray-800/20">
                        <div className="p-4 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Clock size={10} />
                                Start
                            </span>
                            <span className="text-sm font-bold text-[#0B1120] dark:text-white font-outfit">
                                {appointment.startTime}
                            </span>
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Clock size={10} />
                                End
                            </span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 font-outfit">
                                {appointment.endTime}
                            </span>
                        </div>
                        <div className="p-4 flex flex-col gap-1 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-gray-50 dark:border-white/5">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Phone size={10} />
                                Contact
                            </span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                                {appointment.contact || appointment.phone || "+63 920 987 6543"}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Section: Service Type */}
                    <div className="p-4 bg-brand-50/20 dark:bg-brand-500/[0.02] border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Main Service:</span>
                            <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">{appointment.service}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status:</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                appointment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
                                appointment.status === 'No Show' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                            }`}>
                                {appointment.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Treatment Summary - Side by Side Cards */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                        <label className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                            <ClipboardList size={14} className="text-brand-500" />
                            Clinical Summary
                        </label>
                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-100/50 dark:bg-brand-500/10 px-2 py-0.5 rounded-full">
                            {servicesRendered.length} Procedures
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                        {servicesRendered.map((service, idx) => (
                            <div key={idx} className="flex-1 min-w-[160px] flex items-center gap-3 p-4 pr-5 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01] hover:bg-white dark:hover:bg-white/[0.03] transition-all group shadow-sm hover:shadow-md">
                                <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-col">
                                        <p className="text-[14px] sm:text-[15px] font-bold text-gray-800 dark:text-white/90 leading-tight mb-1">
                                            {service.name}
                                        </p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${service.category === 'Specialized' ? 'text-amber-500' : 'text-brand-500/70'}`}>
                                            {service.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-3 pb-2">
                    <label className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                        <StickyNote size={14} className="text-amber-500" />
                        Clinician's Notes
                    </label>
                    <div className="p-4 bg-amber-50/40 dark:bg-amber-500/[0.02] border border-amber-100/30 dark:border-amber-500/10 rounded-2xl shadow-inner">
                        <p className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed italic font-medium">
                            "{sampleDoctorNotes}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 dark:border-white/5 flex items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02] rounded-b-3xl">
                {isReadOnly ? (
                    <Button 
                        onClick={onClose}
                        className="w-full h-11 font-black text-[11px] uppercase tracking-widest bg-gray-800 hover:bg-gray-900 text-white shadow-lg border-none transition-all active:scale-95"
                    >
                        Close Details
                    </Button>
                ) : (
                    <>
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="flex-1 h-11 font-black text-[11px] uppercase tracking-widest border-gray-200 dark:border-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirm}
                            className="flex-1 h-11 font-black text-[11px] uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 border-none"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle2 size={16} />
                                <span>Confirm Check Out</span>
                            </div>
                        </Button>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default CheckOutModal;
