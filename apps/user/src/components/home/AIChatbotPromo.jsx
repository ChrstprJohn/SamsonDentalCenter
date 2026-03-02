import SectionHeading from '../common/SectionHeading';
import { useNavigate } from 'react-router-dom';

const AIChatbotPromo = () => {
    const navigate = useNavigate();

    return (
        <section className='py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-600/5 rounded-full blur-[120px]'></div>
            </div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                    <div className='order-2 lg:order-1'>
                        <div className='relative group'>
                            {/* Chat Interface Mockup */}
                            <div className='bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 max-w-md mx-auto lg:mx-0 transform -rotate-2 group-hover:rotate-0 transition-all duration-500 ease-in-out'>
                                <div className='bg-slate-50/80 backdrop-blur-sm p-4 border-b border-slate-200/80 flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm'>
                                            <svg
                                                className='w-6 h-6'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                                                ></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className='font-bold text-slate-900 text-sm'>
                                                Dental AI Assistant
                                            </p>
                                            <p className='text-[10px] text-green-600 font-bold flex items-center uppercase tracking-wider'>
                                                <span className='w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse'></span>{' '}
                                                Online Now
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-6 space-y-4 bg-slate-50/30 h-80 overflow-y-auto'>
                                    <div className='flex justify-start'>
                                        <div className='bg-white rounded-xl rounded-tl-none p-4 max-w-[85%] text-sm text-slate-600 leading-relaxed font-medium border border-slate-100 shadow-sm'>
                                            Hello! How can I help you with your dental health today?
                                        </div>
                                    </div>
                                    <div className='flex justify-end'>
                                        <div className='bg-blue-600 text-white rounded-xl rounded-tr-none p-4 max-w-[85%] text-sm font-medium shadow-sm'>
                                            Do you offer teeth whitening services?
                                        </div>
                                    </div>
                                    <div className='flex justify-start'>
                                        <div className='bg-white rounded-xl rounded-tl-none p-4 max-w-[85%] text-sm text-slate-600 leading-relaxed font-medium border border-slate-100 shadow-sm'>
                                            Yes! We offer professional in-office whitening that can
                                            brighten your smile up to 8 shades. Would you like to
                                            see pricing?
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4 border-t border-slate-200/80 bg-slate-50/50'>
                                    <div className='h-10 bg-white rounded-xl border border-slate-200 w-full flex items-center px-4'>
                                        <span className='text-slate-400 text-xs'>
                                            Type your message...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='order-1 lg:order-2 text-center lg:text-left'>
                        <div className='inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl mb-8 border border-blue-100 shadow-sm'>
                            <svg
                                className='w-4 h-4'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M13 10V3L4 14h7v7l9-11h-7z'
                                ></path>
                            </svg>
                            <span className='text-[10px] font-bold uppercase tracking-widest'>
                                24/7 Smart Support
                            </span>
                        </div>
                        <h2 className='text-[clamp(2.25rem,5vw,3.5rem)] font-bold text-slate-900 leading-[1.1] tracking-tight mb-8'>
                            Instant Answers, <br />
                            <span className='text-blue-600'>Anytime.</span>
                        </h2>
                        <p className='text-lg text-slate-600 mb-10 leading-[1.6] max-w-xl mx-auto lg:mx-0 font-medium'>
                            Have questions about our services, pricing, or availability? Our
                            advanced AI Chatbot is ready to assist you instantly, guiding you to the
                            right care without the wait.
                        </p>
                        <div className='flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start'>
                            <button
                                onClick={() => navigate('/inquiries')}
                                className='w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                            >
                                Ask Our AI Now
                            </button>
                            <button
                                onClick={() => navigate('/services')}
                                className='w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ease-in-out'
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIChatbotPromo;
