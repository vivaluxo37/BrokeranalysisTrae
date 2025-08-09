import { getBrokersAvailableInCountry } from '../../../functions/getBrokersAvailableInCountry';

export function isBrokerAvailableInCountry(brokerId: number) {
    return getBrokersAvailableInCountry().includes(brokerId);
}
