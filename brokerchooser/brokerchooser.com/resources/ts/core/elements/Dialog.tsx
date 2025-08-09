import {
    FloatingFocusManager,
    FloatingNode,
    FloatingOverlay,
    FloatingPortal,
    FloatingTree,
    useDismiss,
    useFloating,
    useFloatingNodeId,
    useFloatingParentNodeId,
    useInteractions,
    useTransitionStyles,
    UseTransitionStylesProps,
} from '@floating-ui/react';
import classNames from 'classnames';
import React, { CSSProperties, FC, PropsWithChildren, useMemo } from 'react';

const PopOverComponent: FC<
    PropsWithChildren<{
        isComponentVisible: boolean;
        onDialogClose: () => void;
        dialogClasses?: string;
        transitionStyleProps?: UseTransitionStylesProps;
        onTheTopOfEverything?: boolean;
        testId?: string;
    }>
> = ({
    isComponentVisible,
    onDialogClose,
    dialogClasses,
    children,
    transitionStyleProps,
    onTheTopOfEverything,
    testId,
}) => {
    const nodeId = useFloatingNodeId();

    const { refs, context, floatingStyles } = useFloating({
        nodeId,
        open: isComponentVisible,
        onOpenChange: onDialogClose,
    });

    const { styles: transitionStyles, isMounted } = useTransitionStyles(
        context,
        transitionStyleProps,
    );

    const dismiss = useDismiss(context, {
        bubbles: false,
    });

    const { getFloatingProps } = useInteractions([dismiss]);

    const style: CSSProperties = useMemo(
        () => ({
            ...floatingStyles,
            backgroundColor: 'rgba(31, 41, 55, 0.5)',
            zIndex: onTheTopOfEverything ? 99999999 : 2010, // To appear above Iubenda Consent
            overflow: 'hidden',
            position: 'fixed',
        }),
        [floatingStyles, onTheTopOfEverything],
    );

    return (
        <FloatingNode id={nodeId}>
            {isMounted && (
                <FloatingPortal>
                    <FloatingOverlay
                        lockScroll
                        style={style}
                        className="flex size-full items-center justify-center"
                    >
                        <FloatingFocusManager context={context}>
                            <div
                                ref={refs.setFloating}
                                className={classNames('mx-2', dialogClasses)}
                                style={transitionStyles}
                                {...getFloatingProps()}
                                data-testid={testId}
                            >
                                {children}
                            </div>
                        </FloatingFocusManager>
                    </FloatingOverlay>
                </FloatingPortal>
            )}
        </FloatingNode>
    );
};

export const Dialog: FC<
    PropsWithChildren<{
        isComponentVisible: boolean;
        onDialogClose: () => void;
        dialogClasses?: string;
        transitionStyleProps?: UseTransitionStylesProps;
        onTheTopOfEverything?: boolean;
        testId?: string;
    }>
> = ({
    isComponentVisible,
    onDialogClose,
    children,
    dialogClasses,
    transitionStyleProps,
    onTheTopOfEverything,
    testId,
}) => {
    const parentId = useFloatingParentNodeId();

    if (parentId) {
        return (
            <FloatingTree>
                <PopOverComponent
                    isComponentVisible={isComponentVisible}
                    onDialogClose={onDialogClose}
                    dialogClasses={dialogClasses}
                    transitionStyleProps={transitionStyleProps}
                    onTheTopOfEverything={onTheTopOfEverything}
                    testId={testId}
                >
                    {children}
                </PopOverComponent>
            </FloatingTree>
        );
    }

    return (
        <PopOverComponent
            isComponentVisible={isComponentVisible}
            onDialogClose={onDialogClose}
            dialogClasses={dialogClasses}
            transitionStyleProps={transitionStyleProps}
            onTheTopOfEverything={onTheTopOfEverything}
            testId={testId}
        >
            {children}
        </PopOverComponent>
    );
};
