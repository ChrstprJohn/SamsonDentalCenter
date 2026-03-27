import { useEffect } from 'react';
import { api } from '../../utils/api';
import StepIndicator from './StepIndicator';
import ServiceStep from './ServiceStep';
import DateTimeStep from './DateTimeStep';
import InfoStep from './InfoStep';
import ConfirmStep from './ConfirmStep';
import GuestBookingSuccess from './GuestBookingSuccess';

const GuestBookingWizard = ({ booking }) => {
    const {
        sessionId,
        step,
        currentStep,
        formData,
        submitting,
        error,
        result,
        slotHold,
        updateField,
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        submit,
        reset,
    } = booking;

    // ✅ Release hold on page exit (close browser, navigate away, refresh)
    useEffect(() => {
        const releaseHoldOnExit = async () => {
            const holdId = localStorage.getItem('activeSlotHold');
            if (holdId) {
                try {
                    const parsed = JSON.parse(holdId);
                    await api.post(
                        '/appointments/slots/release-hold',
                        {
                            hold_id: parsed.hold_id,
                        },
                        {
                            // Use keepalive to ensure request fires even if page is closing
                            keepalive: true,
                        },
                    );
                } catch (e) {
                    // Silently fail - hold will auto-expire anyway
                }
            }
        };

        // Fire immediately on page unload (close tab, navigate away, refresh)
        const handleBeforeUnload = () => {
            releaseHoldOnExit();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

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
                    sessionId={sessionId}
                    slotHold={slotHold}
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
