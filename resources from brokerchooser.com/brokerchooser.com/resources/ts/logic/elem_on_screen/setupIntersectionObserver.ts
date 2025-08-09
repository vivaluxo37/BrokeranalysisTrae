type Param = {
    element: HTMLElement;
    onElementAppeared?: (element: HTMLElement) => void;
    onElementDisappeared?: (element: HTMLElement) => void;
    rootMargin?: string;
};

const buildThresholdList = (numSteps: number = 20): number[] => {
    const thresholds: number[] = [];

    for (let i = 1.0; i <= numSteps; i++) {
        const ratio = i / numSteps;
        thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
};

const createIntersectionHandler =
    ({
        element,
        onElementAppeared,
        onElementDisappeared,
    }: Param): IntersectionObserverCallback =>
    // let onScreenTimer: number | undefined;

    (
        entries,
        // eslint-disable-next-line
        observer,
    ) => {
        entries.forEach((entry) => {
            // todo: Might be useful to ensure if target == elem.
            //  But the code only sets up each observer individually anyway.

            const isOnScreen = entry.intersectionRatio > 0.9;

            if (isOnScreen) {
                if (onElementAppeared) {
                    onElementAppeared(element);
                }
            }

            if (!isOnScreen) {
                if (onElementDisappeared) {
                    onElementDisappeared(element);
                }
            }
        });
    };
export const setupIntersectionObserver = (
    param: Param,
): IntersectionObserver => {
    const { element } = param;

    const options: IntersectionObserverInit = {
        root: null,
        threshold: buildThresholdList(),
    };

    if (param.rootMargin) {
        options.rootMargin = param.rootMargin;
    }

    const handleIntersect = createIntersectionHandler(param);

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(element);
    return observer;
};

export const stopIntersectionObserver = (
    observer: IntersectionObserver,
    element: HTMLElement,
) => {
    observer.unobserve(element);
    // because only 1 element per observer exists
    observer.disconnect();
};
