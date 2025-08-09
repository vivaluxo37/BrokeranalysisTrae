import axios from 'axios';

import * as Sentry from '@sentry/react';
import { initializeReactComponentsFromBlade } from '../../components/initializeReactComponentsFromBlade';
import { initializeOpenAccountButton } from '../../core/blocks/visitBrokerButton/functions/initializeOpenAccountButton';
import { initGeneralGoogleAnalyticsEvents } from '../../core/functions/generalGoogleAnalyticsEvents';
import { LoadJsQueue } from '../../core/functions/loadJSByConsent';
import {
    initGlobalStore,
    initGlobalStoreSSR,
} from '../../core/globalStore/initStore';
import { initChapterToggleBtn } from '../../logic/chapter-toggler/chapterToggler';
import { setupAuthenticationEvents } from '../../logic/events/authentication';
import { addContextToSentry } from '../../logic/other/addContextsToSentry';
import { setupUserChanneling } from '../../logic/other/setupUserChanneling';
import { onReady } from '../../logic/types/onReady';
import { loadGetSiteControl } from '../../thirdparty/getSiteControl';
import { isServer } from '../../util/isServer';
import { setupCtaImpressionEventsOnSite } from '../../util/measurement/enhancedEcommerce/setupCtaImpressionEventsOnSite';
import { getGeneralElementClickEventData } from '../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../util/measurement/functions/sendGA4Event';
import { setupHotjarEventsOnComponents } from '../../util/measurement/hotjar/setupHotjarEventsOnComponents';
import { initPhotoGallery } from './initPhotoGallery';

// This makes Laravel detect API requests with $request->isXmlHttpRequest()
// @ts-ignore
window.axios = axios;
// @ts-ignore
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

if (import.meta.env.PROD) {
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN_PUBLIC,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.thirdPartyErrorFilterIntegration({
                filterKeys: ['bc-frontend'],
                behaviour: 'drop-error-if-contains-third-party-frames',
            }),
        ],
        // Performance Monitoring
        tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/brokerchooser\.com/],
    });
}

if (!import.meta.env.SSR) {
    const loadJsQueue = new LoadJsQueue();

    const previousCommands = window.BC_SCRIPT_QUEUE as {
        command: string;
        params: any[];
    }[];

    window.BC_SCRIPT_QUEUE = {
        push: ({ command, params }) => {
            if (command === 'addItemToScriptLoaderQueue') {
                loadJsQueue.addItem(params[0], params[1]);
                return;
            }

            if (command === 'setConsentLevels') {
                loadJsQueue.setConsentLevels(params[0]);
                return;
            }

            if (command === 'sendGa4Event') {
                const event = getGeneralElementClickEventData({
                    measurementListId: params[0],
                });

                sendGA4Event(event);
                return;
            }

            throw new Error(`Unknown script queue action: ${command}`);
        },
    };

    // Widget pages has no BC_SCRIPT_QUEUE assigned to the window
    if (previousCommands) {
        previousCommands.forEach((command) => {
            window.BC_SCRIPT_QUEUE.push(command);
        });
    }
}

function initReviewLink() {
    document.querySelectorAll('.review-link').forEach((element) => {
        element.addEventListener('click', (e) => {
            const { brokerName, measurementList } = (
                e.currentTarget as HTMLElement
            ).dataset;

            if (brokerName && measurementList) {
                const ga4ImpressionEventData = getGeneralElementClickEventData({
                    elementId: brokerName,
                    measurementListId: measurementList,
                    elementType: 'read_review',
                });

                sendGA4Event(ga4ImpressionEventData);
            }
        });

        // TODO: add auxclick
    });
}

function initAccountBtn() {
    document
        .querySelectorAll<HTMLElement>('.openAccountBtn')
        .forEach((element) => {
            initializeOpenAccountButton(element);
        });
}

function reloadOnDynamicImportFailError() {
    if (!isServer()) {
        window.addEventListener('vite:preloadError', (event) => {
            event.preventDefault();
            window.location.reload();
        });
    }
}

function hijackConsole() {
    if (window && window.console) {
        window.consoleOutputs = {
            errors: [],
            warns: [],
        };
        const { error, warn } = console;
        // eslint-disable-next-line no-console
        console.warn = function hijackedWarn(...args) {
            window.consoleOutputs.warns.push(args);
            warn.apply(this, args);
        };
        // eslint-disable-next-line no-console
        console.error = function hijackedError(...args) {
            window.consoleOutputs.errors.push(args);
            error.apply(this, args);
        };

        window.addEventListener(
            'unhandledrejection',
            (event) => window.consoleOutputs.errors.push(event),
            true,
        );

        window.addEventListener(
            'error',
            (event) => window.consoleOutputs.errors.push(event),
            true,
        );
    }
}

onReady(() => {
    hijackConsole();
    initAccountBtn();

    initReviewLink();
    loadGetSiteControl();
    initGeneralGoogleAnalyticsEvents();
    setupHotjarEventsOnComponents();

    initPhotoGallery();

    setupUserChanneling();
    setupCtaImpressionEventsOnSite();
    initChapterToggleBtn();

    setupAuthenticationEvents();

    initGlobalStore();
    reloadOnDynamicImportFailError();

    initializeReactComponentsFromBlade();

    addContextToSentry();
});

initGlobalStoreSSR();
