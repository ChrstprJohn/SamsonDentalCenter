import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { useDependents } from '../../hooks/useDependents';
import DependentCard from '../../components/patient/dependents/DependentCard';
import DependentSkeleton from '../../components/patient/dependents/DependentSkeleton';
import AddDependentModal from '../../components/patient/dependents/AddDependentModal';
import { Plus, Search, Users, ShieldAlert, Info } from 'lucide-react';
import ErrorState from '../../components/common/ErrorState';
import { CLINIC_CONFIG } from '../../utils/constants';

const DependentsPage = () => {
    const { 
        dependents, 
        loading, 
        error, 
        addDependent, 
        updateDependent, 
        refresh
    } = useDependents();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDependent, setEditingDependent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const maxDependents = CLINIC_CONFIG.MAX_DEPENDENTS_PER_USER;
    const currentCount = dependents.length;
    const isLimitReached = currentCount >= maxDependents;

    const filteredDependents = dependents.filter(p => 
        p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.relationship?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddClick = () => {
        if (isLimitReached) return;
        setEditingDependent(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (dependent) => {
        setEditingDependent(dependent);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        if (editingDependent) {
            await updateDependent(editingDependent.id, formData);
        } else {
            await addDependent(formData);
        }
    };

    return (
        <>
            <PageBreadcrumb pageTitle='Dependents' />
            
            <div className="flex flex-col grow">
                <div className="sm:hidden px-4 mt-2">
                    <h1 className="text-sm font-black text-gray-700 dark:text-white uppercase tracking-tight mb-4">
                        Dependents
                    </h1>
                </div>

                <div className="sm:mx-0 mx-4 space-y-6 pb-20 sm:pb-10">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search dependents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-brand-500 shadow-sm text-sm transition-all dark:text-white"
                            />
                            <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Quota Indicator */}
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                                isLimitReached 
                                    ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400' 
                                    : 'bg-brand-50/50 border-brand-100/50 text-brand-600 dark:bg-brand-900/10 dark:border-brand-900/20'
                            }`}>
                                <span className="uppercase tracking-wider">Family Quota:</span>
                                <span className={isLimitReached ? 'text-rose-700 dark:text-rose-400' : 'text-brand-700 dark:text-brand-400'}>
                                    {currentCount} / {maxDependents}
                                </span>
                            </div>

                            <button
                                onClick={handleAddClick}
                                disabled={isLimitReached}
                                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-black rounded-2xl transition-all shadow-lg active:scale-95 ${
                                    isLimitReached
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                        : 'bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/20'
                                }`}
                                title={isLimitReached ? `You have reached the limit of ${maxDependents} dependents.` : ''}
                            >
                                <Plus size={18} strokeWidth={3} />
                                <span>Add New Dependent</span>
                            </button>
                        </div>
                    </div>

                    {isLimitReached && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                            <ShieldAlert className="text-amber-600 dark:text-amber-500 shrink-0" size={18} />
                            <div className="space-y-1">
                                <p className="text-[13px] font-bold text-amber-800 dark:text-amber-400 leading-none">
                                    Family Member Limit Reached
                                </p>
                                <p className="text-xs text-amber-600 dark:text-amber-500/70 font-medium">
                                    You have reached the maximum allowance of {maxDependents} dependents per account. Please contact the clinic if you need to manage more family members.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <DependentSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <ErrorState 
                            error={error} 
                            onRetry={refresh} 
                            title="Unable to load dependents"
                        />
                    ) : filteredDependents.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                <Users size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                                {searchQuery ? 'No results found' : 'No dependents added yet'}
                            </h3>
                            <p className="text-[13px] sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 font-medium">
                                {searchQuery 
                                    ? `We couldn't find any dependents matching "${searchQuery}".` 
                                    : 'Add family members or dependents to your account for faster booking and shared medical history.'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={handleAddClick}
                                    className="px-8 py-3 bg-brand-500 text-white text-sm font-black rounded-2xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20"
                                >
                                    Add your first dependent
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDependents.map(dependent => (
                                <DependentCard 
                                    key={dependent.id} 
                                    dependent={dependent} 
                                    onEdit={handleEditClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AddDependentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                dependent={editingDependent}
            />
        </>
    );
};

export default DependentsPage;
