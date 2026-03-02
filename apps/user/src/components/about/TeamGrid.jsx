import SectionHeading from '../common/SectionHeading';

const TeamGrid = () => {
    // Hardcoded team data — replace with backend /api/dentists or admin CMS later
    const team = [
        { name: 'Dr. Sarah Chen', role: 'Lead Dentist', speciality: 'Orthodontics' },
        { name: 'Dr. Miguel Santos', role: 'Dentist', speciality: 'Cosmetic Dentistry' },
        { name: 'Dr. Lisa Park', role: 'Dentist', speciality: 'Pediatric Dentistry' },
        { name: 'Maria Cruz', role: 'Dental Hygienist', speciality: '' },
        { name: 'James Tan', role: 'Office Manager', speciality: '' },
        { name: 'Ana Reyes', role: 'Dental Assistant', speciality: '' },
    ];

    return (
        <section className='py-16 sm:py-20 bg-slate-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <SectionHeading
                    title='Meet Our Team'
                    subtitle='Experienced professionals committed to your dental health.'
                />
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {team.map((member) => (
                        <div
                            key={member.name}
                            className='bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100'
                        >
                            {/* Avatar placeholder */}
                            <div className='w-20 h-20 bg-sky-100 rounded-full mx-auto mb-4 flex items-center justify-center'>
                                <span className='text-sky-500 font-bold text-xl'>
                                    {member.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </span>
                            </div>
                            <h3 className='font-bold text-slate-900'>{member.name}</h3>
                            <p className='text-sky-600 text-sm font-medium'>{member.role}</p>
                            {member.speciality && (
                                <p className='text-slate-400 text-xs mt-1'>{member.speciality}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamGrid;
