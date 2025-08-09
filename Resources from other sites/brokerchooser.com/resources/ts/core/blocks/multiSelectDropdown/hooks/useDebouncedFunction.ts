import { useCallback } from 'react';
import { debounce } from '../../../../logic/util/functions/debounce';

export const useDebouncedFunction = <T extends (...args: any) => any>(
    func: T,
    wait: number = 500,
    deps: any[] = [],
) => useCallback(debounce(func, wait), deps);
