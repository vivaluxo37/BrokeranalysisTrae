import classNames from 'classnames';
import React from 'react';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import {
    ASSISTANT_CONTEXT_ON_OPEN,
    ASSISTANT_ELEMENT_ID,
    ASSISTANT_ENTRY_POINT_MEASUREMENT_ID,
    ASSISTANT_ENTRY_POINT_SUGGESTED_QUERY,
} from '../consts/measurementIds';
import { useAssistantInteractions } from '../hooks/useAssistantInteractions';
import { SuggestedQuery } from '../types/SuggestedQuery';

export const SuggestedQueries: React.FC<{
    queries: SuggestedQuery[];
    className?: string;
}> = ({ queries, className }) => {
    const { onOpenWithNewChat } = useAssistantInteractions();

    const submitQueryHandler = async (
        query: string,
        suggestedQueryIndex: number,
    ) => {
        await onOpenWithNewChat(
            query,
            getGeneralElementClickEventData({
                measurementListId: suggestedQueryIndex
                    ? `${ASSISTANT_ENTRY_POINT_SUGGESTED_QUERY}_${suggestedQueryIndex}`
                    : ASSISTANT_ENTRY_POINT_MEASUREMENT_ID,
                elementId: ASSISTANT_ELEMENT_ID,
                context: ASSISTANT_CONTEXT_ON_OPEN,
            }),
        );
    };

    return (
        <div
            className={classNames(
                className,
                'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
            )}
        >
            {queries.map(({ text, emoji }, index) => (
                <button
                    key={text}
                    type="button"
                    className="flex w-full min-w-0 items-center justify-center gap-2 text-wrap break-words rounded-lg border border-slate-200 bg-white p-2 text-left text-sm hover:border-slate-400 hover:drop-shadow-md"
                    onClick={() => submitQueryHandler(text, index + 1)}
                >
                    <span className="text-xl">{emoji}</span>
                    {text}
                </button>
            ))}
        </div>
    );
};
