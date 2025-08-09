import { isServer } from '../../util/isServer';

let isLocalStorageAvailable: boolean;
const getIsLocalStorageAvailable = (): boolean => {
    if (isServer() || isLocalStorageAvailable !== undefined) {
        return isLocalStorageAvailable;
    }

    /*
        To determine if localStorage is available, it's not enough to check if localStorage Object is not null.
        We need do try if we have access to its functions.
    */
    try {
        localStorage.setItem('bc_test', '');
        localStorage.removeItem('bc_test');
        isLocalStorageAvailable = true;
    } catch (err) {
        isLocalStorageAvailable = false;
    }

    return isLocalStorageAvailable;
};

export const getLocalStorageItem = (key: string): null | string => {
    if (!getIsLocalStorageAvailable()) {
        return null;
    }

    return localStorage.getItem(key);
};

export const setLocalStorageItem = (args: {
    key: string;
    value: string;
}): boolean => {
    if (!getIsLocalStorageAvailable()) {
        return false;
    }

    localStorage.setItem(args.key, args.value);
    return true;
};

export const removeLocalStorageItem = (key: string): boolean => {
    if (isServer() || !getIsLocalStorageAvailable()) {
        return false;
    }
    localStorage.removeItem(key);
    return true;
};
