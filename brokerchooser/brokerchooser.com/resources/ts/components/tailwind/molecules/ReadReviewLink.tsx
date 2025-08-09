import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicBrokerData } from '../../../core/types/commonTypes';
import { useReadReviewArgs } from '../../../util/measurement/hooks/useReadReviewArgs';
import { BCLink } from '../atom/BCLink';
import { ImpressionHandler } from './ImpressionHandler';

export const ReadReviewLink: FC<{
    broker: BasicBrokerData;
    measurementListId: string;
}> = (props) => {
    const { t } = useTranslation();
    // TODO: add auxclick
    const { broker, measurementListId } = props;

    const { onClickHandler, ga4ImpressionEventData, brokerReviewUrl } =
        useReadReviewArgs({
            broker,
            measurementListId,
        });

    return (
        <ImpressionHandler ga4ImpressionEventData={ga4ImpressionEventData}>
            <BCLink newTab href={brokerReviewUrl} onClick={onClickHandler}>
                {t('Read review')}
            </BCLink>
        </ImpressionHandler>
    );
};
