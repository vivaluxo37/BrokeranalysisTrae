import { omit } from 'lodash-es';
import { getClientSideData } from '../../../core/functions/getClientSideData';
import { isServer } from '../../isServer';
import { Event } from '../eventTypes';
import { postGA4EventToBackend } from './postGA4EventToBackend';

export const sendGA4Event = (event: Event) => {
    if (isServer()) {
        return;
    }

    const { measurementPageCategory } = getClientSideData();

    postGA4EventToBackend(event);

    const eventData = {
        ...omit(event, ['eventName']),
        measurementCategoryId: measurementPageCategory,
    };

    if (window.debugGA) {
        console.debug({
            ...event,
            measurementCategoryId: measurementPageCategory,
        });
    }

    // @ts-ignore
    window.gtag('event', event.eventName, eventData);
};
