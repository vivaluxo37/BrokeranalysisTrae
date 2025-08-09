// @ts-nocheck

import { getCookie } from '../core/functions/cookieStorage';
import { getClientSideData } from '../core/functions/getClientSideData';
import { loadJSByConsent } from '../core/functions/loadJSByConsent';
import { ConsentLevel } from '../core/types/ConsentLevel';
import {
    getAffiliateElementClickEventData,
    getGeneralElementImpressionEventData,
} from '../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../util/measurement/functions/sendGA4Event';

const widgetCloseListeners: { [key: string]: () => void } = {};

const onShow = (widgetId: string) => {
    const event = getGeneralElementImpressionEventData({
        measurementListId: 'site control popup show',
        elementId: widgetId,
    });
    sendGA4Event(event);

    const handler = (e: PointerEvent) => {
        if (e.target.id === `getsitecontrol-${widgetId}`) {
            gsc('close', widgetId);
        }
    };

    document.body.addEventListener('click', handler);
    widgetCloseListeners[widgetId] = handler;
};

const onClose = (widgetId: string) => {
    const listener = widgetCloseListeners[widgetId];
    delete widgetCloseListeners[widgetId];

    document.body.removeEventListener('click', listener);
};

const onOpenUrl = (widgetId: string, url: string) => {
    const urlPatterns = [
        {
            brokerName: 'Interactive Brokers',
            urlPattern: '/go-to-broker/interactive-brokers/open-account',
        },
        {
            brokerName: 'NinjaTrader',
            urlPattern: '/go-to-broker/ninjatrader/open-account',
        },
        {
            brokerName: 'IC Markets',
            urlPattern: '/go-to-broker/ic-markets/open-account',
        },
    ];

    const matchedBrokerUrlPattern = urlPatterns.find((item) =>
        url.includes(item.urlPattern),
    );

    if (matchedBrokerUrlPattern) {
        const event = getAffiliateElementClickEventData({
            elementId: matchedBrokerUrlPattern.brokerName,
            measurementListId: `getsitecontrol-popup-url-open:${widgetId}`,
            isReported: true,
        });

        sendGA4Event(event);
    }
};

export function loadGetSiteControl() {
    const killGscCookieIsSet = getCookie('kill-gsc') === '1';
    if (killGscCookieIsSet) {
        return;
    }

    window.gsc =
        window.gsc ||
        function callBack(...args) {
            (gsc.q = gsc.q || []).push(args);
        };
    loadJSByConsent(
        '//l.getsitecontrol.com/pwp8zp57.js',
        ConsentLevel.Functionality,
    );

    gsc('onShow', onShow);
    gsc('onClose', onClose);
    gsc('onOpenUrl', onOpenUrl);

    const { countryName, languageCode, showCPCPromoInGSC, pageDimensions } =
        getClientSideData();

    gsc('params', {
        userLanguage: languageCode,
        userCountry: countryName,
        showCPCPromo: showCPCPromoInGSC,
        ...pageDimensions,
    });
}
