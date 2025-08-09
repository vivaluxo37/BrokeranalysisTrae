import axios from 'axios';
import { reportError } from '../../../../logic/util/error/reportError';
import { getClientSideData } from '../../../functions/getClientSideData';
import { GeoAlternativeModalData } from '../types/types';

export const getGeoAlternativeModalData = async (args: {
    brokerId: number;
    signal: AbortSignal;
}): Promise<GeoAlternativeModalData> => {
    const { brokerId, signal } = args;
    try {
        const response = await axios.post(
            '/api/broker/geo_alternative_modal',
            {
                brokerId,
                countryId: getClientSideData().countryId,
            },
            { signal },
        );

        return response.data;
    } catch (error: any) {
        reportError(error, {
            brokerId,
        });
        throw new Error(error);
    }
};
