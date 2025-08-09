import { createInertiaApp } from '@inertiajs/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { getClientSideData } from '../../core/functions/getClientSideData';
import { getTranslationResource } from '../../core/functions/getTranslationResource';
import '../../legacy/entry/app-core';
import { TranslationProvider } from '../TranslationProvider';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('../Pages/**/*.tsx');
        const path = `../Pages/${name}.tsx`;
        const page = pages[path];
        if (typeof page === 'undefined') {
            throw new Error(`Page not found: ${path}`);
        }
        return typeof page === 'function' ? page() : page;
    },
    // TODO: this should be used when we upgrade React
    // NOTE: hydrateRoot causes a lot of issues, it was decided to use createRoot instead
    // import { hydrateRoot } from 'react-dom/client'
    // setup({ el, App, props }) {
    //     hydrateRoot(el).render(<App {...props} />)
    // },

    // @ts-ignore
    setup: async ({ el, App, props }) => {
        const root = createRoot(el);

        const { languageCode } = getClientSideData();
        const translationResource = await getTranslationResource(languageCode);

        root.render(
            <TranslationProvider
                initialTranslation={translationResource}
                initialLanguageCode={languageCode}
            >
                <App {...props} />
            </TranslationProvider>,
        );
    },
});
