import { FMB_BROKER_HIGHLIGHT } from '../consts/brokerHighlightsEnum';
import { BrokerHighlight } from '../types/commonTypes';

export const getFmbHighlightForBroker = (highlights?: BrokerHighlight[]) =>
    highlights?.find(
        (highlight: BrokerHighlight) => highlight.type === FMB_BROKER_HIGHLIGHT,
    );
