import StepIndicator from './StepIndicator';
import ServiceStep from './ServiceStep';
import DateTimeStep from './DateTimeStep';
import InfoStep from './InfoStep';
import ConfirmStep from './ConfirmStep';
import GuestBookingSuccess from './GuestBookingSuccess';

const GuestBookingWizard = ({ booking }) => {
    const {
        step,
        currentStep,
        formData,
        submitting,
        error,
        result,
        updateField,
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        submit,
        reset,
    } = booking;

    // If booking succeeded, show success screen
    if (result) {
        return (
            <GuestBookingSuccess
                result={result}
                onReset={reset}
            />
        );
    }

    return (
        <div>
            <StepIndicator
                currentStep={step}
                onStepClick={goToStep}
            />

            {currentStep === 'service' && (
                <ServiceStep
                    selectedServiceId={formData.service_id}
                    onSelect={(id, name) => updateFields({ service_id: id, service_name: name })}
                    onUpdateFields={updateFields}
                    onNext={nextStep}
                />
            )}

            {currentStep === 'datetime' && (
                <DateTimeStep
                    serviceId={formData.service_id}
                    selectedDate={formData.date}
                    selectedTime={formData.time}
                    serviceName={formData.service_name}
                    onUpdate={(fields) => updateFields(fields)}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}

            {currentStep === 'info' && (
                <InfoStep
                    formData={formData}
                    onUpdate={(field, value) => updateField(field, value)}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}

            {currentStep === 'review' && (
                <ConfirmStep
                    formData={formData}
                    onSubmit={submit}
                    onBack={prevStep}
                    submitting={submitting}
                    error={error}
                />
            )}
        </div>
    );
};

export default GuestBookingWizard;
