import { debounce } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { isServer } from '../../util/isServer';
import { Breakpoints } from '../consts/Breakpoints';

export const useIsMobile: (mobileBreakpoint?: number) => boolean = (
    mobileBreakpoint = Breakpoints.sm,
) => {
    const [isMobile, setIsMobile] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleResize = useCallback(
        debounce(() => {
            setIsMobile(window.innerWidth < mobileBreakpoint);
        }, 200),
        [mobileBreakpoint],
    );

    useEffect(() => {
        if (isServer()) {
            return () => null;
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return isMobile;
};
