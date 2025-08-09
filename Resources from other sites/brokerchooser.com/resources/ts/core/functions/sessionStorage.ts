import { isServer } from '../../util/isServer';

let isSessionStorageAvailable: boolean;
const getIsSessionStorageAvailable = (): boolean => {
    if (isServer() || isSessionStorageAvailable !== undefined) {
        return isSessionStorageAvailable;
    }

    /*
        To determine if sessionStorage is available, it's not enough to check if sessionStorage Object is not null.
        We need do try if we have access to its functions.
    */
    try {
        sessionStorage.setItem('bc_test', '');
        sessionStorage.removeItem('bc_test');
        isSessionStorageAvailable = true;
    } catch (err) {
        isSessionStorageAvailable = false;
    }

    return isSessionStorageAvailable;
};

export const getSessionStorageItem = (key: string): null | string => {
    if (!getIsSessionStorageAvailable()) {
        return null;
    }

    return sessionStorage.getItem(key);
};

export const setSessionStorageItem = (args: {
    key: string;
    value: string;
}): boolean => {
    if (!getIsSessionStorageAvailable()) {
        return false;
    }

    sessionStorage.setItem(args.key, args.value);
    return true;
};

// because it might be a good implementation for the future
// eslint-disable-next-line import/no-unused-modules
export const removeSessionStorageItem = (key: string): boolean => {
    if (!getIsSessionStorageAvailable()) {
        return false;
    }
    sessionStorage.removeItem(key);
    return true;
};
