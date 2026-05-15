import React from 'react';
import { FileText, Calendar, Clock, AlertTriangle, Cpu, Scale, RefreshCw, MapPin } from 'lucide-react';

const TermsContent = () => {
    const sections = [
        {
            title: '1. Acceptance of Terms',
            icon: FileText,
            content: 'By registering for an account or booking an appointment through this portal, you accept these Terms of Service in full. If you disagree with any part of these terms, you must not use our services.',
        },
        {
            title: '2. Appointment Booking',
            icon: Calendar,
            content: 'Users must provide true and accurate personal and medical information. Specialized services may require clinical approval before a slot is confirmed. Please arrive at least 15 minutes before your scheduled time.',
        },
        {
            title: '3. Cancellation & No-Show Policy',
            icon: Clock,
            iconColor: 'text-red-500',
            content: 'Cancellations must be made at least 24 hours prior. 3 or more No-Shows will result in account restrictions, limiting your booking window to a maximum of 3 days in advance.',
        },
        {
            title: '4. AI Assistant Disclaimer',
            icon: Cpu,
            content: "The Samson AI Agent's responses are for informational purposes only and do not constitute clinical diagnosis or medical advice. Always prioritize the instructions provided by our clinical staff.",
        },
        {
            title: '5. User Conduct',
            icon: AlertTriangle,
            content: 'You agree not to use the portal for fraudulent purposes, interfere with system security, or transmit any abusive material through the chatbot interface.',
        },
        {
            title: '6. Limitation of Liability',
            icon: Scale,
            content: 'Samson Dental Center shall not be liable for indirect damages resulting from digital service usage, including potential inaccuracies in AI-generated responses.',
        },
    ];

    return (
        <div className='space-y-12'>
            <div className='flex flex-col gap-4 mb-12 border-b border-stone-100 pb-8'>
                <h1 className='text-4xl font-black text-stone-900 tracking-tight'>Terms of Service</h1>
                <p className='text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2'>
                    <span className='w-2 h-2 bg-red-500 rounded-full' />
                    Last Updated: May 15, 2026
                </p>
                <p className='text-lg text-stone-600 leading-relaxed max-w-2xl mt-2'>
                    Welcome to the <span className='text-stone-900 font-bold'>Samson Dental Center</span> Patient Portal. These terms govern your use of our digital booking and information services.
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16'>
                {sections.map((section) => (
                    <div key={section.title} className='group'>
                        <div className='flex items-start gap-5'>
                            <div className='shrink-0 w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-100 transition-all duration-300 group-hover:rotate-6'>
                                <section.icon className={`w-5 h-5 ${section.iconColor || 'text-stone-400'} group-hover:text-red-500 transition-colors duration-300`} />
                            </div>
                            <div>
                                <h3 className='text-lg font-bold text-stone-900 mb-3 tracking-tight'>
                                    {section.title}
                                </h3>
                                <p className='text-stone-600 leading-relaxed text-sm'>
                                    {section.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-20 grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='p-8 rounded-[2rem] bg-stone-950 text-white flex flex-col justify-between min-h-[200px] shadow-xl shadow-stone-900/10'>
                    <MapPin className='w-8 h-8 text-red-500 mb-6' />
                    <div>
                        <p className='text-sm font-bold opacity-60 uppercase tracking-widest mb-2'>Clinic Location</p>
                        <p className='text-lg font-bold'>Upper Session Road, Baguio City</p>
                    </div>
                </div>
                <div className='p-8 rounded-[2rem] bg-white border border-stone-100 flex flex-col justify-between min-h-[200px] shadow-sm'>
                    <RefreshCw className='w-8 h-8 text-stone-300 mb-6' />
                    <div>
                        <p className='text-sm font-bold text-stone-400 uppercase tracking-widest mb-2'>Updates</p>
                        <p className='text-lg font-bold text-stone-900'>Terms are effective immediately upon posting.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsContent;
