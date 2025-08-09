import { pickBy } from 'lodash-es';
import { ConsentLevel } from '../types/ConsentLevel';
import { IubendaPreference } from '../types/IubendaPreference';

export const extractAcceptedIubendaConsentLevels = (
    iubendaPreference: IubendaPreference,
): ConsentLevel[] => {
    const acceptedConsentLevels = pickBy(iubendaPreference.purposes);

    return Object.keys(acceptedConsentLevels) as ConsentLevel[];
};
