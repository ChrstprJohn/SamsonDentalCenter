import React from 'react';
import { format } from 'date-fns';

const CalendarEvent = ({ event, color, width, left }) => {
    // Calculate position
    // Start hour is 8 AM. Cell height is 100px.
    const startHour = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const top = (startHour - 8) * 80 + (startMinutes / 60) * 80;
    const height = (event.duration / 60) * 80;

    const getStatusStyle = () => {
        switch (event.type) {
            case 'pending':
                return {
                    background: `repeating-linear-gradient(45deg, ${color}15, ${color}15 10px, ${color}25 10px, ${color}25 20px)`,
                    borderColor: color,
                    opacity: 0.8
                };
            case 'blocked':
                return {
                    backgroundColor: '#fef3f2',
                    borderColor: '#f04438',
                    borderStyle: 'solid'
                };
            default: // confirmed
                return {
                    backgroundColor: color,
                    borderColor: color,
                    color: 'white'
                };
        }
    };

    const style = getStatusStyle();

    return (
        <div 
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('eventId', event.id);
                e.currentTarget.style.opacity = '0.5';
            }}
            onDragEnd={(e) => {
                e.currentTarget.style.opacity = '1';
            }}
            className={`absolute px-3 py-2 rounded-xl border-l-[4px] shadow-theme-sm transition-all hover:scale-[1.01] hover:z-20 cursor-grab active:cursor-grabbing overflow-hidden group`}
            style={{
                top: `${top}px`,
                height: `${height - 4}px`,
                left: `${left}%`,
                width: `${width > 90 ? '96%' : `${width-2}%`}`,
                margin: '2px',
                ...style
            }}
        >
            <div className="flex flex-col h-full gap-0.5">
                <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest truncate ${event.type === 'confirmed' ? 'text-white/70' : 'text-gray-400'}`}>
                        {event.service}
                    </span>
                    <span className={`text-[10px] font-bold ${event.type === 'confirmed' ? 'text-white/60' : 'text-gray-400'}`}>
                        {format(event.start, 'h:mm')} - {format(new Date(event.start.getTime() + event.duration * 60000), 'h:mm a')}
                    </span>
                </div>
                <span className={`text-sm font-bold leading-tight truncate ${event.type === 'confirmed' ? 'text-white' : 'text-gray-800 dark:text-white/90'}`}>
                    {event.patientName}
                </span>
            </div>

            {/* Drag Handle visualization (Dots) */}
            <div className={`absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5`}>
                <div className={`w-1 h-1 rounded-full ${event.type === 'confirmed' ? 'bg-white/40' : 'bg-gray-300'}`} />
                <div className={`w-1 h-1 rounded-full ${event.type === 'confirmed' ? 'bg-white/40' : 'bg-gray-300'}`} />
            </div>
        </div>
    );
};

export default CalendarEvent;
