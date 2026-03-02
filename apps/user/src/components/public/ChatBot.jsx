import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatBot = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className='fixed bottom-6 right-6 z-50'>
            {open && (
                <div
                    className='mb-4 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-200
                               flex flex-col overflow-hidden'
                >
                    <div className='bg-sky-500 text-white px-4 py-3 flex items-center justify-between'>
                        <span className='font-semibold text-sm'>AI Assistant</span>
                        <button onClick={() => setOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>
                    <div className='flex-grow p-4 flex items-center justify-center text-slate-400 text-sm'>
                        <p>How can I help you today?</p>
                    </div>
                </div>
            )}
            <button
                onClick={() => setOpen(!open)}
                className='w-14 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-full
                           shadow-lg flex items-center justify-center transition-all
                           hover:scale-105 active:scale-95'
            >
                <MessageCircle size={24} />
            </button>
        </div>
    );
};

export default ChatBot;
