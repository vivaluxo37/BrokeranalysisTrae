import { useMemo } from 'react';
import { isServer } from '../../util/isServer';

export const useIsRtl = () =>
    useMemo(() => {
        if (isServer()) {
            return false;
        }
        return document.documentElement.dir === 'rtl';
    }, []);
