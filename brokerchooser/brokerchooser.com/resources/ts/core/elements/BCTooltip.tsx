import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    Placement,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import React, { FC, PropsWithChildren, useCallback, useState } from 'react';
import { getHoverEventData } from '../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../util/measurement/functions/sendGA4Event';

export type BCTooltipPosition = Placement;

export const BCTooltip: FC<
    PropsWithChildren<{
        content: string | React.ReactNode;
        className?: string;
        contentClassName?: string;
        onHover?: () => void;
        position?: BCTooltipPosition;
        trackingProps?: {
            measurementListId: string;
            elementId: string;
        };
    }>
> = ({
    onHover,
    className,
    contentClassName,
    content,
    children,
    position = 'bottom-start',
    trackingProps,
}) => {
    const onMouseEnter = useCallback(() => {
        if (trackingProps) {
            const event = getHoverEventData({
                measurementListId: trackingProps.measurementListId,
                elementId: trackingProps.elementId,
            });

            sendGA4Event(event);
        }

        if (onHover) {
            onHover();
        }
    }, [onHover, trackingProps]);

    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: position,
        middleware: [offset(10), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    return (
        <>
            <div
                ref={refs.setReference}
                {...getReferenceProps()}
                className={classNames(
                    'has-tooltip relative inline-block cursor-pointer',
                    className,
                )}
                onMouseEnter={onMouseEnter}
            >
                {children}
            </div>
            {isOpen && (
                <FloatingPortal>
                    <span
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className={classNames(
                            'absolute z-50 w-max max-w-[15rem] rounded bg-secondary-50 p-3 text-sm shadow-lg md:max-w-xs',
                            contentClassName,
                        )}
                    >
                        {content}
                    </span>
                </FloatingPortal>
            )}
        </>
    );
};
