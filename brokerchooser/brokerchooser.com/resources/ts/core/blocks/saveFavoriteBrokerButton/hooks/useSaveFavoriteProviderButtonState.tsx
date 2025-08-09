import { useCallback, useState } from 'react';
import { updateFavoriteProvider } from '../../../api/updateFavoriteProvider';
import { Broker } from '../../../types/commonTypes';

export const useSaveFavoriteProviderButtonState = (
    initialSavedProviderIds: number[],
): {
    savedProviderIds: Broker['id'][];
    saveProvider: (
        providerId: number,
        isProviderSaved: boolean,
    ) => Promise<void>;
} => {
    const [savedProviderIds, setSavedProviderIds] = useState(
        initialSavedProviderIds || [],
    );
    const saveProvider = useCallback(
        async (providerId: number, isProviderSaved: boolean) => {
            const response = await updateFavoriteProvider({
                providerId,
                isProviderSaved,
            });
            setSavedProviderIds(response);
        },
        [],
    );

    return {
        savedProviderIds,
        saveProvider,
    };
};
