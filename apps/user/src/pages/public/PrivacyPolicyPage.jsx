import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import PageHeader from '../../components/common/PageHeader';
import PrivacyContent from '../../components/legal/PrivacyContent';

const PrivacyPolicyPage = () => {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.5 }
        );
    }, []);

    return (
        <div className='min-h-screen bg-stone-50'>
            <PageHeader
                title='Privacy Policy'
                subtitle='How we protect your data at Samson Dental Center.'
            />
            
            <main className='py-20 lg:py-32 relative'>
                {/* Decorative Elements */}
                <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
                    <div className='absolute top-20 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] -mr-48'></div>
                    <div className='absolute bottom-40 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] -ml-36'></div>
                </div>

                <div className='max-w-5xl mx-auto px-6 relative z-10'>
                    <div 
                        ref={cardRef}
                        className='bg-white rounded-[2.5rem] border border-stone-200/60 p-8 sm:p-12 lg:p-20 shadow-2xl shadow-stone-200/40'
                    >
                        <PrivacyContent />
                    </div>

                    <div className='mt-12 text-center'>
                        <p className='text-sm text-stone-400 font-medium italic'>
                            Note: This document is for informational purposes and reflects our actual clinical policies.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicyPage;
