import StepIndicator from '../guest-booking/StepIndicator';
import ServiceStep from '../guest-booking/ServiceStep';
import DateTimeStep from '../guest-booking/DateTimeStep';
import UserOtherInfoStep from './UserOtherInfoStep';
import UserReviewStep from './UserReviewStep';
import UserConfirmStep from './UserConfirmStep';
import UserBookingSuccess from './UserBookingSuccess';

const UserBookingWizard = ({ booking }) => {
    const {
        step,
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
    } = booking;

    if (result) {
        return (
            <UserBookingSuccess
                result={result}
                onReset={reset}
            />
        );
    }

    return (
        <div>
            {/* Step Indicator */}
            <StepIndicator
                currentStep={step}
                onStepClick={goToStep}
            />

            {/* Step 1: Service Selection */}
            {currentStep === 'service' && (
                <div>
                    {/* Book For Others Toggle */}
                    <div className='mb-6 p-4 bg-slate-50 rounded-xl'>
                        <label className='flex items-center gap-3 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={book_for_others}
                                onChange={(e) => setBookForOthersMode(e.target.checked)}
                                className='w-4 h-4 rounded accent-amber-500'
                            />
                            <span className='text-sm font-medium text-slate-700'>
                                Book appointment for someone else
                            </span>
                        </label>
                    </div>

                    <ServiceStep
                        selectedServiceId={formData.service_id}
                        onSelect={(serviceId, serviceName) =>
                            updateFields({ service_id: serviceId, service_name: serviceName })
                        }
                        onNext={nextStep}
                    />
                </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 'datetime' && (
                <DateTimeStep
                    serviceId={formData.service_id}
                    selectedDate={formData.date}
                    selectedTime={formData.time}
                    serviceName={formData.service_name}
                    onUpdate={(fields) => updateFields(fields)}
                    onNext={nextStep}
                    onBack={prevStep}
                    joinWaitlist={joinWaitlist}
                />
            )}

            {/* Step 3: Other Info (Appointee Name) - Only if booking for others */}
            {currentStep === 'other_info' && (
                <UserOtherInfoStep
                    formData={formData}
                    onUpdate={(fields) => updateFields(fields)}
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
                />
            )}
        </div>
    );
};

export default UserBookingWizard;
