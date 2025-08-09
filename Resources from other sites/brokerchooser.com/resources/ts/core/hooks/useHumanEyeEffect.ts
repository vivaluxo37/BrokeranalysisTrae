import { identity } from 'lodash-es';
import { useCallback, useRef } from 'react';
import {
    HumanEyeSetup,
    removeHumanEyeSetup,
    setupHumanEyeVisibilityCheck,
} from '../../logic/elem_on_screen/setupHumanEyeVisibilityCheck';

export const useVisibleCheckOnRef = (
    onElementVisible: () => void,
    visibleAfterMillis: number,
): ((node: HTMLElement | null) => void) => {
    const humanEyeSetupRef = useRef<HumanEyeSetup | null>(null);

    return useCallback(
        (node: HTMLElement | null) => {
            if (!node || !onElementVisible) {
                if (humanEyeSetupRef.current !== null) {
                    removeHumanEyeSetup(humanEyeSetupRef.current);
                    humanEyeSetupRef.current = null;
                }
                return;
            }
            humanEyeSetupRef.current = setupHumanEyeVisibilityCheck({
                element: node,
                onElementVisible,
                debug: false,
                visibleAfterMillis,
            });
        },
        [onElementVisible, visibleAfterMillis],
    );
};

// instead of ref.current in the dep use a callback ref: https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
// original issue: https://github.com/facebook/react/issues/14387
export const useHumanEyeEffectOnRef = (
    onElementVisible?: () => void,
): ((node: HTMLElement | null) => void) =>
    useVisibleCheckOnRef(onElementVisible || identity, 2500);
