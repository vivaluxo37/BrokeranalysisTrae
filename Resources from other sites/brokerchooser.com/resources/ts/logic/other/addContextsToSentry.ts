import * as Sentry from '@sentry/react';
import { getClientSideData } from '../../core/functions/getClientSideData';

export const addContextToSentry = () => {
    const { user, session } = getClientSideData();

    if (user) {
        Sentry.setUser(user);
    }

    Sentry.setContext('session', session);
};
