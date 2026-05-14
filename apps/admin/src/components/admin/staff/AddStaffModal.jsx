import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle2, UserCheck, ArrowRight, Loader2, Shield } from 'lucide-react';
import { api } from '../../../utils/api';

const AddStaffModal = ({ isOpen, onClose, onStaffAdded, token }) => {
    const [step, setStep] = useState('form'); // 'form' | 'success'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        role: 'secretary',
    });
    const [error, setError] = useState(null);
    const [createdStaff, setCreatedStaff] = useState(null);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleCreateStaff = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.full_name || !formData.email || !formData.role) {
                throw new Error('Name, Email, and Role are required.');
            }

            const response = await api.post('/admin/users', formData, token);
            setCreatedStaff(response.user);
            setStep('success');
            if (onStaffAdded) onStaffAdded(response.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep('form');
        setFormData({
            full_name: '',
            email: '',
            phone: '',
            role: 'secretary',
        });
        setError(null);
        setCreatedStaff(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Onboard Staff Member</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Add a new system user to the clinic</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {step === 'form' && (
                        <form onSubmit={handleCreateStaff} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 capitalize ml-1">Full Name</label>
                                <input 
                                    required
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Maria Clara"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 capitalize ml-1">Email Address</label>
                                <input 
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="staff@primeradental.com"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 capitalize ml-1">Phone Number</label>
                                <input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+63 9XX XXX XXXX"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 capitalize ml-1">System Role</label>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all appearance-none cursor-pointer"
                                >
                                    <option value="secretary">Secretary</option>
                                    <option value="receptionist">Receptionist</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
                                    <span>Create System Account</span>
                                </button>
                                <p className="text-[12px] text-gray-400 text-center mt-3 italic">
                                    * An invitation email will be sent to the staff member to set up their password.
                                </p>
                            </div>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-500 mb-6 scale-110">
                                <CheckCircle2 size={40} />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Staff Registered!</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-8">
                                <span className="font-bold text-gray-900 dark:text-white">{createdStaff?.full_name}</span> has been added as a <span className="font-bold">{createdStaff?.role}</span>. An invitation email is on its way.
                            </p>
                            
                            <div className="w-full space-y-3">
                                <button 
                                    onClick={resetAndClose}
                                    className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <UserCheck size={20} />
                                    <span>Continue</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddStaffModal;
