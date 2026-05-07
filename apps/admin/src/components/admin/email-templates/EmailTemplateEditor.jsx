import React, { useState, useEffect, useRef } from 'react';
import { Save, RotateCcw, Eye, Code, Smartphone, Monitor, Info, CheckCircle2 } from 'lucide-react';

const EmailTemplateEditor = ({ template, onSave, onRestore }) => {
    const [subject, setSubject] = useState('');
    const [html, setHtml] = useState('');
    const [viewMode, setViewMode] = useState('edit'); // 'edit', 'preview'
    const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop', 'mobile'
    const [hasChanges, setHasChanges] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const iframeRef = useRef(null);

    useEffect(() => {
        if (template) {
            setSubject(template.subject_line || '');
            setHtml(template.html_content || '');
            setHasChanges(false);
            setIsEditable(false);
        }
    }, [template]);

    const handleSave = () => {
        onSave({ subject_line: subject, html_content: html });
        setHasChanges(false);
        setIsEditable(false);
    };

    const handleCancel = () => {
        setSubject(template.subject_line || '');
        setHtml(template.html_content || '');
        setHasChanges(false);
        setIsEditable(false);
    };

    const handleHtmlChange = (e) => {
        if (!isEditable) return;
        setHtml(e.target.value);
        setHasChanges(true);
    };

    const handleSubjectChange = (e) => {
        if (!isEditable) return;
        setSubject(e.target.value);
        setHasChanges(true);
    };

    // Inject demo data for preview
    const getPreviewHtml = () => {
        let preview = html;
        const demoData = {
            name: 'John Doe',
            otpCode: '123456',
            clinicName: 'Samson Dental Center',
            clinicAddress: '7 Himalayan Rd, Tandang Sora, Quezon City',
            clinicPhone: '+63 917 123 4567',
            service: 'Dental Cleaning & Consultation',
            serviceName: 'Dental Cleaning',
            date: '2026-05-15',
            appointmentDate: 'Friday, May 15, 2026',
            startTime: '10:00 AM',
            start_time: '10:00 AM',
            endTime: '11:00 AM',
            end_time: '11:00 AM',
            dentist: 'Dr. Maria Santos',
            reason: 'Routine maintenance and health check.',
            setupUrl: 'https://samson-dental.com/setup',
            expiryHours: '24',
            clinicYear: new Date().getFullYear(),
        };

        for (const [key, value] of Object.entries(demoData)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            preview = preview.replace(regex, value);
        }

        return preview;
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-1.5 p-1 bg-gray-200/50 rounded-lg">
                    <button 
                        onClick={() => setViewMode('edit')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                            viewMode === 'edit' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Code className="w-3.5 h-3.5" />
                        Source
                    </button>
                    <button 
                        onClick={() => setViewMode('preview')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                            viewMode === 'preview' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {viewMode === 'preview' && (
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 mr-2 shadow-sm">
                            <button 
                                onClick={() => setPreviewDevice('desktop')}
                                className={`p-1.5 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-brand-50 text-brand-600' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <Monitor className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setPreviewDevice('mobile')}
                                className={`p-1.5 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-brand-50 text-brand-600' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    
                    <button 
                        onClick={onRestore}
                        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Default
                    </button>

                    {isEditable ? (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg transition-all active:scale-95 shadow-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className={`flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 ${
                                    hasChanges 
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-200 hover:bg-brand-600' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                }`}
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditable(true)}
                            className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-brand-200 text-brand-600 shadow-sm hover:bg-brand-50 rounded-lg transition-all active:scale-95"
                        >
                            <Code className="w-4 h-4" />
                            Edit Template
                        </button>
                    )}
                </div>
            </div>

            {/* Inputs Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <div className="px-6 py-5 border-b border-gray-100 space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Subject Line</label>
                            {isEditable ? (
                                hasChanges && <span className="text-[10px] font-bold text-brand-500 flex items-center gap-1"><Info className="w-3 h-3"/> Unsaved Changes</span>
                            ) : (
                                <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">Read Only Mode</span>
                            )}
                        </div>
                        <input 
                            type="text"
                            value={subject}
                            onChange={handleSubjectChange}
                            readOnly={!isEditable}
                            className={`w-full px-4 py-3 border rounded-xl text-sm font-bold transition-all placeholder:text-gray-300 ${
                                isEditable 
                                ? 'bg-white border-brand-500/30 text-gray-900 focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500' 
                                : 'bg-gray-50/50 border-gray-100 text-gray-500 cursor-not-allowed'
                            }`}
                            placeholder="Type the email subject..."
                        />
                    </div>
                </div>

                <div className="flex-1 relative bg-gray-50/30 overflow-hidden">
                    <div className="absolute inset-0 p-6 flex flex-col">
                        {viewMode === 'edit' ? (
                            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all focus-within:ring-2 focus-within:ring-brand-500/5 focus-within:border-brand-500/30">
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Raw HTML Editor</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-400 italic">Supports Inline CSS & HTML5</span>
                                </div>
                                <textarea 
                                    value={html}
                                    onChange={handleHtmlChange}
                                    readOnly={!isEditable}
                                    className={`flex-1 w-full p-8 text-sm font-mono focus:outline-none resize-none leading-relaxed no-scrollbar transition-all ${
                                        isEditable 
                                        ? 'bg-white text-gray-700' 
                                        : 'bg-gray-50/20 text-gray-400 cursor-not-allowed'
                                    }`}
                                    placeholder="Enter your email HTML structure here..."
                                />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-gray-100/50 rounded-2xl border border-gray-200 shadow-inner overflow-hidden relative">
                                <div 
                                    className={`bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-500 ease-out border border-gray-200 flex flex-col ${
                                        previewDevice === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full h-full'
                                    }`}
                                >
                                    <iframe 
                                        ref={iframeRef}
                                        title="Email Preview"
                                        className="flex-1 w-full border-none"
                                        srcDoc={getPreviewHtml()}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplateEditor;


