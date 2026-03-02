const ContactMap = () => {
    return (
        <section className='py-16 sm:py-20 bg-slate-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {/* Map — takes 2 columns */}
                    <div className='md:col-span-2'>
                        {/* 
                            Replace this placeholder with a real Google Maps or Leaflet embed.
                            Example:
                            <iframe
                                src="https://www.google.com/maps/embed?pb=..."
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Clinic Location"
                            />
                        */}
                        <div className='aspect-video bg-slate-200 rounded-xl flex items-center justify-center'>
                            <span className='text-slate-400 text-sm'>Google Maps Embed</span>
                        </div>
                    </div>

                    {/* Directions text — takes 1 column */}
                    <div className='flex flex-col justify-center'>
                        <h3 className='text-xl font-bold text-slate-900 mb-4'>How to Find Us</h3>
                        <p className='text-slate-600 text-sm leading-relaxed mb-4'>
                            We're conveniently located in the heart of City Center, just two blocks
                            from the main plaza. Look for the blue Primera Denta sign above the
                            entrance.
                        </p>
                        <div className='space-y-2'>
                            <p className='text-sm text-slate-500'>
                                🚗 <strong>By Car:</strong> Free parking available behind the
                                building.
                            </p>
                            <p className='text-sm text-slate-500'>
                                🚌 <strong>By Bus:</strong> Routes 12, 15, 23 stop within 1 block.
                            </p>
                            <p className='text-sm text-slate-500'>
                                🚶 <strong>Landmark:</strong> Next to City Central Pharmacy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactMap;
