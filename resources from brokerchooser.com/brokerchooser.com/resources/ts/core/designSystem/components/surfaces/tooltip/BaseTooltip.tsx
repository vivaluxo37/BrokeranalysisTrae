import { ColorMode } from '@design-system/types/coreTypes';
import { arrow, Middleware } from '@floating-ui/dom';
import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    Placement,
    shift,
    Strategy,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import React, {
    FC,
    PropsWithChildren,
    useCallback,
    useMemo,
    useState,
} from 'react';
import { getHoverEventData } from '../../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../../util/measurement/functions/sendGA4Event';

export const BaseTooltip: FC<
    PropsWithChildren<{
        content: string | React.ReactNode;
        isOpen: boolean;
        setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
        className?: string;
        contentClassName?: string;
        position?: Placement;
        strategy?: Strategy;
        mode?: ColorMode;
        trackingProps?: {
            measurementListId: string;
            elementId?: string;
        };
        outerContent?: React.JSX.Element;
        floatingMiddleware?: Middleware[];
        arrowIsVerticalCentered?: boolean;
        arrowClassName?: string;
    }>
> = ({
    className,
    contentClassName,
    content,
    isOpen,
    setIsOpen,
    children,
    position = 'bottom',
    strategy = 'absolute',
    mode = 'light',
    trackingProps,
    outerContent,
    floatingMiddleware,
    arrowIsVerticalCentered = true,
    arrowClassName,
}) => {
    const onMouseEnter = useCallback(() => {
        if (trackingProps) {
            const event = getHoverEventData({
                measurementListId: trackingProps.measurementListId,
                elementId: trackingProps.elementId,
            });

            sendGA4Event(event);
        }
    }, [trackingProps]);

    const [arrowEl, setArrowEl] = useState<HTMLDivElement | null>(null);

    const middleware = useMemo<Middleware[]>(() => {
        const middlewareArray: Middleware[] = floatingMiddleware || [
            offset(12),
            flip({
                fallbackAxisSideDirection: 'start',
            }),
            shift(),
        ];
        middlewareArray.push(arrow({ element: arrowEl!, padding: 150 }));
        return middlewareArray;
    }, [arrowEl, floatingMiddleware]);

    const { refs, floatingStyles, context, middlewareData, placement } =
        useFloating({
            open: isOpen,
            ...(setIsOpen !== null && { onOpenChange: setIsOpen }),
            placement: position,
            strategy,
            whileElementsMounted: autoUpdate,
            middleware,
        });

    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context, { enabled: false });
    const role = useRole(context, { role: 'tooltip' });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    const staticSide = useMemo<string>(
        () =>
            ({
                top: 'bottom',
                right: 'left',
                bottom: 'top',
                left: 'right',
            })[placement.split('-')[0]] || 'bottom',
        [placement],
    );

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
                            'z-[2100] max-w-52 rounded-lg border p-2 text-center text-sm drop-shadow-md',
                            {
                                'border-slate-200 bg-white text-slate-950':
                                    mode === 'light',
                                'border-slate-600 bg-slate-700 text-white':
                                    mode === 'dark',
                            },
                            contentClassName,
                        )}
                    >
                        {outerContent}
                        <div
                            ref={(instance) => setArrowEl(instance)}
                            className={classNames(
                                'absolute size-4 rotate-45',
                                {
                                    'border-slate-200 bg-white':
                                        mode === 'light',
                                    'border-slate-600 bg-slate-700':
                                        mode === 'dark',
                                    'border-b border-e':
                                        staticSide === 'bottom',
                                    'border-e border-t': staticSide === 'right',
                                    'border-b border-s': staticSide === 'left',
                                    'border-s border-t': staticSide === 'top',
                                },
                                arrowClassName,
                            )}
                            style={{
                                left: middlewareData.arrow?.x,
                                ...(arrowIsVerticalCentered && {
                                    top: middlewareData.arrow?.y,
                                }),
                                ...(!arrowIsVerticalCentered && { bottom: 15 }),
                                [staticSide]: '-8px',
                            }}
                        />
                        {content}
                    </span>
                </FloatingPortal>
            )}
        </>
    );
};
