import { ConsentLevel } from '../types/ConsentLevel';
import { getConsentLevels } from './loadJSByConsent';

export function runByConsent(
    callback: () => any,
    consentLevel: ConsentLevel,
    defaultValue: any = undefined,
) {
    const consentLevels = getConsentLevels();

    if (
        consentLevel === ConsentLevel.NotNeeded ||
        consentLevel === ConsentLevel.Necessary ||
        consentLevels.includes(consentLevel)
    ) {
        return callback();
    }
    return defaultValue;
}
