import { VisitBrokerButtonClickArgs } from '../types/VisitBrokerButtonClickArgs';
import { saveBrokerAnalytics } from './saveBrokerAnalytics';
import { tryOpenVisitBrokerModal } from './tryOpenVisitBrokerModal';

type Event = {
    preventDefault(): void;
    type: string;
};

export function onVisitBrokerButtonClick(
    event: Event,
    args: VisitBrokerButtonClickArgs,
): boolean {
    const { initiatedModalOpen } = tryOpenVisitBrokerModal(args);

    if (initiatedModalOpen) {
        event.preventDefault();
    }

    if (!initiatedModalOpen) {
        saveBrokerAnalytics(args, event);
    }

    return !initiatedModalOpen;
}
