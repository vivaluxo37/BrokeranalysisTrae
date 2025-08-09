import { BaseTooltip } from '@design-system/components/surfaces/tooltip/BaseTooltip';
import { ColorMode } from '@design-system/types/coreTypes';
import { Placement } from '@floating-ui/react';
import React, { FC, PropsWithChildren, useState } from 'react';

export const Tooltip: FC<
    PropsWithChildren<{
        content: string | React.ReactNode;
        className?: string;
        contentClassName?: string;
        position?: Placement;
        mode?: ColorMode;
        trackingProps?: {
            measurementListId: string;
            elementId?: string;
        };
    }>
> = ({
    className,
    contentClassName,
    content,
    children,
    position = 'bottom',
    mode = 'light',
    trackingProps,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <BaseTooltip
            className={className}
            contentClassName={contentClassName}
            content={content}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            position={position}
            mode={mode}
            trackingProps={trackingProps}
        >
            {children}
        </BaseTooltip>
    );
};
