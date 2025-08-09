import React, { ReactNode } from 'react';
import { useBCClientSideData } from '../../../hooks/useBCClientSideData';
import { SaveFavoriteProviderButtonContext } from '../contexts/SaveFavoriteProviderButtonContext';
import { useSaveFavoriteProviderButtonState } from '../hooks/useSaveFavoriteProviderButtonState';

export const SaveToWatchlistContextWrapper: React.FunctionComponent<{
    children: ReactNode;
}> = ({ children }) => {
    const { savedProviderIds } = useBCClientSideData();

    const saveFavoriteProviderButtonContext =
        useSaveFavoriteProviderButtonState(savedProviderIds);

    return (
        <SaveFavoriteProviderButtonContext.Provider
            value={saveFavoriteProviderButtonContext}
        >
            {children}
        </SaveFavoriteProviderButtonContext.Provider>
    );
};
