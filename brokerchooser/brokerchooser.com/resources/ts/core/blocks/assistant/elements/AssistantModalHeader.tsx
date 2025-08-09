import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { Tooltip } from '@design-system/components/surfaces/tooltip/Tooltip';
import {
    PlusIcon,
    RectangleStackIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { useUserHandling } from '../../navbar/hooks/useUserHandling';
import { AssistantPlanPromoButton } from '../blocks/assistantPlanPromo/AssistantPlanPromoButton';
import { ModalViewType } from '../consts/ModalViewType';
import {
    ASSISTANT_DISCOVER_MEASUREMENT_LIST_ID,
    ASSISTANT_NEWTHREAD_MEASUREMENT_LIST_ID,
} from '../consts/measurementIds';
import { useAssistantInteractions } from '../hooks/useAssistantInteractions';
import { AssistantName } from './AssistantName';
import { DiscoverIcon } from './DiscoverIcon';
import { HamburgerMenuButton } from './HamburgerMenuButton';
import { ThreadListSection } from './ThreadListSection';

export const AssistantModalHeader: React.FC<{
    onHamburgerButtonClick: () => void;
    totalUnreadMessages: number;
}> = ({ onHamburgerButtonClick, totalUnreadMessages }) => {
    const { t } = useTranslation();
    const { user } = useUserHandling();
    const { onOpen, onOpenWithNewChat, onDiscoverClick } =
        useAssistantInteractions();

    const threads = useGlobalStore((state) => state.assistant.chat.threads);
    const view = useGlobalStore((state) => state.assistant.common.view);

    return (
        <div className="flex size-full flex-col rounded-3xl bg-white p-4 lg:p-8">
            <AssistantName className="hidden lg:flex" />
            <HamburgerMenuButton
                totalUnreadMessages={totalUnreadMessages}
                onClick={onHamburgerButtonClick}
                Icon={XMarkIcon}
                className="!p-0"
            />
            <p className="mt-3 text-sm text-slate-500">
                {t(
                    'Meet Nuri, your AI guide to investing. Backed by BrokerChooser’s trusted expertise, Nuri uses advanced AI to provide personalized help and answers.',
                )}
            </p>
            <Tooltip
                content={t('Start a new blank chat in Nuri')}
                position="top"
                className="mt-6"
                trackingProps={{
                    measurementListId: 'assistant header new chat tooltip',
                }}
            >
                <ButtonOrLink
                    text={t('New chat')}
                    IconLeft={PlusIcon}
                    iconClassName="size-5"
                    disabled={view === ModalViewType.NEW_CHAT}
                    className="w-full !justify-start"
                    variant="stroke"
                    onClick={() =>
                        onOpenWithNewChat(undefined, {
                            measurementListId:
                                ASSISTANT_NEWTHREAD_MEASUREMENT_LIST_ID,
                            eventName: 'click',
                            elementId: 'search',
                            context: 'sessionId',
                        })
                    }
                />
            </Tooltip>
            <Tooltip
                content={t('Discover the hottest investment topics in Nuri')}
                trackingProps={{
                    measurementListId: 'assistant header discover tooltip',
                }}
            >
                <ButtonOrLink
                    text={t('Discover')}
                    IconLeft={DiscoverIcon}
                    iconClassName={classNames('size-5', {
                        '!fill-secondary-500': view === ModalViewType.DISCOVER,
                    })}
                    className={classNames('mt-2 w-full !justify-start', {
                        '!text-secondary-500': view === ModalViewType.DISCOVER,
                    })}
                    variant="tertiary"
                    onClick={() =>
                        onDiscoverClick({
                            measurementListId:
                                ASSISTANT_DISCOVER_MEASUREMENT_LIST_ID,
                            eventName: 'click',
                            elementId: 'search',
                        })
                    }
                />
            </Tooltip>
            {threads.length > 0 && (
                <ThreadListSection
                    title={t('Previous chats')}
                    Icon={RectangleStackIcon}
                    onThreadItemClick={onOpen}
                    threads={threads}
                    className="mt-3"
                />
            )}
            {!user && <AssistantPlanPromoButton />}
        </div>
    );
};
