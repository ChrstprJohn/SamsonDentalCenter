import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const ContactInfo = () => {
    const contactItems = [
        {
            icon: MapPin,
            title: 'Visit Us',
            lines: ['123 Dental Street', 'City Center, 12345'],
        },
        {
            icon: Phone,
            title: 'Call Us',
            lines: ['(555) 123-4567', '(555) 765-4321'],
        },
        {
            icon: Mail,
            title: 'Email Us',
            lines: ['info@primeradenta.com', 'appointments@primeradenta.com'],
        },
        {
            icon: Clock,
            title: 'Operating Hours',
            lines: ['Mon–Fri: 8:00 AM – 6:00 PM', 'Sat: 9:00 AM – 3:00 PM', 'Sun: Closed'],
        },
    ];

    return (
        <section className='py-16 sm:py-20 bg-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {contactItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className='bg-slate-50 rounded-xl p-6 text-center
                                           hover:bg-sky-50 hover:border-sky-100 transition-colors
                                           border border-slate-100'
                            >
                                <div className='w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <Icon
                                        size={20}
                                        className='text-sky-600'
                                    />
                                </div>
                                <h3 className='font-bold text-slate-900 mb-2'>{item.title}</h3>
                                {item.lines.map((line, i) => (
                                    <p
                                        key={i}
                                        className='text-sm text-slate-500'
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ContactInfo;
