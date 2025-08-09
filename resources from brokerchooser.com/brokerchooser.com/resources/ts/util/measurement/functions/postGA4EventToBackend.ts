import * as Sentry from '@sentry/react';
import { createRelativeUrl } from '../../../category-page/util/createRelativeUrl';
import { Event } from '../eventTypes';

export const postGA4EventToBackend = (event: Event): void => {
    if (event.eventName === 'impression') {
        // there are too many impression events to store it in the DB, but they are available in Google Analytics
        return;
    }
    let url = createRelativeUrl('api/event');

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    if (csrfToken) {
        url += `?_token=${csrfToken}`;
    }

    const body = {
        ...event,
        url: window.location.origin + window.location.pathname,
        queryString: new URLSearchParams(window.location.search).toString(),
        referer: document.referrer,
    };

    if (typeof window.navigator.sendBeacon === 'function') {
        const success = window.navigator.sendBeacon(url, JSON.stringify(body));

        if (!success) {
            const sentryHints = {
                extra: {
                    consoleOutputs: JSON.stringify(window.consoleOutputs),
                    request: {
                        url,
                        body,
                    },
                },
            };

            Sentry.captureException('Failed to send events', sentryHints);
        }
    } else {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            keepalive: true,
        }).catch((e) => {
            Sentry.captureException(e);
        });
    }
};
