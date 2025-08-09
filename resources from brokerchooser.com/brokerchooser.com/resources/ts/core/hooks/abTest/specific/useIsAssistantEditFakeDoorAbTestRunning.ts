import { isAbTestVariantRunning } from '../getAbTests';

export const useIsAssistantEditFakeDoorAbTestRunning = () =>
    isAbTestVariantRunning({
        abTestName: 'purple-nuri-fake-door-test',
        variantName: 'edit-user-question',
    });
