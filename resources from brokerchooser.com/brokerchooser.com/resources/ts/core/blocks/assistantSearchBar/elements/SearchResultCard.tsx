import moment from 'moment';
import React, { FC } from 'react';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { AnswerSource } from '../../assistant/types/AnswerSource';
import { ASSISTANT_SEARCH_RESULTS_MEASUREMENT_LIST_ID } from '../consts/measurementIds';

export const SearchResultCard: FC<{ index: number; result: AnswerSource }> = ({
    index,
    result,
}) => {
    const { title, url, description, dateModified } = result;

    const formattedDate = moment(dateModified).format('MMM d. Y');

    const handleCardClick = () => {
        const event = getGeneralElementClickEventData({
            measurementListId: ASSISTANT_SEARCH_RESULTS_MEASUREMENT_LIST_ID,
            elementId: url,
            positionIndex: index,
        });

        sendGA4Event(event);
    };

    return (
        <a
            className="group rounded-lg p-4 transition-all hover:bg-slate-50"
            href={url}
            onClick={handleCardClick}
            target="_blank"
        >
            <div key={title} className="flex flex-col gap-y-2">
                <span className="text-xl font-semibold group-hover:text-secondary-500">
                    {title}
                </span>
                {description}
                <span className="text-xs text-slate-600">{formattedDate}</span>
            </div>
        </a>
    );
};
