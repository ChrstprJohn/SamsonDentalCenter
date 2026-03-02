import { useState } from 'react';
import { Send, Phone, Mail, Clock } from 'lucide-react';
import useInquiry from '../../hooks/useInquiry';

const InquiryForm = () => {
    const { submitInquiry, loading, error, success, reset } = useInquiry();

    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitInquiry(form);
    };

    if (success) {
        return (
            <div className='text-center py-16'>
                <div className='text-5xl mb-4'>✅</div>
                <h3 className='text-2xl font-bold text-slate-900 mb-2'>Message Sent!</h3>
                <p className='text-slate-500 mb-6'>
                    Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                    onClick={() => {
                        reset();
                        setForm({ name: '', email: '', subject: '', message: '' });
                    }}
                    className='text-sky-500 hover:text-sky-600 font-medium text-sm'
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-12'>
            {/* Form — takes 3 columns */}
            <form
                onSubmit={handleSubmit}
                className='lg:col-span-3 space-y-5'
            >
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm'>
                        {error}
                    </div>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                            Full Name
                        </label>
                        <input
                            type='text'
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder='Juan Dela Cruz'
                            className='w-full px-4 py-2.5 border border-slate-200 rounded-xl
                                       text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20
                                       focus:border-sky-400 transition-colors'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                            Email Address
                        </label>
                        <input
                            type='email'
                            name='email'
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder='juan@email.com'
                            className='w-full px-4 py-2.5 border border-slate-200 rounded-xl
                                       text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20
                                       focus:border-sky-400 transition-colors'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                        Subject
                    </label>
                    <input
                        type='text'
                        name='subject'
                        value={form.subject}
                        onChange={handleChange}
                        required
                        placeholder='e.g. Question about teeth whitening'
                        className='w-full px-4 py-2.5 border border-slate-200 rounded-xl
                                   text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20
                                   focus:border-sky-400 transition-colors'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                        Message
                    </label>
                    <textarea
                        name='message'
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder='Tell us what you need help with...'
                        className='w-full px-4 py-2.5 border border-slate-200 rounded-xl
                                   text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20
                                   focus:border-sky-400 transition-colors resize-none'
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600
                               text-white font-semibold px-6 py-3 rounded-xl transition-colors
                               shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    <Send size={16} />
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>

            {/* Quick Info sidebar — takes 2 columns */}
            <div className='lg:col-span-2 space-y-6'>
                <div className='bg-slate-50 rounded-xl p-6 space-y-5'>
                    <h3 className='font-bold text-slate-900'>Quick Contact</h3>

                    <div className='flex items-start gap-3'>
                        <Phone
                            size={18}
                            className='text-sky-500 mt-0.5 shrink-0'
                        />
                        <div>
                            <p className='text-sm font-medium text-slate-700'>Phone</p>
                            <p className='text-sm text-slate-500'>(555) 123-4567</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-3'>
                        <Mail
                            size={18}
                            className='text-sky-500 mt-0.5 shrink-0'
                        />
                        <div>
                            <p className='text-sm font-medium text-slate-700'>Email</p>
                            <p className='text-sm text-slate-500'>info@primeradenta.com</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-3'>
                        <Clock
                            size={18}
                            className='text-sky-500 mt-0.5 shrink-0'
                        />
                        <div>
                            <p className='text-sm font-medium text-slate-700'>Response Time</p>
                            <p className='text-sm text-slate-500'>
                                We typically respond within 24 hours during business days.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='bg-sky-50 border border-sky-100 rounded-xl p-6'>
                    <h3 className='font-bold text-slate-900 mb-2'>Need Urgent Help?</h3>
                    <p className='text-sm text-slate-600'>
                        For dental emergencies, please call us directly at{' '}
                        <strong>(555) 123-4567</strong>. We accommodate same-day emergency visits
                        when possible.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InquiryForm;
