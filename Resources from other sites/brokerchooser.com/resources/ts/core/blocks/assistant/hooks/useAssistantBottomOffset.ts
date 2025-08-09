import { useMemo } from 'react';
import { isServer } from '../../../../util/isServer';

/**
 * Calculates a bottom offset to be used on elements fixed to the bottom of the page,
 * so that they don't clash with non-React components like the bottom bar. Yes, it's ugly.
 *
 * @return A Tailwind class string with the offset.
 */
export const useAssistantBottomOffset = () =>
    useMemo(() => {
        if (isServer()) {
            return 'bottom-4';
        }

        const isMobileBottomPopupPresent = !!document.querySelector(
            '.bc_mobile_bottom_popup',
        );

        if (!isMobileBottomPopupPresent) {
            return 'bottom-4';
        }

        const doesBottomPopupHaveCFDWarning = !!document.querySelector(
            '.bc_mobile_bottom_popup .bc-cta-cfd-warning',
        );

        return doesBottomPopupHaveCFDWarning ? 'bottom-24' : 'bottom-16';
    }, []);
