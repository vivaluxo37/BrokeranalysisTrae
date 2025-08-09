import { reportError } from '../../../../logic/util/error/reportError';
import { arrayOfAll } from '../../../functions/arrayOfAll';
import { checkBasicBrokerDataKeys } from '../../../functions/checkBasicBrokerDataKeys';
import { getAbTests } from '../../../hooks/abTest/getAbTests';
import { NonOptionalKeys } from '../../../types/meta';
import { CtaData } from '../types/visitBrokerContextTypes';

export function reportIfCtaDataIsInvalid(data: CtaData) {
    const requiredKeys = arrayOfAll<NonOptionalKeys<CtaData>>()(
        'broker',
        'measurementCategoryId',
        'measurementListId',
    );
    const missingDataKeys = requiredKeys.filter(
        (key) => typeof data[key] === 'undefined',
    );
    if (missingDataKeys.length > 0) {
        reportError(`CtaData has missing keys: [${missingDataKeys.join()}]`);
    }

    const { missingKeys: missingBrokerKeys } = checkBasicBrokerDataKeys(
        data.broker,
    );
    if (missingBrokerKeys.length > 0) {
        reportError(`Broker has missing keys: [${missingBrokerKeys.join()}]`, {
            abTests: getAbTests(),
            broker: data.broker,
            measurementListId: data.measurementListId,
        });
    }
}
