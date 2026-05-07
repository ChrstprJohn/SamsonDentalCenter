import React from 'react';
import EmailTemplateEditor from './EmailTemplateEditor';
import VariableHelper from './VariableHelper';

const TemplateEditorLayout = ({ 
    selectedTemplate, 
    onSave, 
    onRestore, 
    showVariables 
}) => {
    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Left Section: Editor & Preview */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
                <EmailTemplateEditor 
                    template={selectedTemplate} 
                    onSave={onSave}
                    onRestore={onRestore}
                />
            </div>

            {/* Right Section: Variable Helper (Closeable) */}
            {showVariables && (
                <div className="w-80 shrink-0 bg-gray-50/30 overflow-y-auto animate-in slide-in-from-right duration-300">
                    <VariableHelper 
                        required={selectedTemplate.required_variables} 
                        optional={selectedTemplate.optional_variables}
                        description={selectedTemplate.description}
                    />
                </div>
            )}
        </div>
    );
};

export default TemplateEditorLayout;
