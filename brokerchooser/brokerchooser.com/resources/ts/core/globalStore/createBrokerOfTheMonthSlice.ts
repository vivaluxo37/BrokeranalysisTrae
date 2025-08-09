import { StateCreator } from 'zustand';
import { closeBrokerOfTheMonthPromoBar } from '../../logic/brokerOfTheMonthPromoBar/closeBrokerOfTheMonthPromoBar';
import { BrokerOfTheMonthSlice } from './types/BrokerOfTheMonthSlice';
import { GlobalState } from './types/GlobalState';

export const createBrokerOfTheMonthSlice: StateCreator<
    GlobalState,
    [['zustand/immer', never]],
    [],
    BrokerOfTheMonthSlice
> = (set) => ({
    showBrokerOfTheMonthPromoBar: true,
    setShowBrokerOfTheMonthPromoBar: ({ show, withUserClick = false }) => {
        set((state) => {
            state.brokerOfTheMonth.showBrokerOfTheMonthPromoBar = show;
        });

        if (!show && withUserClick) {
            closeBrokerOfTheMonthPromoBar();
        }
    },
});
