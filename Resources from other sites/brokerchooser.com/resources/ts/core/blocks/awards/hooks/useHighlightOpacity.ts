import { throttle } from 'lodash-es';
import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { isServer } from '../../../../util/isServer';

export const useHighlightOpacity = ({
    ref,
    optOut,
    startOpacity,
    centralAreaMargin,
    lateralAreaMargin,
}: {
    ref: MutableRefObject<HTMLDivElement | null>;
    centralAreaMargin: number;
    lateralAreaMargin: number;
    optOut?: boolean;
    startOpacity?: number;
}): number | undefined => {
    const [opacity, setOpacity] = useState(startOpacity);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleScroll = useCallback(
        throttle(() => {
            if (!ref.current) {
                return;
            }
            const { top, height } = ref.current.getBoundingClientRect();

            const screenCenter = window.innerHeight * 0.35;
            const elementCenter = top + height / 2;
            const distanceFromCenter = Math.abs(elementCenter - screenCenter);

            if (distanceFromCenter <= centralAreaMargin) {
                setOpacity(1);
            } else if (elementCenter < lateralAreaMargin) {
                setOpacity(0);
            } else if (elementCenter > window.innerHeight - lateralAreaMargin) {
                setOpacity(0);
            } else {
                const maxDistance =
                    screenCenter - centralAreaMargin - lateralAreaMargin;

                const normalizedDistance =
                    (distanceFromCenter -
                        centralAreaMargin -
                        lateralAreaMargin) /
                    maxDistance;
                setOpacity(Math.max(0, 1 - normalizedDistance));
            }
        }, 100),
        [centralAreaMargin, lateralAreaMargin, ref],
    );

    useEffect(() => {
        if (optOut || isServer() || !ref.current) {
            return () => null;
        }
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll, optOut, ref]);

    return opacity;
};
