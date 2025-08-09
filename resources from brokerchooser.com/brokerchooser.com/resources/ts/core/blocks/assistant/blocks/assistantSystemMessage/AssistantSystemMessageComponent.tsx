import React, { FC } from 'react';
import { SystemMessageType } from '../../consts/SystemMessageType';
import { AssistantSystemMessage } from '../../types/ChatMessageTypes';
import { AssistantSystemFeedbackFollowUpMessageComponent } from './elements/AssistantSystemFeedbackFollowUpMessageComponent';
import { AssistantSystemFeedbackMessageComponent } from './elements/AssistantSystemFeedbackMessageComponent';

export const AssistantSystemMessageComponent: FC<{
    message: AssistantSystemMessage;
}> = ({ message }) => {
    switch (message.type) {
        case SystemMessageType.FEEDBACK:
            return <AssistantSystemFeedbackMessageComponent />;
        case SystemMessageType.FEEDBACK_FOLLOW_UP:
            return <AssistantSystemFeedbackFollowUpMessageComponent />;
        default:
            return null;
    }
};
