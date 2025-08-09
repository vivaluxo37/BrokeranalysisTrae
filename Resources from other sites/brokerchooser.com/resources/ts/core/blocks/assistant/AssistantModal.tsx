import classNames from 'classnames';
import React, { FC, useMemo, useRef, useState } from 'react';
import { Breakpoints } from '../../consts/Breakpoints';
import { Dialog } from '../../elements/Dialog';
import { useGlobalStore } from '../../globalStore/globalStore';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useIsRtl } from '../../hooks/useIsRtl';
import { useUserHandling } from '../navbar/hooks/useUserHandling';
import { AssistantMinimizedModal } from './blocks/assistantMinimizedModal/AssistantMinimizedModal';
import { AssistantPlanPromoModal } from './blocks/assistantPlanPromo/AssistantPlanPromoModal';
import { AssistantPlanPromoStrip } from './blocks/assistantPlanPromo/AssistantPlanPromoStrip';
import { AssistantChatBubble } from './elements/AssistantChatBubble';
import { AssistantInputBar } from './elements/AssistantInputBar';
import { AssistantModalAbsoluteOverlay } from './elements/AssistantModalAbsoluteOverlay';
import { AssistantModalHeader } from './elements/AssistantModalHeader';
import { AssistantViewSwitcher } from './elements/AssistantViewSwitcher';
import { ConnectionError } from './elements/ConnectionError';
import { HamburgerMenuButton } from './elements/HamburgerMenuButton';
import { MinimizeAssistantButton } from './elements/MinimizeAssistantButton';
import { useAssistantChatBubble } from './hooks/useAssistantChatBubble';
import { useAssistantInteractions } from './hooks/useAssistantInteractions';
import { useAssistantModal } from './hooks/useAssistantModal';
import { useAssistantUnreadMessageHandling } from './hooks/useAssistantUnreadMessageHandling';
import { useThreadFeedback } from './hooks/useThreadFeedback';

export const AssistantModal: FC<{
    totalUnreadMessages: number;
    shouldOpenAutomatically: boolean;
}> = ({
    totalUnreadMessages: initialNrOfUnreadMessages,
    shouldOpenAutomatically,
}) => {
    const {
        isOpen,
        isSidebarOpen,
        shouldDisplayMinimizedModal,
        shouldShowConnectionError,
        toggleSidebar,
        isFullWidthView,
    } = useAssistantModal(shouldOpenAutomatically);

    const { totalUnreadMessages } = useAssistantUnreadMessageHandling({
        initialNrOfUnreadMessages,
    });

    const { shouldHide } = useAssistantChatBubble();

    const { onMinimize } = useAssistantInteractions();

    const isMobileLayout = useIsMobile(Breakpoints.lg);

    const isRtl = useIsRtl();

    const assistantModalBodyRef = useRef<HTMLDivElement>(null);
    useThreadFeedback(assistantModalBodyRef);

    const isAssistantPlanPromoModalOpen = useGlobalStore(
        (state) => state.assistant.chat.isAssistantPlanPromoModalOpen,
    );

    const handleCloseAssistantPlanPromoModal = useGlobalStore(
        (state) =>
            state.assistant.chat.actions.handleCloseAssistantPlanPromoModal,
    );

    const transitionStyleProps = useMemo(
        () => ({
            duration: {
                open: 800,
                close: 400,
            },
            initial: {
                opacity: 0,
                transform: 'scale(0.1) translateY(400px) translateX(400px)',
            },
            common: {
                transformOrigin: isRtl ? 'bottom left' : 'bottom right',
            },
        }),
        [isRtl],
    );

    const { user } = useUserHandling();

    const [
        assistantPlanPromoStripPresented,
        setAssistantPlanPromoStripPresented,
    ] = useState(true);

    return (
        <>
            {!shouldHide && (
                <AssistantChatBubble
                    totalUnreadMessages={totalUnreadMessages}
                />
            )}
            {shouldDisplayMinimizedModal && (
                <AssistantMinimizedModal
                    totalUnreadMessages={totalUnreadMessages}
                />
            )}
            <AssistantPlanPromoModal
                isOpen={isAssistantPlanPromoModalOpen}
                onDialogClose={handleCloseAssistantPlanPromoModal}
            />
            <Dialog
                dialogClasses="relative flex lg:aspect-video justify-center rounded-lg p-4 lg:p-8 bg-white lg:w-[90dvw] h-[90dvh] w-dvw"
                isComponentVisible={isOpen}
                onDialogClose={onMinimize}
                transitionStyleProps={transitionStyleProps}
            >
                <AssistantModalAbsoluteOverlay>
                    <div
                        ref={assistantModalBodyRef}
                        className="flex size-full flex-col lg:flex-row lg:gap-x-6 lg:gap-y-0"
                        translate="no"
                    >
                        {!isFullWidthView && (
                            <>
                                <HamburgerMenuButton
                                    totalUnreadMessages={totalUnreadMessages}
                                    onClick={toggleSidebar}
                                />
                                <div
                                    className={classNames(
                                        'absolute z-40 flex size-full flex-col gap-y-4 overflow-hidden rounded-3xl lg:relative lg:w-1/4 lg:min-w-80 lg:translate-x-0',
                                        !isSidebarOpen && 'hidden lg:block',
                                    )}
                                >
                                    <AssistantModalHeader
                                        totalUnreadMessages={
                                            totalUnreadMessages
                                        }
                                        onHamburgerButtonClick={toggleSidebar}
                                    />
                                </div>
                            </>
                        )}
                        {!user && assistantPlanPromoStripPresented && (
                            <AssistantPlanPromoStrip
                                onClose={() =>
                                    setAssistantPlanPromoStripPresented(false)
                                }
                            />
                        )}
                        <div
                            className={classNames(
                                'relative flex w-full flex-col gap-y-4 overflow-hidden lg:h-full',
                                isFullWidthView
                                    ? 'bottom-4 h-full w-full lg:bottom-0'
                                    : 'h-[90%] lg:w-3/4',
                            )}
                        >
                            {!isFullWidthView && (
                                <div className="end-0 top-0 z-50 hidden lg:absolute lg:block lg:p-8">
                                    <MinimizeAssistantButton />
                                </div>
                            )}
                            <AssistantViewSwitcher />
                            {shouldShowConnectionError && <ConnectionError />}
                            <AssistantInputBar
                                autoFocus={!isMobileLayout}
                                newChatOnSubmit={false}
                                enableFakeDoor
                            />
                        </div>
                    </div>
                </AssistantModalAbsoluteOverlay>
            </Dialog>
        </>
    );
};
