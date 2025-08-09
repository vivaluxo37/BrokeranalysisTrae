import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { RegistrationBox } from '../../registrationBox/RegistrationBox';
import { useAssistantInteractions } from '../hooks/useAssistantInteractions';
import { SkeletonMessageOverlay } from './SkeletonMessageOverlay';

export const AssistantRegisterPopup: FC = () => {
    const { t } = useTranslation();
    const { onOpenWithActiveChat } = useAssistantInteractions();

    const handleClose = useCallback(() => {
        const event = getGeneralElementClickEventData({
            measurementListId: 'assistant register popup close',
        });
        onOpenWithActiveChat(event).then();
    }, [onOpenWithActiveChat]);

    return (
        <SkeletonMessageOverlay>
            <div className="max-w-xs rounded-lg bg-white shadow-lg">
                <RegistrationBox
                    onClose={handleClose}
                    title={t(
                        'Sign up to unlock your previous chats with Nuri!',
                    )}
                    measurementListId="assistant popup registration box"
                    compact
                    className="rounded-lg"
                />
            </div>
        </SkeletonMessageOverlay>
    );
};
