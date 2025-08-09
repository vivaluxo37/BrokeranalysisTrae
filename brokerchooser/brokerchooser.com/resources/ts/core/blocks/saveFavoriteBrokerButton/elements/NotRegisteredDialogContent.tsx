import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BCLink } from '../../../../components/tailwind/atom/BCLink';
import { Button } from '../../../../components/tailwind/atom/Button';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { DialogFrame } from '../../../elements/DialogFrame';

export const NotRegisteredDialogContent: FC<{
    measurementListId: string;
    title: string;
    text: string;
    icon: ReactNode;
}> = ({ measurementListId, title, text, icon }) => {
    const { t } = useTranslation();
    const sendOnClickEvent = (elementId: string) => {
        const event = getGeneralElementClickEventData({
            measurementListId,
            elementId,
        });

        sendGA4Event(event);
    };

    return (
        <DialogFrame className="mx-auto flex flex-col items-center justify-center gap-1">
            {icon}
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-center">{text}</div>
            <Button
                href="/register"
                onClick={() => sendOnClickEvent(`sign up`)}
                text="Sign up"
                variant="secondary"
                className="bc-link-no-decor mt-4"
            />
            <div className="mt-2 text-sm">
                {t('Already have an account?')}{' '}
                <BCLink
                    href="/login"
                    onClick={() => sendOnClickEvent(`log in`)}
                    text="Log in"
                    className="text-sm"
                    disableTextClassNames
                />
            </div>
        </DialogFrame>
    );
};
