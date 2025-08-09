import { createContext } from 'react';
import { Broker } from '../../../types/commonTypes';

export const SaveFavoriteProviderButtonContext = createContext<{
    savedProviderIds: Broker['id'][];
    saveProvider: (
        providerId: number,
        isProviderSaved: boolean,
    ) => Promise<void>;
}>({
    savedProviderIds: [],
    saveProvider: async () => undefined,
});
