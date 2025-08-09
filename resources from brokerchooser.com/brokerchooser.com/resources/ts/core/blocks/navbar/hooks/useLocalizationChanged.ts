import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
    getLocalStorageItem,
    removeLocalStorageItem,
} from '../../../functions/localStorage';
import {
    SHOW_NOTIFICATION_CHANGED_NOTI_KEY,
    SHOW_NOTIFICATION_CHANGED_NOTI_VALUE,
} from '../consts/notifications';

export const useLocalizationChanged = () => {
    const { t } = useTranslation();
    useEffect(() => {
        const showNotification =
            getLocalStorageItem(SHOW_NOTIFICATION_CHANGED_NOTI_KEY) ===
            SHOW_NOTIFICATION_CHANGED_NOTI_VALUE;

        const message = t(
            "Country updated! You'll now see brokers and recommendations tailored to your location.",
        ) as string;

        if (showNotification) {
            toast(message);
            removeLocalStorageItem(SHOW_NOTIFICATION_CHANGED_NOTI_KEY);
        }
    }, [t]);
};
