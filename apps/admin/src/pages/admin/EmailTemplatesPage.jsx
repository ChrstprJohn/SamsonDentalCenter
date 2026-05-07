import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { useEmailTemplates } from '../../hooks/useEmailTemplates';
import TemplateHeader from '../../components/admin/email-templates/TemplateHeader';
import TemplateTabs from '../../components/admin/email-templates/TemplateTabs';
import TemplateEditorLayout from '../../components/admin/email-templates/TemplateEditorLayout';

const EmailTemplatesPage = () => {
    const {
        templates,
        loading,
        isRefreshing,
        selectedKey,
        setSelectedKey,
        selectedTemplate,
        activeTab,
        setActiveTab,
        categories,
        handleSave,
        handleRestore,
        refreshTemplates
    } = useEmailTemplates();

    const [showVariables, setShowVariables] = useState(true);

    return (
        <div className="flex flex-col h-full bg-slate-50/30">
            {/* Standard Page Title & Breadcrumb */}
            <PageBreadcrumb pageTitle="Email Templates" />

            {/* Main Action Card */}
            <div className="flex-grow flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm min-h-[850px]">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-6 py-32 bg-gray-50/20">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center border border-gray-100 shadow-xl shadow-gray-200/50">
                            <Mail className="w-10 h-10 text-brand-500 animate-spin" />
                        </div>
                        <div className="text-center px-6">
                            <h3 className="text-gray-900 font-black uppercase tracking-tight text-xl">Loading templates</h3>
                            <p className="text-xs font-bold text-gray-400 mt-2 max-w-[280px] uppercase tracking-widest leading-loose">Synchronizing communication engine...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <TemplateHeader 
                            templates={templates}
                            selectedKey={selectedKey}
                            onSelect={setSelectedKey}
                            onRefresh={refreshTemplates}
                            isRefreshing={isRefreshing}
                            showVariables={showVariables}
                            onToggleVariables={() => setShowVariables(!showVariables)}
                        />

                        {selectedTemplate ? (
                            <TemplateEditorLayout 
                                selectedTemplate={selectedTemplate}
                                onSave={handleSave}
                                onRestore={handleRestore}
                                showVariables={showVariables}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-6 py-32 bg-gray-50/20">
                                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center border border-gray-100 shadow-xl shadow-gray-200/50">
                                    <Mail className="w-10 h-10 text-brand-500 opacity-20" />
                                </div>
                                <div className="text-center px-6">
                                    <h3 className="text-gray-900 font-black uppercase tracking-tight text-xl">No template selected</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-2 max-w-[280px] uppercase tracking-widest leading-loose">Select a template from the list above to begin editing</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailTemplatesPage;
