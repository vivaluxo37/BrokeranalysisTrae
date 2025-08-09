import { useMemo } from 'react';
import { createVisitBrokerProps } from '../contexts/visitBrokerContext/functions/createVisitBrokerProps';
import {
    CreateVisitBrokerPropsArgs,
    ElementProps,
    UseCtaArgs,
} from '../contexts/visitBrokerContext/types/visitBrokerContextTypes';
import { useMeasurementCategoryId } from './useBCClientSideData';

export function useCtaElementArgs(rawArgs: UseCtaArgs): ElementProps {
    const measurementCategoryId = useMeasurementCategoryId();

    return useMemo(() => {
        const args: CreateVisitBrokerPropsArgs = {
            ...rawArgs,
            measurementCategoryId,
        };

        return createVisitBrokerProps(args);
    }, [measurementCategoryId, rawArgs]);
}
