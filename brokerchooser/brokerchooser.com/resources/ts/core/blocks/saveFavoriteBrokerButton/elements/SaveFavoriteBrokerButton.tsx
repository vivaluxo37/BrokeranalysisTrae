import { BookmarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '../../../../components/tailwind/atom/Button';
import { reportError } from '../../../../logic/util/error/reportError';
import {
    getGeneralElementClickEventData,
    getGeneralElementImpressionEventData,
} from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { useBCClientSideData } from '../../../hooks/useBCClientSideData';
import { useHumanEyeEffectOnRef } from '../../../hooks/useHumanEyeEffect';
import { Broker } from '../../../types/commonTypes';
import { SaveFavoriteProviderButtonContext } from '../contexts/SaveFavoriteProviderButtonContext';
import { NotRegisteredDialog } from './NotRegisteredDialog';
import { SaveBrokerToastMessage } from './SaveBrokerToastMessage';

export const SaveFavoriteBrokerButton: FC<{
    brokerId: Broker['id'];
    brokerName: Broker['name'];
    onSaveSuccess?: () => void;
}> = ({ brokerId, onSaveSuccess, brokerName }) => {
    const { t } = useTranslation();

    const { savedProviderIds, saveProvider } = useContext(
        SaveFavoriteProviderButtonContext,
    );

    const { user } = useBCClientSideData();

    const [isLoading, setIsLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const isProviderSaved = useMemo(
        () => savedProviderIds.indexOf(brokerId) > -1,
        [savedProviderIds, brokerId],
    );

    const handleClick = useCallback(async () => {
        if (!user && !isProviderSaved) {
            setShowDialog(true);
        }

        setIsLoading(true);
        try {
            await saveProvider(brokerId, isProviderSaved);

            const event = getGeneralElementClickEventData({
                measurementListId: 'review save broker button',
                elementId: `${brokerId}`,
                context: isProviderSaved ? 'unsave' : 'save',
            });

            sendGA4Event(event);

            if (user) {
                toast(
                    <SaveBrokerToastMessage
                        measurementListId={
                            isProviderSaved
                                ? 'unsave broker toast message shortlist link'
                                : 'Save broker toast message shortlist link'
                        }
                        messageText={
                            isProviderSaved
                                ? t('[brokerName] removed from', {
                                      brokerName,
                                  })
                                : t('[brokerName] added to', { brokerName })
                        }
                    />,
                );
            }
        } finally {
            onSaveSuccess?.();

            setIsLoading(false);
        }
    }, [isLoading, brokerId, isProviderSaved, setIsLoading, reportError]);

    const onVisible = useCallback(() => {
        const impressionEvent = getGeneralElementImpressionEventData({
            measurementListId: 'saved providers',
            elementId: 'review save button',
        });

        sendGA4Event(impressionEvent);
    }, []);
    const ref = useHumanEyeEffectOnRef(onVisible);

    const IconLeft = useCallback(
        () => (
            <BookmarkIcon
                className={classNames(
                    'me-2 h-5 w-5 self-center text-secondary-500',
                    isProviderSaved && 'fill-secondary-500',
                )}
            />
        ),
        [isProviderSaved],
    );

    const buttonLabel = isProviderSaved
        ? t('saved to shortlist')
        : t('save to shortlist');

    return (
        <div className="flex w-full items-center justify-center" translate="no">
            <div ref={ref} className="flex flex-col items-center">
                <Button
                    size="medium"
                    variant="borderless-text-button"
                    className="w-full font-semibold"
                    text={buttonLabel}
                    onClick={handleClick}
                    IconLeft={IconLeft}
                    isLoading={isLoading}
                />
            </div>
            <NotRegisteredDialog
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                measurementListId="watchlist not registered dialog"
            />
        </div>
    );
};
