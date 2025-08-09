import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getGeneralElementClickEventData } from '../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../util/measurement/functions/sendGA4Event';
import { Image } from '../../elements/Image';
import { FacebookIcon } from '../../icons/FacebookIcon';
import GoogleIcon from './assets/google-icon.svg';

export const RegistrationBox: FC<{
    className?: string;
    onClose?: () => void;
    title: string;
    description?: string;
    measurementListId: string;
    compact?: boolean;
}> = ({
    className,
    onClose,
    title,
    description,
    measurementListId,
    compact,
}) => {
    const { t } = useTranslation();
    const sendEventOnClick = useCallback(
        (elementId: string) => {
            const event = getGeneralElementClickEventData({
                measurementListId,
                elementId,
            });

            sendGA4Event(event);
        },
        [measurementListId],
    );

    const socialButtons = useMemo(
        () => (
            <>
                <ButtonOrLink
                    text="register with google"
                    variant="stroke"
                    size="sm"
                    className={classNames('w-full grow', compact && 'h-8')}
                    href="/auth/google/redirect"
                    onClick={() =>
                        sendEventOnClick('registration with google button')
                    }
                >
                    <Image
                        imageSrc={GoogleIcon}
                        alt="Google icon"
                        className="size-5"
                    />
                </ButtonOrLink>
                <ButtonOrLink
                    text="register with facebook"
                    variant="stroke"
                    size="sm"
                    className={classNames('w-full grow', compact && 'h-8')}
                    href="/auth/facebook/redirect"
                    onClick={() =>
                        sendEventOnClick('registration with facebook button')
                    }
                >
                    <FacebookIcon className="size-5" />
                </ButtonOrLink>
            </>
        ),
        [compact, sendEventOnClick],
    );

    return (
        <div
            className={classNames(
                'flex flex-col gap-6 p-3 text-slate-600',
                className,
            )}
        >
            <div className="flex justify-between gap-2">
                <div className="flex flex-col gap-2">
                    <div
                        className={classNames(
                            'font-semibold text-slate-800',
                            compact
                                ? 'text-base lg:text-lg'
                                : 'text-lg lg:text-2xl',
                        )}
                    >
                        {title}
                    </div>
                    {description && (
                        <div
                            className={classNames(
                                compact
                                    ? 'text-sm lg:text-base'
                                    : 'text-base lg:text-lg',
                            )}
                        >
                            {description}
                        </div>
                    )}
                </div>
                {onClose && (
                    <ButtonOrLink
                        text="Close"
                        mode="light"
                        variant="tertiary"
                        size="md"
                        className="mt-0 h-4 w-4 lg:mt-0.5"
                        onClick={onClose}
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </ButtonOrLink>
                )}
            </div>
            <div
                className={classNames(
                    'flex w-full items-center',
                    compact ? 'gap-2' : 'flex-col gap-1',
                )}
            >
                {compact ? (
                    socialButtons
                ) : (
                    <div className="flex w-full gap-2">{socialButtons}</div>
                )}
                {!compact && <div className="text-sm">{t('or')}</div>}
                <ButtonOrLink
                    text="register with email"
                    variant="stroke"
                    size="sm"
                    className={classNames('w-full text-sm', compact && 'h-8')}
                    href="/register"
                    withRightArrow={!compact}
                    onClick={() =>
                        sendEventOnClick('registration with email button')
                    }
                >
                    {compact ? (
                        <EnvelopeIcon className="size-5" />
                    ) : (
                        t('Sign up with email')
                    )}
                </ButtonOrLink>
            </div>
        </div>
    );
};
