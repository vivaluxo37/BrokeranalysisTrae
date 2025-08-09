import { getClientSideData } from '../../core/functions/getClientSideData';

/**
 * Create relative url for given path
 *
 * @param path without leading slash
 */

export const createRelativeUrl = (path: string): string => {
    const { pageOrigin } = getClientSideData();

    return `${pageOrigin}/${path}`;
};
