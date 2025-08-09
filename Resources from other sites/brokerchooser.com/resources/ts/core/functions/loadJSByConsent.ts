import { waitFor } from '../../findMyBrokerPage/functions/waitFor';
import { isServer } from '../../util/isServer';
import { ConsentLevel } from '../types/ConsentLevel';
import { IubendaPreference } from '../types/IubendaPreference';
import { extractAcceptedIubendaConsentLevels } from './extractAcceptedIubendaConsentLevels';

type LoadScriptEntry = {
    loadAction: () => void;
    consentLevel: ConsentLevel;
};

interface ILoadJsQueue {
    loadScriptQueue: LoadScriptEntry[];
    consentLevels: ConsentLevel[];
    setConsentLevels: (iubendaPreference: IubendaPreference) => void;
    addItem: (item: () => void, consentLevel: ConsentLevel) => void;
}

export class LoadJsQueue implements ILoadJsQueue {
    loadScriptQueue: LoadScriptEntry[] = [];

    consentLevels: ConsentLevel[] = [];

    public setConsentLevels(iubendaPreference: IubendaPreference) {
        this.consentLevels =
            extractAcceptedIubendaConsentLevels(iubendaPreference);
        this.loadAllowedScripts();
    }

    public addItem(item: () => void, consentLevel: ConsentLevel) {
        if (this.isAllowed(consentLevel)) {
            item();
            return;
        }
        this.loadScriptQueue.push({
            loadAction: item,
            consentLevel,
        });
    }

    private loadAllowedScripts() {
        const previousQueue = this.loadScriptQueue.splice(0);

        previousQueue.forEach((item) => {
            if (this.isAllowed(item.consentLevel)) {
                item.loadAction();
            } else {
                this.loadScriptQueue.push(item);
            }
        });
    }

    private isAllowed(consentLevel: ConsentLevel) {
        if (
            consentLevel === ConsentLevel.NotNeeded ||
            consentLevel === ConsentLevel.Necessary
        ) {
            return true;
        }
        return this.consentLevels.includes(consentLevel);
    }
}

const loadScriptElement = (url: string) => {
    const scriptEl = document.createElement('script');
    scriptEl.type = 'text/javascript';
    scriptEl.async = true;
    scriptEl.src = url;
    const firstScriptEl = document.getElementsByTagName('script')[0];
    firstScriptEl.parentNode?.insertBefore(scriptEl, firstScriptEl);
};

export const loadJSByConsent = (
    url: string,
    consentLevel: ConsentLevel = ConsentLevel.NotNeeded,
): void => {
    if (isServer()) {
        return;
    }

    if (
        consentLevel === ConsentLevel.NotNeeded ||
        consentLevel === ConsentLevel.Necessary
    ) {
        loadScriptElement(url);
        return;
    }

    window.BC_SCRIPT_QUEUE.push({
        command: 'addItemToScriptLoaderQueue',
        params: [() => loadScriptElement(url), consentLevel],
    });
};

export const getConsentLevels = (): ConsentLevel[] => {
    const iubendaPreference = window._iub?.cs?.api?.getPreferences();

    if (iubendaPreference === undefined) {
        return [];
    }

    return extractAcceptedIubendaConsentLevels(iubendaPreference);
};

export const getConsentLevelsAsync = async (
    maxRetries = 5,
    delayMs = 200,
): Promise<ConsentLevel[]> => {
    let tryCount = 0;

    while (tryCount < maxRetries) {
        const iubendaPreference = window._iub?.cs?.api?.getPreferences();

        if (iubendaPreference && iubendaPreference.purposes) {
            return extractAcceptedIubendaConsentLevels(iubendaPreference);
        }

        // eslint-disable-next-line no-await-in-loop
        await waitFor(delayMs);
        tryCount += 1;
    }

    console.warn('Failed to get Iubenda preferences after maximum retries');
    return [];
};
