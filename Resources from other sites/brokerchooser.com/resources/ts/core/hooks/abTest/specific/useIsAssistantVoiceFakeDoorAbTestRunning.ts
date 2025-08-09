import { isAbTestVariantRunning } from '../getAbTests';

export const useIsAssistantVoiceFakeDoorAbTestRunning = () =>
    isAbTestVariantRunning({
        abTestName: 'purple-nuri-fake-door-test',
        variantName: 'voice-conversation',
    });
