import axios from 'axios';
import { reportError } from '../../logic/util/error/reportError';
import { Broker } from '../types/commonTypes';

export const updateFavoriteProvider = async (args: {
    providerId: Broker['id'];
    isProviderSaved: boolean;
}): Promise<Broker['id'][]> => {
    const { providerId, isProviderSaved } = args;
    try {
        const url = `/api/save_for_later/broker/${providerId}`;

        return isProviderSaved
            ? axios
                  .delete<Broker['id'][]>(url)
                  .then((response) => response.data)
            : axios.post<Broker['id'][]>(url).then((response) => response.data);
    } catch (err: any) {
        reportError(err);
        throw new Error(err);
    }
};
