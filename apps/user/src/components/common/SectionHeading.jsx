const SectionHeading = ({
    title,
    subtitle,
    overline,
    backgroundImage,
    light = false,
    centered = true,
    className = '',
}) => {
    return (
        <div
            className={`relative ${centered ? 'text-center' : 'text-left'} mb-12 sm:mb-16 lg:mb-20 ${className}`}
        >
            {backgroundImage && (
                <div className='absolute inset-0 -z-10 overflow-hidden pointer-events-none'>
                    <img
                        src={backgroundImage}
                        alt=''
                        className='w-full h-full object-cover opacity-100 blur-[2px]'
                    />
                    <div
                        className={`absolute inset-0 bg-linear-to-b ${
                            light
                                ? 'from-slate-900 via-transparent to-slate-900'
                                : 'from-white via-transparent to-white'
                        }`}
                    ></div>
                </div>
            )}

            {overline && (
                <div
                    className={`flex items-center gap-3 mb-6 ${centered ? 'justify-center' : 'justify-start'}`}
                >
                    <span className={`h-px w-8 ${light ? 'bg-blue-400/50' : 'bg-blue-600'}`}></span>
                    <span
                        className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                            light ? 'text-blue-400' : 'text-blue-600'
                        }`}
                    >
                        {overline}
                    </span>
                </div>
            )}

            <h2
                className={`text-[clamp(2.25rem,6vw+0.5rem,4rem)] font-bold leading-[1.1] tracking-tight mb-6 sm:mb-8 ${
                    light ? 'text-white' : 'text-slate-900'
                }`}
            >
                {title}
            </h2>

            {subtitle && (
                <p
                    className={`text-[clamp(1.125rem,2vw+0.5rem,1.25rem)] max-w-2xl leading-relaxed font-medium ${
                        centered ? 'mx-auto' : ''
                    } ${light ? 'text-slate-400' : 'text-slate-500/90'}`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;
