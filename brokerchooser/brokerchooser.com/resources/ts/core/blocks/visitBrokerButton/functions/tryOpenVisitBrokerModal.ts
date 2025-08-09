import { globalStore } from '../../../globalStore/globalStore';
import { VisitBrokerButtonClickArgs } from '../types/VisitBrokerButtonClickArgs';
import { isBrokerAvailableInCountry } from './isBrokerAvailableInCountry';

type Result = {
    initiatedModalOpen: boolean;
};

export function tryOpenVisitBrokerModal(
    args: VisitBrokerButtonClickArgs,
): Result {
    const { geoAlternativeModal } = globalStore.getState();
    const shouldShowAlternativeModal = !isBrokerAvailableInCountry(
        args.brokerId,
    );

    if (shouldShowAlternativeModal) {
        geoAlternativeModal.setBrokerId(args.brokerId);

        return {
            initiatedModalOpen: true,
        };
    }

    return {
        initiatedModalOpen: false,
    };
}
