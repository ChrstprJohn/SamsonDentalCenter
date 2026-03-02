const Mission = () => {
    const values = [
        {
            icon: '🎯',
            title: 'Patient-First Care',
            description: 'Your comfort and well-being are at the heart of everything we do.',
        },
        {
            icon: '🔬',
            title: 'Modern Technology',
            description: 'We use the latest dental equipment and techniques for the best results.',
        },
        {
            icon: '💎',
            title: 'Quality & Precision',
            description: 'Every procedure is performed with meticulous attention to detail.',
        },
        {
            icon: '🤝',
            title: 'Trust & Transparency',
            description: 'Clear communication about treatments, costs, and expected outcomes.',
        },
    ];

    return (
        <section className='py-16 sm:py-20 bg-gradient-to-br from-sky-50 to-blue-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                <h2 className='text-3xl sm:text-4xl font-bold text-slate-900 mb-4'>Our Mission</h2>
                <p className='text-lg text-slate-600 max-w-3xl mx-auto mb-12'>
                    To provide exceptional dental care that empowers every patient to smile with
                    confidence, through personalized treatment, modern technology, and a
                    compassionate team.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {values.map((value) => (
                        <div
                            key={value.title}
                            className='bg-white rounded-xl p-6 shadow-sm border border-slate-100'
                        >
                            <div className='text-3xl mb-3'>{value.icon}</div>
                            <h3 className='font-bold text-slate-900 mb-2'>{value.title}</h3>
                            <p className='text-sm text-slate-500'>{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mission;
