import { useMemo } from 'react';
import { getClientSideData } from '../functions/getClientSideData';
import { ClientSideData } from '../types/ClientSideDataType';

// returns empty object for easier handling of destructuring
export const useBCClientSideData = (): ClientSideData =>
    useMemo(getClientSideData, []);

/**
 * Separate function, because it is used at so many places
 */
export function useMeasurementCategoryId(): string {
    const clientSideData = useBCClientSideData();
    return clientSideData.measurementPageCategory;
}
