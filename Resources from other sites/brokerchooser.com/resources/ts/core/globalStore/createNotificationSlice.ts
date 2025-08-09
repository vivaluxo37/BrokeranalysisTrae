import { StateCreator } from 'zustand';
import { GlobalState } from './types/GlobalState';
import { NotificationsSlice } from './types/NotificationsSlice';

export const createNotificationSlice: StateCreator<
    GlobalState,
    [['zustand/immer', never]],
    [],
    NotificationsSlice
> = (set) => ({
    numberOfUnreadNotifications: 0,
    setNumberOfUnreadNotifications: (value: number) => {
        set((state) => {
            state.notifications.numberOfUnreadNotifications = value;
        });
    },
});
