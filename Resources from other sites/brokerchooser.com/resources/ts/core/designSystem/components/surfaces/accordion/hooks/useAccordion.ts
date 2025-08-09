import { useCallback, useEffect, useState } from 'react';
import { getGeneralElementClickEventData } from '../../../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../../../util/measurement/functions/sendGA4Event';

export const useAccordion = (
    id: string,
    onClick?: (id: string, open: boolean) => void,
    measurementListId?: string,
    initialOpen?: boolean,
) => {
    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        if (initialOpen !== undefined) {
            setShowContent(initialOpen);
        }
    }, [initialOpen]);

    const handleOnClick = useCallback(() => {
        if (measurementListId) {
            const event = getGeneralElementClickEventData({
                measurementListId,
                elementId: id,
                context: !showContent ? 'open' : 'close',
            });
            sendGA4Event(event);
        }

        setShowContent(!showContent);
        onClick?.(id, !showContent);
    }, [id, measurementListId, onClick, showContent]);

    return { showContent, toggleItem: handleOnClick };
};
