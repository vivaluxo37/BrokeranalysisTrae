import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
    getGeneralElementClickEventData,
    getGeneralElementImpressionEventData,
} from '../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../util/measurement/functions/sendGA4Event';
import { Dialog } from '../../elements/Dialog';
import { Spinner } from '../../elements/Spinner';
import { useGlobalStore } from '../../globalStore/globalStore';
import { getGeoAlternativeModalData } from './api/api';
import { GeoAlternativeModalContent } from './blocks/GeoAlternativeModalContent';
import { GeoAlternativeModalData } from './types/types';

export const GeoAlternativeModal = () => {
    const { t } = useTranslation();
    const { brokerId, setBrokerId } = useGlobalStore(
        (state) => state.geoAlternativeModal,
    );
    const [modalData, setModalData] = useState<GeoAlternativeModalData | null>(
        null,
    );
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!brokerId) {
            return;
        }

        setModalData(null);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        getGeoAlternativeModalData({
            brokerId,
            signal: abortController.signal,
        })
            .then((response) => {
                setModalData(response);
                const event = getGeneralElementImpressionEventData({
                    measurementListId: 'geo alternative modal',
                    context: JSON.stringify({
                        broker: response.broker.name,
                        alternativeBroker: response.alternativeBroker.name,
                    }),
                });

                sendGA4Event(event);
            })
            .catch(() => {
                setModalData(null);
                setBrokerId(undefined);
                toast(t('Oops..., something went wrong'));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brokerId]);

    const closeModal = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setBrokerId(undefined);
        const event = getGeneralElementClickEventData({
            measurementListId: 'close geo alternative modal',
        });
        sendGA4Event(event);
    }, [setBrokerId]);

    return (
        <Dialog
            isComponentVisible={!!brokerId}
            onDialogClose={closeModal}
            dialogClasses="bg-slate-100 rounded-lg relative min-w-40 min-h-40 flex justify-center items-center"
            testId="geo-alternative-modal"
        >
            <ButtonOrLink
                text="close modal"
                onClick={closeModal}
                variant="tertiary"
                className="absolute end-0.5 top-0.5 size-12 sm:end-1 sm:top-1"
                testId="geo-alternative-modal-close-button"
            >
                <XMarkIcon className="size-5 rounded border-slate-200 sm:size-6" />
            </ButtonOrLink>
            {modalData ? (
                <GeoAlternativeModalContent
                    broker={modalData.broker}
                    alternativeBroker={modalData.alternativeBroker}
                    countryTranslatedTheName={
                        modalData.countryTranslatedTheName
                    }
                />
            ) : (
                <Spinner size="small" testId="geo-alternative-modal-spinner" />
            )}
        </Dialog>
    );
};
