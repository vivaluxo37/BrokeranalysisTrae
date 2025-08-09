import { getClientSideData } from './getClientSideData';

export function getBrokersAvailableInCountry(): number[] {
    const brokerIds = getClientSideData().brokersAvailableInCountry;

    if (typeof brokerIds === 'undefined') {
        console.error('No broker ids found in clientSideData');
    }

    return brokerIds || [];
}
