import { isAbTestVariantRunning } from '../getAbTests';

export const useIsAssistantCopyFakeDoorAbTestRunning = () =>
    isAbTestVariantRunning({
        abTestName: 'purple-nuri-fake-door-test',
        variantName: 'copy-response',
    });
