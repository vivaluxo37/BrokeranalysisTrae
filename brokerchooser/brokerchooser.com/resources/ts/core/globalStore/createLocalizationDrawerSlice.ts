import { StateCreator } from 'zustand';
import { GlobalState } from './types/GlobalState';
import { LocalizationDrawerSlice } from './types/LocalizationDrawerSlice';

export const createLocalizationDrawerSlice: StateCreator<
    GlobalState,
    [['zustand/immer', never]],
    [],
    LocalizationDrawerSlice
> = (set) => ({
    isLocalizationDrawerOpen: false,
    setIsLocalizationDrawerOpen: (value: boolean) =>
        set((state) => {
            state.localizationDrawer.isLocalizationDrawerOpen = value;
        }),
});
