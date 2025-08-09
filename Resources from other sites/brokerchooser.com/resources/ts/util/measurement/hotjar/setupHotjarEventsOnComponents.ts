import { captureException } from '@sentry/react';
import { debounce } from 'lodash-es';
import { sendHotJarEvent } from '../../../core/functions/sendHotJarEvent';
import { setupHumanEyeVisibilityCheck } from '../../../logic/elem_on_screen/setupHumanEyeVisibilityCheck';

export const setupHotjarEventsOnComponents = () => {
    const items = document.querySelectorAll<HTMLElement>(
        '[data-hotjar-event-id]',
    );

    items.forEach((element) => {
        const {
            hotjarEventId,
            hotjarEventImpression,
            hotjarEventClick,
            hotjarEventHover,
        } = element.dataset;

        if (
            !hotjarEventId ||
            (!hotjarEventImpression && !hotjarEventClick && !hotjarEventHover)
        ) {
            captureException(
                `Missing hotjar event property on element: ${element}`,
            );
            return;
        }

        if (hotjarEventImpression) {
            setupHumanEyeVisibilityCheck({
                element,
                onElementVisible: () => {
                    sendHotJarEvent(hotjarEventId);
                },
                debug: false,
            });
        }

        if (hotjarEventClick) {
            element.addEventListener('click', () => {
                sendHotJarEvent(hotjarEventId);
            });
        }

        if (hotjarEventHover) {
            element.addEventListener(
                'mouseenter',
                debounce(
                    () => {
                        sendHotJarEvent(hotjarEventId);
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
