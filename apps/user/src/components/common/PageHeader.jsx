const PageHeader = ({
    title,
    subtitle,
    backgroundImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
}) => {
    return (
        <div className='relative w-full py-16 sm:py-24 lg:py-32 flex items-center overflow-hidden'>
            {/* Background Image */}
            <div className='absolute inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none'>
                <img
                    src={backgroundImage}
                    alt=''
                    className='w-full h-full object-cover'
                />
                {/* Mobile glassmorphism base for better contrast */}
                <div className='absolute inset-0 bg-white/60 sm:bg-transparent backdrop-blur-[2px] sm:backdrop-blur-none'></div>
                {/* Responsive gradient overlay */}
                <div className='absolute inset-0 bg-linear-to-b sm:bg-linear-to-r from-white/95 via-white/85 to-white/20 sm:to-transparent'></div>
            </div>

            {/* Content */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 w-full'>
                <div className='flex flex-col gap-4 sm:gap-6 max-w-2xl'>
                    <h1 className='text-[clamp(2.25rem,5vw+0.5rem,4rem)] font-bold tracking-tight leading-[1.15] text-slate-900'>
                        {title}
                    </h1>
                    {subtitle && (
                        <p className='text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] text-slate-600 max-w-xl leading-relaxed'>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
