import React from 'react';
import { createRoot } from 'react-dom/client';
import { Empty } from '../core/elements/Empty';
import { getClientSideData } from '../core/functions/getClientSideData';
import { getTranslationResource } from '../core/functions/getTranslationResource';
import { TranslationProvider } from '../inertia/TranslationProvider';

export const getComponent = async (
    reactComponentName: string,
): Promise<React.FunctionComponent<any>> => {
    const simpleComponentMap: Record<
        string,
        () => Promise<React.FunctionComponent<any>>
    > = {
        AnchorLinks: () =>
            import('../core/blocks/anchorLinks/AnchorLinks').then(
                (module) => module.AnchorLinks,
            ),
        AssistantAndForumMoreHelp: () =>
            import(
                '../core/blocks/assistantAndForumMoreHelp/AssistantAndForumMoreHelp'
            ).then((module) => module.AssistantAndForumMoreHelp),
        AssistantFakeDoorModal: () =>
            import(
                '../core/blocks/assistant/blocks/assistantFakeDoor/AssistantFakeDoorModal'
            ).then((module) => module.AssistantFakeDoorModal),
        AssistantModal: () =>
            import('../core/blocks/assistant/AssistantModal').then(
                (module) => module.AssistantModal,
            ),
        AuthorInfoCard: () =>
            import('../core/blocks/authorInfoCard/AuthorInfoCard').then(
                (module) => module.AuthorInfoCard,
            ),
        AuthorSection: () =>
            import('../core/elements/AuthorSection').then(
                (module) => module.AuthorSection,
            ),
        BestBrokersList: () =>
            import('../core/blocks/bestBrokersList/BestBrokersList').then(
                (module) => module.BestBrokersList,
            ),
        BreadcrumbBar: () =>
            import('../core/blocks/breadcrumb/BreadcrumbBar').then(
                (module) => module.BreadcrumbBar,
            ),
        BrokerBarChartSelector: () =>
            import(
                '../core/blocks/brokerBarChartSelector/BrokerBarChartSelector'
            ).then((module) => module.BrokerBarChartSelector),
        BrokerMainPointsList: () =>
            import('../brokerReviewPage/elements/BrokerMainPointsList').then(
                (module) => module.BrokerMainPointsList,
            ),
        BrokerOfTheMonthPromoBar: () =>
            import(
                '../core/blocks/brokerOfTheMonthPromoBar/BrokerOfTheMonthPromoBar'
            ).then((module) => module.BrokerOfTheMonthPromoBar),
        BrokerOfTheMonthReviewBox: () =>
            import(
                '../brokerReviewPage/blocks/brokerOfTheMonthReviewBox/BrokerOfTheMonthReviewBox'
            ).then((module) => module.BrokerOfTheMonthReviewBox),
        BrokerReviewCard: () =>
            import(
                '../brokerReviewPage/blocks/brokerReviewCard/BrokerReviewCard'
            ).then((module) => module.BrokerReviewCard),
        ChainLink: () =>
            import('../core/blocks/chainLink/ChainLink').then(
                (module) => module.ChainLink,
            ),
        CloudflareTurnstile: () =>
            import(
                '../registrationPage/blocks/cloudflareTurnstile/CloudflareTurnstile'
            ).then((module) => module.CloudflareTurnstile),
        CmsEditorControl: () =>
            import('../core/blocks/cmsEditorControl/CmsEditorControl').then(
                (module) => module.CmsEditorControl,
            ),
        CmsEditorToolbar: () =>
            import('../core/blocks/cmsEditorToolbar/CmsEditorToolbar').then(
                (module) => module.CmsEditorToolbar,
            ),
        CollapsibleBrokerClusterList: () =>
            import(
                '../core/blocks/collapsibleBrokerClusterList/elements/CollapsibleBrokerClusterList'
            ).then((module) => module.CollapsibleBrokerClusterList),
        CurrencyPairSelector: () =>
            import(
                '../core/blocks/currencyPairSelector/elements/CurrencyPairSelector'
            ).then((module) => module.CurrencyPairSelector),
        Datawrapper: () =>
            import('../core/elements/Datawrapper').then(
                (module) => module.Datawrapper,
            ),
        DynamicScoreTopBrokerList: () =>
            import(
                '../core/blocks/dynamicScoreTopBrokerList/elements/DynamicScoreTopBrokerList'
            ).then((module) => module.DynamicScoreTopBrokerList),
        FindMyBrokerChannelingWidget: () =>
            import(
                '../core/blocks/findMyBrokerChannelingWidget/FindMyBrokerChannelingWidget'
            ).then((module) => module.FindMyBrokerChannelingWidget),
        GeoChecker: () =>
            import('../core/blocks/geoChecker/GeoChecker').then(
                (module) => module.GeoChecker,
            ),
        GeoAlternativeModal: () =>
            import(
                '../core/blocks/geoAlternativeModal/GeoAlternativeModal'
            ).then((module) => module.GeoAlternativeModal),
        GoogleAdComponent: () =>
            import('../core/blocks/googleAdComponent/GoogleAdComponent').then(
                (module) => module.GoogleAdComponent,
            ),
        HeaderCover: () =>
            import('../brokerReviewPage/blocks/headerCover/HeaderCover').then(
                (module) => module.HeaderCover,
            ),
        InlinePortfolioTrackingModal: () =>
            import(
                '../core/blocks/inlinePortfolioTrackingModal/InlinePortfolioTrackingModal'
            ).then((module) => module.InlinePortfolioTrackingModal),
        InteractiveParamTable: () =>
            import(
                '../core/blocks/interactiveParamTable/InteractiveParamTable'
            ).then((module) => module.InteractiveParamTable),
        InteractiveEntityParamTable: () =>
            import(
                '../core/blocks/interactiveParamTable/InteractiveParamTable'
            ).then((module) => module.InteractiveParamTable),
        IsBrokerSafe: () =>
            import('../core/blocks/isBrokerSafe/IsBrokerSafe').then(
                (module) => module.IsBrokerSafe,
            ),
        NavBar: () =>
            import('../core/blocks/navbar/NavBar').then(
                (module) => module.NavBar,
            ),
        NotTrustedBrokerWarning: () =>
            import(
                '../safetyPage/blocks/notTrustedBrokerWarning/NotTrustedBrokerWarning'
            ).then((module) => module.NotTrustedBrokerWarning),
        NotTrustedBrokerWarningBox: () =>
            import(
                '../safetyPage/blocks/notTrustedBrokerWarningBox/NotTrustedBrokerWarningBox'
            ).then((module) => module.NotTrustedBrokerWarningBox),
        PlaidLink: () =>
            import('../core/elements/PlaidLink').then(
                (module) => module.PlaidLink,
            ),
        PopularityBox: () =>
            import('../core/blocks/popularityBox/PopularityBox').then(
                (module) => module.PopularityBox,
            ),
        ProConTable: () =>
            import('../core/blocks/proConTable/elements/ProConTable').then(
                (module) => module.ProConTable,
            ),
        ProfilePicture: () =>
            import('../brokerReviewPage/elements/ProfilePicture').then(
                (module) => module.ProfilePicture,
            ),
        RegistrationModal: () =>
            import('../core/blocks/registrationModal/RegistrationModal').then(
                (module) => module.RegistrationModal,
            ),
        ReviewTableOfContents: () =>
            import(
                '../brokerReviewPage/blocks/tableOfContent/ReviewTableOfContents'
            ).then((module) => module.ReviewTableOfContents),
        BrokerFeatureAvailabilityCheckTool: () =>
            import(
                '../core/blocks/brokerFeatureAvailabilityCheckTool/BrokerFeatureAvailabilityCheckTool'
            ).then((module) => module.BrokerFeatureAvailabilityCheckTool),
        ScamvestigatorBanner: () =>
            import(
                '../core/blocks/scamvestigatorBanner/ScamvestigatorBanner'
            ).then((module) => module.ScamvestigatorBanner),
        StockFeeCalculator: () =>
            import(
                '../core/blocks/stockFeeCalculator/elements/StockFeeCalculatorWrapper'
            ).then((module) => module.StockFeeCalculatorWrapper),
        TestimonialBox: () =>
            import('../core/blocks/testimonialBox/TestimonialBox').then(
                (module) => module.TestimonialBox,
            ),
        ToastContainer: () =>
            import(
                '../core/blocks/toastContainerWrapper/ToastContainerWrapper'
            ).then((module) => module.ToastContainerWrapper),
        Top5Box: () =>
            import('../core/blocks/top5Box/Top5Box').then(
                (module) => module.Top5Box,
            ),
        Footer: () =>
            import('../core/blocks/footer/Footer').then(
                (module) => module.Footer,
            ),
        DeleteAccountSection: () =>
            import(
                '../manageProfilePage/blocks/deleteAccount/DeleteAccount'
            ).then((module) => module.DeleteAccount),
        AssistantEntryPoint: () =>
            import(
                '../core/blocks/assistant/elements/AssistantEntryPoint'
            ).then((module) => module.AssistantEntryPoint),
        CpcBrokerPromo: () =>
            import('../core/blocks/cpcBrokerPromo/CpcBrokerPromo').then(
                (module) => module.CpcBrokerPromo,
            ),
        VisitBrokerButton: () =>
            import('../core/blocks/visitBrokerButton/VisitBrokerButton').then(
                (module) => module.VisitBrokerButton,
            ),
    };

    if (reactComponentName in simpleComponentMap) {
        return simpleComponentMap[reactComponentName]().catch(() => Empty);
    }

    const modulePath = `./entry/${reactComponentName}Entry.tsx`;

    const components = import.meta.glob('./entry/*.tsx', {
        eager: true,
    }) as Record<string, { default: React.FunctionComponent<any> }>;

    if (!(modulePath in components)) {
        return Promise.reject(
            new Error(`Component not found: ${reactComponentName}`),
        );
    }

    return components[modulePath].default;
};

export const initializeReactComponentsFromBlade = (element?: HTMLElement) => {
    (element || document)
        .querySelectorAll<HTMLElement>('[data-page]:not(#app)')
        .forEach(async (el) => {
            const { page } = el.dataset;

            if (!page) {
                return;
            }

            const inertiaPageObject = JSON.parse(page);

            const { languageCode } = getClientSideData();
            const translationResource =
                await getTranslationResource(languageCode);

            const component = await getComponent(inertiaPageObject.component);

            const root = createRoot(el);
            root.render(
                <TranslationProvider
                    initialTranslation={translationResource}
                    initialLanguageCode={languageCode}
                >
                    {React.createElement(component, inertiaPageObject.props)}
                </TranslationProvider>,
            );
        });
};
