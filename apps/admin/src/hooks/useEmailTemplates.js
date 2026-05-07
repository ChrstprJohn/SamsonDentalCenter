import { useState, useEffect, useMemo } from 'react';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to manage email template operations
 */
export const useEmailTemplates = () => {
    const { showToast } = useToast();
    const { token } = useAuth();
    
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch template list on mount
    useEffect(() => {
        fetchTemplates();
    }, []);

    // Fetch details when selected key changes
    useEffect(() => {
        if (selectedKey) {
            fetchTemplateDetail(selectedKey);
        }
    }, [selectedKey]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await api.get('/email-templates', token);
            setTemplates(data);
            
            // Set initial selection if not already set
            if (data.length > 0 && !selectedKey) {
                setSelectedKey(data[0].template_key);
            }
        } catch (err) {
            showToast('Failed to load email templates', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplateDetail = async (key) => {
        try {
            const data = await api.get(`/email-templates/${key}`, token);
            setSelectedTemplate(data);
        } catch (err) {
            showToast('Failed to load template details', 'error');
        }
    };

    const handleSave = async (updatedData) => {
        try {
            const dataRes = await api.put(`/email-templates/${selectedKey}`, updatedData, token); 
            setSelectedTemplate(dataRes);
            showToast('Template updated successfully');
            
            // Refresh list to sync potential name/description changes
            const updatedList = await api.get('/email-templates', token);
            setTemplates(updatedList);
        } catch (err) {
            showToast(err.message || 'Failed to save template', 'error');
            throw err; // Re-throw to allow component-level handling (like disabling loading states)
        }
    };

    const handleRestore = async () => {
        if (!window.confirm('Are you sure you want to restore this template to its default state?')) return;
        try {
            const data = await api.post(`/email-templates/${selectedKey}/restore`, {}, token);
            setSelectedTemplate(data);
            showToast('Template restored to default');
        } catch (err) {
            showToast('Failed to restore template', 'error');
        }
    };

    const refreshTemplates = async () => {
        setIsRefreshing(true);
        await fetchTemplates();
        if (selectedKey) await fetchTemplateDetail(selectedKey);
        setIsRefreshing(false);
        showToast('Templates refreshed');
    };

    // Derive filtered templates based on active tab
    const filteredTemplates = useMemo(() => {
        if (activeTab === 'All') return templates;
        return templates.filter(t => t.category === activeTab);
    }, [templates, activeTab]);

    // Get unique categories for tabs
    const categories = useMemo(() => {
        const cats = ['All', ...new Set(templates.map(t => t.category))];
        return cats.filter(Boolean);
    }, [templates]);

    return {
        templates: filteredTemplates,
        allTemplates: templates,
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
    };
};
