import { StateCreator } from 'zustand';
import { GeoAlternativeModalSlice } from './types/GeoAlternativeModalsBrokerIdSlice';
import { GlobalState } from './types/GlobalState';

export const createGeoAlternativeModalsBrokerIdSlice: StateCreator<
    GlobalState,
    [['zustand/immer', never]],
    [],
    GeoAlternativeModalSlice
> = (set) => ({
    brokerId: undefined,
    setBrokerId: (brokerId?: number) => {
        set((state) => {
            state.geoAlternativeModal.brokerId = brokerId;
        });
    },
});
