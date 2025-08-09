import { create, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createAssistantSlice } from './createAssistantSlice';
import { createBrokerOfTheMonthSlice } from './createBrokerOfTheMonthSlice';
import { createChaptersSlice } from './createChapterSlice';
import { createGeoAlternativeModalsBrokerIdSlice } from './createGeoAlternativeModalsBrokerIdSlice';
import { createLocalizationDrawerSlice } from './createLocalizationDrawerSlice';
import { createNotificationSlice } from './createNotificationSlice';
import { createRegistrationModalSlice } from './createRegistrationModalSlice';
import { GlobalState } from './types/GlobalState';

export const globalStore = create<GlobalState>()(
    immer((set, get, store) => ({
        assistant: createAssistantSlice(set, get, store),
        chapters: createChaptersSlice(set, get, store),
        notifications: createNotificationSlice(set, get, store),
        localizationDrawer: createLocalizationDrawerSlice(set, get, store),
        geoAlternativeModal: createGeoAlternativeModalsBrokerIdSlice(
            set,
            get,
            store,
        ),
        registrationModal: createRegistrationModalSlice(set, get, store),
        brokerOfTheMonth: createBrokerOfTheMonthSlice(set, get, store),
    })),
);

export const useGlobalStore = <T>(selector: (state: GlobalState) => T) =>
    useStore(globalStore, selector);
