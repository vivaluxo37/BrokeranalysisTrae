import { isServer } from '../../util/isServer';

const isCookieStorageAvailable = () => {
    if (isServer()) {
        return false;
    }
    return typeof document.cookie !== 'undefined';
};

export const getCookie = (name: string): string | null => {
    if (!isCookieStorageAvailable()) {
        return null;
    }
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));

    if (match === null) {
        return null;
    }
    const [, , value] = match;

    return value;
};
