import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../../../elements/Dialog';
import { useGlobalStore } from '../../../../globalStore/globalStore';
import { useUserHandling } from '../../../navbar/hooks/useUserHandling';

export const AssistantFakeDoorModal = () => {
    const { t } = useTranslation();
    const { user } = useUserHandling();

    const fakeDoorModalVariant = useGlobalStore(
        (state) => state.assistant.common.fakeDoorModalVariant,
    );
    const setFakeDoorModalVariantToDisplay = useGlobalStore(
        (state) =>
            state.assistant.common.actions.setFakeDoorModalVariantToDisplay,
    );

    const closeFakeDoorModal = useCallback(() => {
        setFakeDoorModalVariantToDisplay(undefined);
    }, [setFakeDoorModalVariantToDisplay]);

    return (
        <Dialog
            dialogClasses="max-w-[360px] flex rounded-lg shadow-lg flex-col bg-white text-black z-50"
            isComponentVisible={fakeDoorModalVariant !== undefined}
            onDialogClose={closeFakeDoorModal}
        >
            <TrackedButtonOrLink
                text=""
                variant="tertiary"
                bodyClassName="!p-2.5"
                className="ms-auto !p-0"
                onClick={closeFakeDoorModal}
                measurementListId="assistant fake door modal"
                elementId="close button"
                context={`${fakeDoorModalVariant} variant`}
            >
                <XMarkIcon className="size-5" />
            </TrackedButtonOrLink>
            <div className="flex flex-col gap-y-6 p-6 pt-0">
                <p className="text-2xl font-semibold leading-snug text-slate-700">
                    {t('🎉 Nice catch! You caught us dreaming...')}
                </p>
                <p>
                    {t(
                        'This feature isn’t ready yet, but your click just made our day! Thanks for the feedback! 🚀',
                    )}
                </p>
                {user === null ? (
                    <TrackedButtonOrLink
                        text={t('Sign up to get notified')}
                        href="/register"
                        variant="monochrome"
                        measurementListId="assistant fake door modal"
                        elementId="sign up button"
                        context={`${fakeDoorModalVariant} variant`}
                    />
                ) : (
                    <TrackedButtonOrLink
                        text={t('Continue chat')}
                        onClick={closeFakeDoorModal}
                        variant="monochrome"
                        measurementListId="assistant fake door modal"
                        elementId="continue chat button"
                        context={`${fakeDoorModalVariant} variant`}
                    />
                )}
            </div>
        </Dialog>
    );
};
