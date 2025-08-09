import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

import type en from '../../../../lang/en.json';

export const resources: {
    en: {
        translation: typeof en;
    };
} = {
    en: {
        translation: {} as typeof en,
    },
};

if (!i18n.isInitialized) {
    i18n.use(initReactI18next)
        .use(
            resourcesToBackend(
                (language: string) =>
                    import(`../../../../lang/${language}.json`),
            ),
        )
        .init({
            partialBundledLanguages: true,
            interpolation: {
                escapeValue: false, // react already safes from xss
                prefix: '[',
                suffix: ']',
            },
            react: {
                useSuspense: true,
            },
        });
}

export default i18n;
