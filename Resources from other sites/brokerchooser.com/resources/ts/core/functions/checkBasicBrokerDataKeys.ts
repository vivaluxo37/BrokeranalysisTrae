import { BasicBrokerData } from '../types/commonTypes';
import { NonOptionalKeys } from '../types/meta';
import { arrayOfAll } from './arrayOfAll';

export function checkBasicBrokerDataKeys(data: BasicBrokerData): {
    missingKeys: Array<keyof BasicBrokerData>;
} {
    const requiredKeys = arrayOfAll<NonOptionalKeys<BasicBrokerData>>()(
        'id',
        'name',
        'logoPath',
        'slug',
        'visitBrokerUrl',
        'isReportedToAffiliatePartner',
        'brokerReviewUrl',
    );

    const missingKeys = requiredKeys.filter(
        (key) => typeof data[key] === 'undefined',
    );

    return {
        missingKeys,
    };
}
