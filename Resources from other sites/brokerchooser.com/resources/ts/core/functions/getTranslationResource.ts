import { Resource } from 'i18next';

export const getTranslationResource = async (
    languageCode: string,
): Promise<Resource> => {
    const translationImports = import.meta.glob('../../../../lang/*.json');

    let moduleImport =
        translationImports[`../../../../lang/${languageCode}.json`];

    if (!moduleImport) {
        moduleImport = translationImports[`../../../../lang/en.json`];
    }

    const translation = (await moduleImport()) as {
        default: {
            [key: string]: string;
        };
    };

    if (!translation) {
        return {
            [languageCode]: {},
        };
    }

    return {
        [languageCode]: {
            translation: translation.default,
        },
    };
};
