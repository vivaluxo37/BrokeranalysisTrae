import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { Tooltip } from '@design-system/components/surfaces/tooltip/Tooltip';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../../../globalStore/globalStore';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { SparklesIconColored } from '../../elements/icons/SparklesIconColored';

export const AssistantPlanPromoButton: FC = () => {
    const { t } = useTranslation();

    const handleOpenPlanRegistrationPushButtonClick = useGlobalStore(
        (state) =>
            state.assistant.chat.actions
                .handleOpenPlanRegistrationPushButtonClick,
    );
    const isFirstTimeOpeningModal = useGlobalStore(
        (state) => state.assistant.chat.isFirstTimeOpeningModal,
    );

    const isMobile = useIsMobile();

    // we need this in order to keep the initial value of isFirstTimeOpeningModal, because it will change after the modal has been opened, and the animation wouldn't play.
    // TODO: we might be able to make this nicer, after we optimize the assistant slice
    const [shouldFade] = useState(isFirstTimeOpeningModal);
    const [hidden, setHidden] = useState(isFirstTimeOpeningModal);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHidden(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Tooltip
            position="top"
            className={classNames('mt-auto w-full', {
                'animate-fade': shouldFade && !isMobile,
                hidden: hidden && !isMobile,
            })}
            content={t('Register for free and get personalized AI responses.')}
        >
            <TrackedButtonOrLink
                text="get nuri plus"
                onClick={handleOpenPlanRegistrationPushButtonClick}
                variant="secondary"
                measurementListId="assistant header plan registration push"
                className="relative w-full !justify-start !p-1"
                bodyClassName="!px-0 flex items-center gap-2 text-sm font-semibold"
            >
                <div className="absolute left-0 h-full w-full animate-assistant-promo-button-ping rounded-lg bg-blue-500 opacity-75" />
                <div className="z-10 flex size-14 shrink-0 rounded-md bg-white">
                    <SparklesIconColored className="m-auto size-9" />
                </div>
                <span className="z-10 text-wrap text-start">
                    {t(
                        'Unlock [planName] – Get Personalized Insights for FREE!',
                        {
                            planName: 'Nuri Plus',
                        },
                    )}
                </span>
            </TrackedButtonOrLink>
        </Tooltip>
    );
};
