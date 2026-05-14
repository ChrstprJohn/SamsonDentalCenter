import React from 'react';
import { User, Calendar, ChevronRight, Mars, Venus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const InputGroup = ({ label, icon: Icon, error, children }) => (
    <div className='space-y-1.5 group text-left'>
        <label
            className={cn(
                'block text-[11px] font-bold uppercase tracking-[0.05em] transition-colors',
                error ? 'text-red-500' : 'text-slate-500 group-focus-within:text-red-600',
            )}
        >
            {label}
        </label>
        <div className='relative'>
            <div
                className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300',
                    error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-red-600',
                )}
            >
                <Icon size={18} strokeWidth={2.5} />
            </div>
            {children}
        </div>
        {error && (
            <p className='text-red-500 text-xs font-medium text-right animate-in slide-in-from-top-1'>
                {error}
            </p>
        )}
    </div>
);

const inputClassName = (error, value) =>
    cn(
        'w-full rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all duration-300',
        error
            ? 'bg-red-50/30 border border-red-300 text-red-900 placeholder:text-red-300 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/15 hover:border-slate-300',
        value && !error && 'bg-white border-green-500/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/15',
    );

const StepPersonalDetails = ({ data, errors, updateField, onNext }) => {
    return (
        <div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
            <div className='text-center mb-6'>
                <h3 className='text-xl font-black text-slate-900'>Personal Details</h3>
                <p className='text-slate-500 text-xs'>Let's start with your identity</p>
            </div>

            <div className='space-y-4'>
                <InputGroup label='First Name' icon={User} error={errors.firstName}>
                    <input
                        type='text'
                        value={data.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className={inputClassName(errors.firstName, data.firstName)}
                        placeholder='Enter your first name'
                    />
                </InputGroup>

                <div className='grid grid-cols-2 gap-4'>
                    <InputGroup label='Middle Name' icon={User} error={errors.middleName}>
                        <input
                            type='text'
                            value={data.middleName}
                            onChange={(e) => updateField('middleName', e.target.value)}
                            className={inputClassName(errors.middleName, data.middleName)}
                            placeholder='(Optional)'
                        />
                    </InputGroup>
                    <InputGroup label='Last Name' icon={User} error={errors.lastName}>
                        <input
                            type='text'
                            value={data.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            className={inputClassName(errors.lastName, data.lastName)}
                            placeholder='Last name'
                        />
                    </InputGroup>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <InputGroup label='Suffix' icon={User} error={errors.suffix}>
                        <select
                            value={data.suffix}
                            onChange={(e) => updateField('suffix', e.target.value)}
                            className={cn(inputClassName(errors.suffix, data.suffix), 'appearance-none cursor-pointer')}
                        >
                            <option value=''>None</option>
                            <option value='Jr.'>Jr.</option>
                            <option value='Sr.'>Sr.</option>
                            <option value='II'>II</option>
                            <option value='III'>III</option>
                            <option value='IV'>IV</option>
                        </select>
                        <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
                            <ChevronRight className='rotate-90' size={16} />
                        </div>
                    </InputGroup>

                    <InputGroup label='Sex' icon={data.sex === 'Female' ? Venus : Mars} error={errors.sex}>
                        <select
                            value={data.sex}
                            onChange={(e) => updateField('sex', e.target.value)}
                            className={cn(inputClassName(errors.sex, data.sex), 'appearance-none cursor-pointer')}
                        >
                            <option value=''>Select Sex</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                        </select>
                        <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
                            <ChevronRight className='rotate-90' size={16} />
                        </div>
                    </InputGroup>
                </div>

                <InputGroup label='Birthday' icon={Calendar} error={errors.dob}>
                    <input
                        type='date'
                        value={data.dob}
                        onChange={(e) => updateField('dob', e.target.value)}
                        className={inputClassName(errors.dob, data.dob)}
                    />
                </InputGroup>
            </div>

            <Button
                onClick={onNext}
                className='w-full !bg-red-600 hover:!bg-red-700 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-red-600/25 border-0 font-bold rounded-xl py-3.5 mt-4'
            >
                Next: Contact Info
                <ChevronRight className='ml-2 h-4 w-4' strokeWidth={3} />
            </Button>
        </div>
    );
};

export default StepPersonalDetails;
