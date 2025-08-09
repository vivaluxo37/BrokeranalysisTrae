import { Resource } from 'i18next';
import { FC, PropsWithChildren } from 'react';

import { useSSR } from 'react-i18next';
import i18n from '../core/functions/i18n';
import { isServer } from '../util/isServer';

export const TranslationProvider: FC<
    PropsWithChildren<{
        initialTranslation: Resource;
        initialLanguageCode: string;
    }>
> = ({ initialTranslation, initialLanguageCode, children }) => {
    // Has to reset i18n sources on server when language was changed
    if (isServer() && i18n.language !== initialLanguageCode) {
        i18n.initializedLanguageOnce = false;
        i18n.initializedStoreOnce = false;
    }
    useSSR(initialTranslation, initialLanguageCode);

    return children;
};
