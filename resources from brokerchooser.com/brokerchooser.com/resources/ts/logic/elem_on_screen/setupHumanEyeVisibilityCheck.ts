import {
    setupIntersectionObserver,
    stopIntersectionObserver,
} from './setupIntersectionObserver';
import { showElementHighlightOverlayEffect } from './showElementHighlightOverlayEffect';

type Param = {
    element: HTMLElement;
    debug?: boolean;
    onElementVisible?: (element: HTMLElement) => void;
    visibleAfterMillis?: number;
    rootMargin?: string;
};

/**
 * being able to set up check for classlist change, css property change, timeout checks and everything
 */
const handleHumanEyeVisibleCheck = (
    // callback fired if element is deemed visible based on complex calculations
    onElementVisible: () => void,
    visibleAfterMillis: number,
) => {
    let onScreenTimer: number | undefined;

    const cancelTimer = () => {
        if (onScreenTimer !== undefined) {
            window.clearTimeout(onScreenTimer);
            onScreenTimer = undefined;
        }
    };

    const cancel = () => {
        cancelTimer();
    };

    const onElementAppearedOnScreen = () => {
        const justAppeared = onScreenTimer === undefined;
        if (justAppeared) {
            onScreenTimer = window.setTimeout(() => {
                onElementVisible();
            }, visibleAfterMillis);
        }
    };

    const onElementDisappearedFromScreen = () => {
        cancelTimer();
    };

    return {
        onElementAppearedOnScreen,
        onElementDisappearedFromScreen,
        cancel,
    };
};

export type HumanEyeSetup = {
    element: HTMLElement;
    intersectionObserver: IntersectionObserver;
    cancelRunningLogic: () => void;
};

export const removeHumanEyeSetup = ({
    element,
    intersectionObserver,
    cancelRunningLogic,
}: HumanEyeSetup) => {
    // can they be removed multiple times without exception?
    try {
        // if we want to remove it, the current timer should not count anymore
        cancelRunningLogic();
        stopIntersectionObserver(intersectionObserver, element);
    } catch (e) {
        console.error('Exception while removing observers');
        console.error(e);
    }
};

export const setupHumanEyeVisibilityCheck = (param: Param): HumanEyeSetup => {
    // implemented this way because of circular dependency between functions
    let removeAllObservers = () => {
        // will be overridden soon
        console.error('Removing all observers has been called too early :(');
    };

    const onElementVisible = (element: HTMLElement) => {
        // @ts-ignore
        const isDebugSetupFromConsole = window.logEEC;
        if (isDebugSetupFromConsole || param.debug) {
            showElementHighlightOverlayEffect(element);
        }

        if (param.onElementVisible) {
            param.onElementVisible(element);
        }

        removeAllObservers();
    };

    const veryComplicatedCheck = handleHumanEyeVisibleCheck(
        () => onElementVisible(param.element),
        typeof param.visibleAfterMillis === 'undefined'
            ? 2500
            : param.visibleAfterMillis,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const intersectionObserver = setupIntersectionObserver({
        element: param.element,
        onElementAppeared: veryComplicatedCheck.onElementAppearedOnScreen,
        onElementDisappeared:
            veryComplicatedCheck.onElementDisappearedFromScreen,
        rootMargin: param.rootMargin,
    });

    const setup: HumanEyeSetup = {
        element: param.element,
        intersectionObserver,
        cancelRunningLogic: veryComplicatedCheck.cancel,
    };

    removeAllObservers = () => {
        removeHumanEyeSetup(setup);
    };

    return setup;
};
