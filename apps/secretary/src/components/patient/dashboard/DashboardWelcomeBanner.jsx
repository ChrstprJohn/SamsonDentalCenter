import React from 'react';
import { UserPlus, CalendarPlus, Printer } from 'lucide-react';

const DashboardWelcomeBanner = ({ firstName = 'Lisa' }) => {
    return (
        <div className="relative overflow-hidden w-full rounded-2xl bg-[#00a884] p-6 sm:p-8 md:p-10 mb-4 sm:mb-6 transition-all duration-300">
            {/* Decorative circle */}
            <div className="absolute top-[-40%] right-[-10%] w-[60%] md:w-[50%] lg:w-[40%] pt-[60%] md:pt-[50%] lg:pt-[40%] rounded-full bg-white/10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
                <div className="max-w-2xl">
                    <h2 className="text-[clamp(1.5rem,4vw+1rem,2.75rem)] font-extrabold tracking-tight text-[#0B1120] font-outfit leading-tight">
                        Good morning, {firstName}!
                    </h2>
                    <p className="mt-2 text-white/95 text-[clamp(0.875rem,2vw+0.5rem,1.125rem)] font-medium leading-relaxed">
                        Here's what's happening today at DentaCare.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full shrink-0 mt-2">
                    <button 
                        className="flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-full bg-white px-6 sm:px-7 py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-bold text-[#00a884] transition-all hover:bg-gray-50 shadow-sm active:scale-95"
                    >
                        <UserPlus size={20} className="shrink-0" />
                        <span>Register Patient</span>
                    </button>
                    
                    <button 
                        className="flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-full bg-black/10 px-6 sm:px-7 py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-bold text-white transition-all hover:bg-black/20 shadow-sm active:scale-95 border border-white/10"
                    >
                        <CalendarPlus size={20} className="shrink-0" />
                        <span>Book Appointment</span>
                    </button>

                    <button 
                        className="flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-full bg-black/10 px-6 sm:px-7 py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-bold text-white transition-all hover:bg-black/20 shadow-sm active:scale-95 border border-white/10"
                    >
                        <Printer size={20} className="shrink-0" />
                        <span>Print Schedule</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardWelcomeBanner;
