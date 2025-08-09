import { StateCreator } from 'zustand';
import { GlobalState } from './types/GlobalState';
import { RegistrationModalSlice } from './types/RegistrationModalSlice';

export const createRegistrationModalSlice: StateCreator<
    GlobalState,
    [['zustand/immer', never]],
    [],
    RegistrationModalSlice
> = (set) => ({
    registrationModalData: false,
    setRegistrationModalData: (value) =>
        set((state) => {
            state.registrationModal.registrationModalData = value;
        }),
});
