import { isEqual } from 'lodash-es';
import { ImpressionEvent } from '../eventTypes';
import { sendGA4Event } from './sendGA4Event';

const sentEventList: ImpressionEvent[] = [];

const isEventSent = (event: ImpressionEvent): boolean =>
    sentEventList.some((e: ImpressionEvent) => isEqual(e, event));

const addEventToSentEventList = (event: ImpressionEvent) =>
    sentEventList.push(event);

export const trySendImpressionEvent = (ga4Event: ImpressionEvent) => {
    if (isEventSent(ga4Event)) {
        return;
    }

    sendGA4Event(ga4Event);

    addEventToSentEventList(ga4Event);
};
