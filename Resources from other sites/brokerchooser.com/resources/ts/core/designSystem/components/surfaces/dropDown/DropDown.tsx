import { DropDownRefType } from '@design-system/components/surfaces/dropDown/types';
import {
    autoUpdate,
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    offset,
    Placement,
    shift,
    useDismiss,
    useFloating,
    useInteractions,
    useTransitionStyles,
} from '@floating-ui/react';
import classNames from 'classnames';
import React, {
    forwardRef,
    ReactNode,
    useCallback,
    useImperativeHandle,
    useState,
} from 'react';
import { getGeneralElementClickEventData } from '../../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../../util/measurement/functions/sendGA4Event';

export const DropDown = forwardRef<
    DropDownRefType,
    {
        measurementListId: string;
        elementId?: string;
        childClassName?: string;
        boxClassName?: string;
        overlayClassName?: string;
        boxContent: ReactNode;
        children: (isOpen: boolean) => ReactNode;
        crossAxis?: number;
        mainAxis?: number;
        onOpenStateChange?: (isOpen: boolean) => void;
        anchoredToOpener?: boolean;
        placement?: Placement;
        disabled?: boolean;
        lockScroll?: boolean;
        ariaLabel: string;
        closeOnSelect?: boolean;
    }
>(
    (
        {
            children,
            childClassName,
            boxClassName,
            overlayClassName,
            boxContent,
            measurementListId,
            elementId,
            crossAxis,
            mainAxis,
            onOpenStateChange,
            anchoredToOpener = true,
            placement = 'bottom-start',
            disabled,
            lockScroll = false,
            ariaLabel,
            closeOnSelect,
        },
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState(false);

        const handleClick = useCallback(() => {
            if (disabled) {
                return;
            }
            const event = getGeneralElementClickEventData({
                measurementListId,
                elementId,
                context: isOpen ? 'close' : 'open',
            });

            sendGA4Event(event);
            setIsOpen((prevState) => !prevState);
            if (onOpenStateChange) {
                onOpenStateChange(isOpen);
            }
        }, [disabled, measurementListId, elementId, isOpen, onOpenStateChange]);

        const { refs, floatingStyles, context } = useFloating({
            open: isOpen,
            onOpenChange: handleClick,
            placement,
            whileElementsMounted: autoUpdate,
            middleware: [
                offset({
                    mainAxis: mainAxis || 0,
                    crossAxis: crossAxis || 0,
                }),
                shift(),
            ],
        });

        const { isMounted, styles } = useTransitionStyles(context, {
            duration: 300,
            initial: {
                opacity: 0,
            },
        });

        const dismiss = useDismiss(context, {
            outsidePressEvent: 'pointerdown',
        });

        const { getFloatingProps } = useInteractions([dismiss]);

        useImperativeHandle(ref, () => ({
            openChange: handleClick,
            close: () => setIsOpen(false),
        }));

        return (
            <>
                <button
                    ref={refs.setReference}
                    type="button"
                    onClick={handleClick}
                    className={childClassName}
                    aria-label={ariaLabel}
                    disabled={disabled}
                >
                    {children(isOpen)}
                </button>
                {isMounted && (
                    <FloatingPortal>
                        <FloatingOverlay
                            lockScroll={lockScroll}
                            className={classNames('z-50', overlayClassName)}
                        >
                            <FloatingFocusManager
                                context={context}
                                initialFocus={100} // Hack to avoid outline on the first element when clicked with a mouse
                            >
                                <div
                                    ref={refs.setFloating}
                                    style={
                                        anchoredToOpener
                                            ? floatingStyles
                                            : undefined
                                    }
                                    className={classNames(
                                        'outline-none', // The dropdown itself is not an interaction element
                                        boxClassName,
                                    )}
                                    {...getFloatingProps()}
                                >
                                    <div
                                        role="button"
                                        tabIndex={-1}
                                        style={styles}
                                        onClick={() =>
                                            closeOnSelect && setIsOpen(false)
                                        }
                                        onKeyDown={() => {}}
                                    >
                                        {boxContent}
                                    </div>
                                </div>
                            </FloatingFocusManager>
                        </FloatingOverlay>
                    </FloatingPortal>
                )}
            </>
        );
    },
);

DropDown.displayName = 'DropDown';
