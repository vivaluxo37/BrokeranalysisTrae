import {
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useDismiss,
    useFloating,
    useInteractions,
    useTransitionStyles,
} from '@floating-ui/react';
import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export const HalfPageDialogue: FC<
    PropsWithChildren & {
        isOpen: boolean;
        setIsOpen: (open: boolean) => void;
        type: 'left' | 'right';
        isMobile: boolean;
        containerClassName?: string;
    }
> = ({ isOpen, setIsOpen, type, children, isMobile, containerClassName }) => {
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
    });

    const dismiss = useDismiss(context, {
        escapeKey: true,
        outsidePress: true,
    });

    const { getFloatingProps } = useInteractions([dismiss]);

    const { isMounted, styles } = useTransitionStyles(context, {
        initial: {
            left: !isMobile && type === 'left' ? '-100%' : 'unset',
            right: !isMobile && type === 'right' ? '-100%' : 'unset',
            bottom: isMobile ? '-100%' : 'unset',
        },
    });
    if (!isMounted) {
        return null;
    }

    return (
        <FloatingPortal>
            <FloatingOverlay
                style={{
                    ...floatingStyles,
                    position: 'fixed',
                    overflow: 'hidden',
                }}
                className="z-1001 bg-secondary-500/10 backdrop-blur-[2px]"
                lockScroll
            >
                <FloatingFocusManager context={context}>
                    <div
                        ref={refs.setFloating}
                        {...getFloatingProps()}
                        className={classNames(
                            'absolute bottom-0 h-full bg-white transition-transform',
                            {
                                'left-0': type === 'left',
                                'right-0': type === 'right',
                            },
                            containerClassName,
                        )}
                        style={styles}
                    >
                        {children}
                    </div>
                </FloatingFocusManager>
            </FloatingOverlay>
        </FloatingPortal>
    );
};
