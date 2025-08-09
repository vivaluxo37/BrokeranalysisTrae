import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SHORTLIST_ID } from '../../../../personalPage/consts/dashboardConsts';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';

export const SaveBrokerToastMessage: FC<{
    measurementListId: string;
    messageText: string;
}> = ({ measurementListId, messageText }) => {
    const { t } = useTranslation();

    const toastEvent = () => {
        const event = getGeneralElementClickEventData({
            measurementListId,
        });

        sendGA4Event(event);
    };

    return (
        <div>
            {messageText}{' '}
            <a
                href={`/personal-page#${SHORTLIST_ID}`}
                className="underline"
                onClick={toastEvent}
            >
                {t('shortlist')}
            </a>
        </div>
    );
};
