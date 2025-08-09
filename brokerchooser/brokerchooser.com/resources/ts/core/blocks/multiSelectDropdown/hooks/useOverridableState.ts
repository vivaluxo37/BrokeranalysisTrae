import { useEffect, useState } from 'react';
import { useDebouncedFunction } from './useDebouncedFunction';

type Params<T> = {
    value: T;
    onSetValueDebounced?: (newValue: T) => void;
    wait?: number;
    deps?: any[];
};

export const useOverridableState = <T>(
    params: Params<T>,
): [T, (newValue: T) => void] => {
    const { value } = params;
    const deps = params.deps || [];

    //=

    const [state, setState] = useState<T>(value);

    const onSetValueDebounced = useDebouncedFunction(
        params.onSetValueDebounced || (() => ({})),
        params.wait || 100, // default is set elsewhere
        deps,
    );

    useEffect(
        () => {
            // do not call debounced, it would cause endless loop
            // should not depend on the state, otherwise it will never set it
            setState(value);
        },
        // value should not be deps, because in case if it is an object it will keep re-updating
        deps,
    );

    const set = (newValue: T) => {
        setState(newValue);

        if (params.wait) {
            onSetValueDebounced(newValue);
        } else {
            // call directly, omit the debounce entirely
            params.onSetValueDebounced?.(newValue);
        }
    };

    return [state, set];
};
