import axios, { AxiosResponse } from 'axios';
import { trimStart } from 'lodash-es';
import { reportError } from '../../../../logic/util/error/reportError';

export const setLocalisation = async (args: {
    languageCode: string;
    countryId: number;
}): Promise<AxiosResponse<{ redirectUrl?: string }>> => {
    try {
        return axios.post<{ redirectUrl?: string }>('/api/set-user-locale', {
            path:
                window.location.pathname === '/'
                    ? '/'
                    : trimStart(window.location.pathname, '/'),
            languageCode: args.languageCode,
            countryId: args.countryId,
        });
    } catch (err: any) {
        reportError(err);
        throw new Error(err);
    }
};
