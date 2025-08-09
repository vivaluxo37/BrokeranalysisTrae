import classNames from 'classnames';
import React, { FC, PropsWithChildren, useCallback } from 'react';
import { getGeneralElementClickEventData } from '../../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../../util/measurement/functions/sendGA4Event';

export const FooterNavigationItem: FC<
    PropsWithChildren<{
        url: string;
        measurementListId: string;
        elementId?: string;
        newTab?: boolean;
        className?: string;
    }>
> = ({
    url,
    measurementListId,
    elementId,
    newTab = true,
    className,
    children,
}) => {
    const handleClick = useCallback(() => {
        const event = getGeneralElementClickEventData({
            measurementListId,
            elementId,
        });

        sendGA4Event(event);
    }, [elementId, measurementListId]);

    return (
        <a
            onClick={handleClick}
            target={newTab ? '_blank' : '_self'}
            className={classNames(
                'inline-block py-1 text-base text-slate-400 transition-colors first-letter:uppercase hover:text-primary-500',
                className,
            )}
            href={url}
        >
            {children}
        </a>
    );
};
