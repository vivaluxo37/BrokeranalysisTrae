import React from 'react';
import { MarkdownText } from '../../../elements/MarkdownText';
import { AssistantMessage } from '../types/ChatMessageTypes';
import { AnswerSources } from './AnswerSources';
import { AssistantAnswerSkeleton } from './AssistantAnswerSkeleton';
import { AssistantChatMessageComponentBody } from './AssistantChatMessageComponentBody';
import { AssistantMessageFeedback } from './AssistantMessageFeedback';

export const AssistantChatMessageComponent: React.FC<{
    message: AssistantMessage;
    showFeedback?: boolean;
}> = ({
    message: { id, text, sources, isGenerationFinished },
    message,
    showFeedback = true,
}) => (
    <AssistantChatMessageComponentBody>
        {text === '' ? (
            <AssistantAnswerSkeleton />
        ) : (
            <MarkdownText content={text} />
        )}
        {isGenerationFinished && (
            <>
                {showFeedback && <AssistantMessageFeedback message={message} />}
                {sources !== undefined && sources.length > 0 && (
                    <AnswerSources sources={sources} messageId={id} />
                )}
            </>
        )}
    </AssistantChatMessageComponentBody>
);
