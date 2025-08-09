import { debounce, isNil, omitBy } from 'lodash-es';
import { setupHumanEyeVisibilityCheck } from '../../logic/elem_on_screen/setupHumanEyeVisibilityCheck';
import {
    getGeneralElementClickEventData,
    getGeneralElementImpressionEventData,
    getHoverEventData,
} from './functions/eventCreatorFunctions';
import { sendGA4Event } from './functions/sendGA4Event';

export const setupGAEventsOnComponents = () => {
    const items = document.querySelectorAll<HTMLElement>(
        '[data-ga-event-measurement-list-id]',
    );

    items.forEach((element) => {
        const {
            gaEventMeasurementListId,
            gaEventElementId,
            gaEventElementType,
            gaEventContext,
            gaEventPositionIndex,
            gaEventImpression,
            gaEventClick,
            gaEventHover,
        } = element.dataset;

        if (
            !gaEventMeasurementListId ||
            (!gaEventImpression && !gaEventClick && !gaEventHover)
        ) {
            reportError(`Missing GA4 event property on element: ${element}`);
            return;
        }

        const ga4EventArgs = omitBy(
            {
                elementId: gaEventElementId,
                elementType: gaEventElementType,
                positionIndex: gaEventPositionIndex,
                context: gaEventContext,
            },
            isNil,
        );

        if (gaEventImpression) {
            setupHumanEyeVisibilityCheck({
                element,
                onElementVisible: () => {
                    const event = getGeneralElementImpressionEventData({
                        ...ga4EventArgs,
                        measurementListId: gaEventMeasurementListId,
                    });

                    sendGA4Event(event);
                },
                debug: false,
            });
        }

        if (gaEventClick) {
            element.addEventListener('click', () => {
                const event = getGeneralElementClickEventData({
                    ...ga4EventArgs,
                    measurementListId: gaEventMeasurementListId,
                });

                sendGA4Event(event);
            });
        }

        if (gaEventHover) {
            element.addEventListener(
                'mouseenter',
                debounce(
                    () => {
                        const event = getHoverEventData({
                            ...ga4EventArgs,
                            measurementListId: gaEventMeasurementListId,
                        });

                        sendGA4Event(event);
                    },
                    5000,
                    {
                        leading: true,
                        trailing: false,
                    },
                ),
            );
        }
    });
};
