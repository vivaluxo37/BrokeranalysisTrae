import React from 'react';
import { useIsAssistantEditFakeDoorAbTestRunning } from '../../../hooks/abTest/specific/useIsAssistantEditFakeDoorAbTestRunning';
import { TrackedFakeDoorButton } from '../blocks/assistantFakeDoor/elements/TrackedFakeDoorButton';
import { FakeDoorVariant } from '../blocks/assistantFakeDoor/types/FakeDoorVariant';
import { UserMessage } from '../types/ChatMessageTypes';

export const UserChatMessageComponent: React.FC<{
    message: UserMessage;
}> = ({ message }) => {
    const shouldShowEditQuestionFakeDoor =
        useIsAssistantEditFakeDoorAbTestRunning();

    return (
        <div className="flex w-full flex-col items-end gap-y-1 lg:gap-y-2 lg:pe-28">
            <div className="w-fit min-w-0 max-w-[80%] text-wrap break-words rounded-lg bg-slate-100 px-3 py-2 xl:max-w-xl">
                {message.text}
            </div>
            {shouldShowEditQuestionFakeDoor && (
                <TrackedFakeDoorButton
                    variant={FakeDoorVariant.EDIT_QUESTION}
                />
            )}
        </div>
    );
};
