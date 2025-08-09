import { isServer } from '../../util/isServer';
import { getClientSideData } from '../functions/getClientSideData';
import { globalStore } from './globalStore';

export const initGlobalStore = () => {
    const { numberOfUnreadNotifications, showBrokerOfTheMonthPromoBar } =
        getClientSideData();

    const { notifications, brokerOfTheMonth } = globalStore.getState();

    notifications.setNumberOfUnreadNotifications(numberOfUnreadNotifications);
    brokerOfTheMonth.setShowBrokerOfTheMonthPromoBar({
        show: showBrokerOfTheMonthPromoBar,
    });
};

export const initGlobalStoreSSR = () => {
    if (!isServer()) {
        return;
    }

    const { showBrokerOfTheMonthPromoBar } = getClientSideData();

    const { brokerOfTheMonth } = globalStore.getState();

    brokerOfTheMonth.setShowBrokerOfTheMonthPromoBar({
        show: showBrokerOfTheMonthPromoBar,
    });
};
