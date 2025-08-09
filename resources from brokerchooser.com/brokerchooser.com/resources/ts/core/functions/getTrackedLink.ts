import { EventIdentifierArgs } from '../../util/measurement/eventTypes';

export const getTrackedLink = (
    href: string,
    eventData: EventIdentifierArgs,
) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const separator = href.includes('?') ? '&' : '?';

    if (urlSearchParams.get('measurementListId')) {
        return href + separator + urlSearchParams.toString();
    }

    urlSearchParams.set('measurementListId', eventData.measurementListId);
    urlSearchParams.set('url', window.location.pathname);

    if (eventData.elementId) {
        urlSearchParams.set('elementId', eventData.elementId);
    }
    if (eventData.context) {
        urlSearchParams.set('context', eventData.context);
    }
    if (eventData.positionIndex) {
        urlSearchParams.set('positionIndex', `${eventData.positionIndex}`);
    }

    return href + separator + urlSearchParams.toString();
};
