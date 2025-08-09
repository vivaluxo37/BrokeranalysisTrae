import { getClientSideData } from '../../functions/getClientSideData';
import { AbTests } from '../../types/ClientSideDataType';

export function getAbTests(): AbTests {
    return getClientSideData().abTests;
}

export function getRunningAbTestVariantForAbTestName(arg: {
    abTestName: string;
}): string | undefined {
    return getAbTests()?.[arg.abTestName]?.runningVariantName;
}

export function isAbTestVariantRunning(arg: {
    abTestName: string;
    variantName: string;
}): boolean {
    return getRunningAbTestVariantForAbTestName(arg) === arg.variantName;
}
