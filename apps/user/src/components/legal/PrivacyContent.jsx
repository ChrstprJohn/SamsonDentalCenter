import React from 'react';
import { Shield, Eye, Lock, UserCheck, Mail, Info } from 'lucide-react';

const PrivacyContent = () => {
    const sections = [
        {
            title: '1. Information We Collect',
            icon: Eye,
            content: 'We collect several types of information to provide you with the best dental care, including personal identification (name, email, phone), sensitive health information (dental history, medical conditions), and account credentials managed securely via Supabase.',
        },
        {
            title: '2. How We Use Your Information',
            icon: Shield,
            content: 'Your data is used strictly for clinical and administrative purposes: booking and confirming appointments, maintaining accurate dental records, and processing your inquiries via our AI Assistant.',
        },
        {
            title: '3. Data Protection & Security',
            icon: Lock,
            iconColor: 'text-red-500',
            content: 'We implement industry-standard security measures. All sensitive data is encrypted in transit and at rest. Access is limited to authorized clinical and administrative staff only.',
        },
        {
            title: '4. AI Chatbot Privacy',
            icon: Info,
            content: 'Our AI Assistant helps with general inquiries. We do not use your personal health data to train AI models. Chat logs are monitored for quality assurance and system improvement.',
        },
        {
            title: '5. Your Rights',
            icon: UserCheck,
            content: 'You have the right to access, download, and request corrections to your data. You may also request account deletion, subject to local medical record retention laws.',
        },
    ];

    return (
        <div className='space-y-12'>
            <div className='flex flex-col gap-4 mb-12 border-b border-stone-100 pb-8'>
                <h1 className='text-4xl font-black text-stone-900 tracking-tight'>Privacy Policy</h1>
                <p className='text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2'>
                    <span className='w-2 h-2 bg-red-500 rounded-full' />
                    Effective Date: May 15, 2026
                </p>
                <p className='text-lg text-stone-600 leading-relaxed max-w-2xl mt-2'>
                    At <span className='text-stone-900 font-bold'>Samson Dental Center</span>, we are committed to protecting your personal and dental health information. This policy explains our commitment to your data security.
                </p>
            </div>

            <div className='grid gap-10'>
                {sections.map((section) => (
                    <div key={section.title} className='group'>
                        <div className='flex items-start gap-6'>
                            <div className='shrink-0 w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:bg-red-50 group-hover:border-red-100 transition-colors duration-300'>
                                <section.icon className={`w-6 h-6 ${section.iconColor || 'text-stone-400'} group-hover:text-red-500 transition-colors duration-300`} />
                            </div>
                            <div>
                                <h3 className='text-xl font-bold text-stone-900 mb-3 tracking-tight'>
                                    {section.title}
                                </h3>
                                <p className='text-stone-600 leading-relaxed text-base'>
                                    {section.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-16 p-8 rounded-[2rem] bg-stone-50 border border-stone-100 flex flex-col sm:flex-row items-center gap-6 justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm'>
                        <Mail className='w-5 h-5 text-red-500' />
                    </div>
                    <div>
                        <p className='text-sm font-bold text-stone-900'>Have questions?</p>
                        <p className='text-xs text-stone-500 font-medium'>Contact our privacy team</p>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <a href='mailto:samsondental@gmail.com' className='px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors'>
                        Email Us
                    </a>
                    <a href='tel:09454921251' className='px-6 py-3 bg-white text-stone-900 border border-stone-200 rounded-xl text-sm font-bold hover:bg-stone-50 transition-colors'>
                        Call Now
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PrivacyContent;
