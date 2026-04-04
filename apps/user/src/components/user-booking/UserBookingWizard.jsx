import StepIndicator from '../guest-booking/StepIndicator';
import ServiceStep from '../guest-booking/ServiceStep';
import DateTimeStep from './DateTimeStep';
import UserOtherInfoStep from './UserOtherInfoStep';
import UserReviewStep from './UserReviewStep';
import UserConfirmStep from './UserConfirmStep';
import UserBookingSuccess from './UserBookingSuccess';

const STEP_LABELS = {
    service: 'Service',
    datetime: 'Date & Time',
    other_info: 'Patient Info',
    review: 'Review',
    confirm: 'Submit',
};

const UserBookingWizard = ({ booking }) => {
    const {
        sessionId,
        step,
        steps, // ✅ NEW: Use dynamic steps from hook
        currentStep,
        formData,
        error,
        submitting,
        result,
        book_for_others,
        setBookForOthersMode,
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        submit,
        joinWaitlist,
        reset,
        slotHold,
    } = booking;

    if (result && result.success) {
        return <UserBookingSuccess result={result} onReset={reset} />;
    }

    return (
        <div>
            {/* Step Indicator */}
            <StepIndicator
                currentStep={step}
                labels={['Service', 'Date & Time', 'Patient Info', 'Review', 'Submit']}
                onStepClick={goToStep}
            />

            {/* ✅ GLOBAL: Hold Expiring Soon Warning (Visible on any step except Service) */}
            {slotHold.activeHold && slotHold.isExpiringSoon && currentStep !== 'service' && (
                <div className='mx-auto max-w-2xl mb-6'>
                    <div className='bg-red-50 border-2 border-red-200 rounded-2xl p-4 animate-pulse flex items-center justify-between gap-4 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-red-100 p-2 rounded-full'>
                                <Lock size={20} className='text-red-600' />
                            </div>
                            <div>
                                <p className='text-sm font-bold text-red-900'>Reservation Expiring Soon!</p>
                                <p className='text-xs text-red-700'>
                                    Your slot ({slotHold.activeHold.time}) will be released in <strong>{slotHold.formattedTime}</strong>. 
                                    Please complete your booking quickly.
                                </p>
                            </div>
                        </div>
                        <div className='text-lg font-mono font-bold text-red-600 bg-white px-3 py-1 rounded-lg border border-red-100'>
                            {slotHold.formattedTime}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 1: Service Selection */}
            {currentStep === 'service' && (
                <div>

                    <ServiceStep
                        selectedServiceId={formData.service_id}
                        onSelect={(serviceId, serviceName, serviceTier) =>
                            updateFields({
                                service_id: serviceId,
                                service_name: serviceName,
                                service_tier: serviceTier,
                                date: '',
                                time: '',
                                waitlist_date: '',
                                waitlist_time: '',
                                dentist_id: '',
                            })
                        }
                        onNext={nextStep}
                    />
                </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 'datetime' && (
                <DateTimeStep
                    formData={formData}
                    serviceId={formData.service_id}
                    selectedDate={formData.date}
                    selectedTime={formData.time}
                    serviceName={formData.service_name}
                    serviceTier={formData.service_tier}
                    sessionId={sessionId}
                    slotHold={slotHold}
                    onUpdate={(fields) => updateFields(fields)}
                    onNext={nextStep}
                    onBack={prevStep}
                    joinWaitlist={joinWaitlist}
                />
            )}

            {/* Step 3: Patient Information (Always show) */}
            {currentStep === 'other_info' && (
                <UserOtherInfoStep
                    formData={formData}
                    book_for_others={book_for_others}
                    onUpdate={(fields) => updateFields(fields)}
                    setBookForOthersMode={setBookForOthersMode}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}

            {/* Step 3/4: Review Details - Read Only */}
            {currentStep === 'review' && (
                <UserReviewStep
                    formData={formData}
                    book_for_others={book_for_others}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}

            {/* Step 4/5: Confirm (Final confirmation before submission) */}
            {currentStep === 'confirm' && (
                <UserConfirmStep
                    formData={formData}
                    book_for_others={book_for_others}
                    onSubmit={submit}
                    onBack={prevStep}
                    submitting={submitting}
                    error={error}
                    slotHold={slotHold}
                />
            )}
        </div>
    );
};

export default UserBookingWizard;
