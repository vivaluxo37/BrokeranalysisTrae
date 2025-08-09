import { reportError } from '../../../../logic/util/error/reportError';
import { VisitBrokerButtonClickArgs } from '../types/VisitBrokerButtonClickArgs';
import { getDomPath } from './getDomPath';

/*
 * Extracts VisitBrokerButtonClickArgs from a legacy visit broker button
 * Properties are encoded in data attributes and href, etc.
 * When changing this implementation, also change:
 * - resources/views/common/open_account_link.blade.php
 */
export function tryExtractAttributesFromOldVisitBrokerButton(
    element: HTMLElement,
): VisitBrokerButtonClickArgs | undefined {
    const { dataset } = element;

    const brokerIdRaw = element.dataset && element.dataset.brokerId;
    const brokerId =
        brokerIdRaw !== undefined
            ? Number.parseInt(brokerIdRaw, 10)
            : undefined;

    if (typeof brokerId === 'undefined') {
        reportError('No brokerId found on element', {
            domPath: getDomPath(element),
        });
        return undefined;
    }

    const brokerName = dataset.brokerLabel;
    if (typeof brokerName === 'undefined') {
        reportError('No broker name found on element', {
            domPath: getDomPath(element),
        });
    }

    const brokerLink = element.getAttribute('href');
    if (typeof brokerLink === 'undefined') {
        reportError('No broker link found on element', {
            domPath: getDomPath(element),
        });
    }

    const { isReportedToAffiliatePartner } = dataset;
    if (typeof isReportedToAffiliatePartner === 'undefined') {
        reportError('No isReportedToAffiliatePartner value found on element', {
            domPath: getDomPath(element),
        });
    }

    const { measurementList } = dataset;
    if (typeof measurementList === 'undefined') {
        reportError('No measurement list found on element', {
            domPath: getDomPath(element),
        });
    }

    return {
        brokerId,
        brokerName: brokerName || '',
        brokerLink: brokerLink || '',
        isReportedToAffiliatePartner: isReportedToAffiliatePartner !== 'false', // if value is missing, assume we report it
        measurementList: measurementList || '',
    };
}
