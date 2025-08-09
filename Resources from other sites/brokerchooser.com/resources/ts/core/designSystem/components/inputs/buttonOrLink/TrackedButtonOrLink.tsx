import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { ButtonOrLinkProps } from '@design-system/components/inputs/buttonOrLink/types';
import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react';
import { isServer } from '../../../../../util/isServer';
import { EventIdentifierArgs } from '../../../../../util/measurement/eventTypes';
import {
    getGeneralElementClickEventData,
    getGeneralElementImpressionEventData,
} from '../../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../../util/measurement/functions/sendGA4Event';
import { useMeasureImpression } from '../../../../../util/measurement/hooks/useMeasureImpression';
import { getTrackedLink } from '../../../../functions/getTrackedLink';

export const TrackedButtonOrLink: FC<
    ButtonOrLinkProps &
        EventIdentifierArgs & {
            withTrackedLink?: boolean;
        }
> = ({
    measurementListId,
    elementId,
    context,
    positionIndex,
    onClick,
    withTrackedLink,
    href,
    ...props
}) => {
    const impressionEvent = useMemo(
        () =>
            getGeneralElementImpressionEventData({
                measurementListId,
                elementId,
                context,
                positionIndex,
            }),
        [measurementListId, elementId, context, positionIndex],
    );

    const ref = useMeasureImpression({
        ga4ImpressionEventData: impressionEvent,
    });

    const handleClick = useCallback<MouseEventHandler<HTMLElement>>(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            const event = getGeneralElementClickEventData({
                measurementListId,
                elementId,
                context,
                positionIndex,
            });
            sendGA4Event(event);
            if (onClick) {
                onClick(e);
            }
        },
        [measurementListId, elementId, context, positionIndex, onClick],
    );

    const usedHref = useMemo(() => {
        if (isServer()) {
            return href;
        }

        if (href && withTrackedLink) {
            return getTrackedLink(href, {
                measurementListId,
                elementId,
                context,
                positionIndex,
            });
        }
        return href;
    }, [
        context,
        elementId,
        href,
        measurementListId,
        positionIndex,
        withTrackedLink,
    ]);

    return (
        <ButtonOrLink
            ref={ref}
            onClick={handleClick}
            href={usedHref}
            {...props}
        />
    );
};
