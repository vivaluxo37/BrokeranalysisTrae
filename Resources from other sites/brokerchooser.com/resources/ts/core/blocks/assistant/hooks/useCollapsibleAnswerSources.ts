import { take } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { ASSISTANT_SOURCES_MEASUREMENT_LIST_ID } from '../consts/measurementIds';
import { AnswerSource } from '../types/AnswerSource';

const MAX_MESSAGES_BEFORE_COLLAPSE = 3;

export const useCollapsibleAnswerSources = (
    sources: AnswerSource[],
    messageId: number,
) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

    const shouldDisplayShowMoreButton = useMemo(
        () => sources.length > MAX_MESSAGES_BEFORE_COLLAPSE,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const sourcesToDisplay = useMemo(
        () =>
            isCollapsed ? take(sources, MAX_MESSAGES_BEFORE_COLLAPSE) : sources,
        [isCollapsed, sources],
    );

    const handleCollapseButtonClick = useCallback(
        () => setIsCollapsed((prevState) => !prevState),
        [],
    );

    const handleSourceItemClick = useCallback(
        (sourceUrl: string) => {
            const event = getGeneralElementClickEventData({
                measurementListId: ASSISTANT_SOURCES_MEASUREMENT_LIST_ID,
                elementId: sourceUrl,
                context: `${messageId}`,
            });

            sendGA4Event(event);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return {
        isCollapsed,
        shouldDisplayShowMoreButton,
        sourcesToDisplay,
        handleCollapseButtonClick,
        handleSourceItemClick,
    };
};
