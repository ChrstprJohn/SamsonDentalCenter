import React from 'react';
import WeeklyRoutine from './WeeklyRoutine';
import WeeklyTimeline from './WeeklyTimeline';

const DoctorScheduleDetail = ({ doctor }) => {
    const [isBlockModalOpen, setIsBlockModalOpen] = React.useState(false);

    return (
        <div className='flex flex-col gap-6'>
            {/* Top row: The main weekly form */}
            <div className='w-full'>
                <WeeklyRoutine 
                    doctor={doctor} 
                    externalBlockModalOpen={isBlockModalOpen}
                    setExternalBlockModalOpen={setIsBlockModalOpen}
                />
            </div>

            {/* Bottom row: Weekly Timeline view */}
            <div className='w-full'>
                <WeeklyTimeline 
                    doctor={doctor} 
                    onBlockClick={() => setIsBlockModalOpen(true)}
                />
            </div>
        </div>
    );
};

export default DoctorScheduleDetail;

