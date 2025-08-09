import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { isServer } from '../../../../util/isServer';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { REGISTRATION_MODAL_SHOWN_LOCAL_STORAGE_ID } from '../../../consts/registrationModalLocalStorageId';
import {
    removeLocalStorageItem,
    setLocalStorageItem,
} from '../../../functions/localStorage';
import { runByConsent } from '../../../functions/runByConsent';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { useBCClientSideData } from '../../../hooks/useBCClientSideData';
import { ConsentLevel } from '../../../types/ConsentLevel';
import { MINIMIZED_MESSAGE_STORAGE_KEY } from '../../assistant/blocks/assistantMinimizedModal/consts/minimizedMessageLocalStorageKey';
import { NAV_BAR_MEASUREMENT_LIST_ID } from '../consts/events';

export const useUserHandling = () => {
    const numberOfUnreadNotifications = useGlobalStore(
        (state) => state.notifications.numberOfUnreadNotifications,
    );

    const { user } = useBCClientSideData();

    const [isLoading, setIsLoading] = useState(false);

    const sendEvent = useCallback((eventTitle: string) => {
        const event = getGeneralElementClickEventData({
            measurementListId: NAV_BAR_MEASUREMENT_LIST_ID,
            elementId: eventTitle,
        });

        sendGA4Event(event);
    }, []);

    const onLogout = useCallback(
        async (url: string) => {
            setIsLoading(true);
            axios({
                method: 'post',
                url,
            })
                .then(() => {
                    sendEvent('Log out');
                    runByConsent(
                        () =>
                            setLocalStorageItem({
                                key: REGISTRATION_MODAL_SHOWN_LOCAL_STORAGE_ID,
                                value: 'true',
                            }),
                        ConsentLevel.Necessary,
                    );

                    if (!isServer()) {
                        window.location.replace('/');
                    }

                    removeLocalStorageItem(MINIMIZED_MESSAGE_STORAGE_KEY);
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                });
        },
        [sendEvent],
    );

    const notificationsMenuItemLabel = useMemo(
        () =>
            numberOfUnreadNotifications > 0
                ? `${numberOfUnreadNotifications} unread notifications`
                : 'Notifications',
        [numberOfUnreadNotifications],
    );

    return {
        user,
        isLoading,
        onLogout,
        notificationsMenuItemLabel,
        numberOfUnreadNotifications,
        sendEvent,
    };
};
