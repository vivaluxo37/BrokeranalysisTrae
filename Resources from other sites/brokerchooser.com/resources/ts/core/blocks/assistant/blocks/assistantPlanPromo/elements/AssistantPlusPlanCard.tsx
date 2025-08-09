import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Image } from '../../../../../elements/Image';
import GoogleIcon from '../../../../registrationBox/assets/google-icon.svg';
import { ASSISTANT_PLAN_REGISTRATION_PROMO_BUTTON } from '../../../consts/measurementIds';
import { AssistantPlanBenefitList } from './AssistantPlanBenefitList';
import { AssistantPlanPromoCard } from './AssistantPlanPromoCard';
import { AssistantPlusBadge } from './AssistantPlusBadge';

export const AssistantPlusPlanCard: FC<{ className?: string }> = ({
    className,
}) => {
    const { t } = useTranslation();

    const proList = useMemo<string[]>(
        () => [
            t('Everything in Nuri Lite'),
            t('Saved past conversations'),
            t('Suggestions based on user history'),
            t('Personalized AI responses'),
            t('Early beta access'),
        ],
        [t],
    );

    return (
        <AssistantPlanPromoCard
            className={classNames(
                'max-w-[480px] bg-white shadow-lg',
                className,
            )}
        >
            <div className="flex justify-end">
                <div className="rounded bg-primary-400 px-2 py-1 text-base font-semibold">
                    {t('Limited time offer')}
                </div>
            </div>
            <div>
                <div className="flex gap-1 text-xl font-semibold text-slate-950 md:text-2xl">
                    Nuri AI
                    <AssistantPlusBadge />
                </div>
                <div className="mt-4 gap-2 self-baseline text-base md:mt-9 md:text-xl">
                    <span className="self-baseline text-3xl font-medium text-emerald-600">
                        $0 {t('Free')}{' '}
                    </span>
                    {t('with registration')}
                </div>
                <div className="mt-4 text-lg font-normal text-slate-950">
                    {t(
                        'Register now and get personalized AI-powered insights for free.',
                    )}
                </div>
                <div className="mt-4 flex flex-col gap-3">
                    <TrackedButtonOrLink
                        measurementListId={
                            ASSISTANT_PLAN_REGISTRATION_PROMO_BUTTON
                        }
                        text="register with google"
                        variant="monochrome"
                        size="sm"
                        className="w-full"
                        bodyClassName="items-center flex gap-1 py-1"
                        href="/auth/google/redirect"
                    >
                        <Image
                            imageSrc={GoogleIcon}
                            alt="Google icon"
                            className="size-5"
                        />
                        <span className="font-normal">
                            {t('Register with Google (Free)')}
                        </span>
                    </TrackedButtonOrLink>
                    <TrackedButtonOrLink
                        measurementListId={
                            ASSISTANT_PLAN_REGISTRATION_PROMO_BUTTON
                        }
                        text="register with email"
                        size="sm"
                        variant="stroke"
                        className="w-full"
                        bodyClassName="items-center flex gap-1 py-1"
                        href="/register"
                    >
                        <EnvelopeIcon className="size-5" />
                        <span className="font-normal">
                            {t('Register with Email (Free)')}
                        </span>
                    </TrackedButtonOrLink>
                    <div className="w-full text-center text-xs">
                        {/* prettier-ignore */}
                        <Trans i18nKey="By signing up, you agree with our <1>Privacy Policy</1>.">
                            By signing up, you agree with our <a
                                href="https://www.iubenda.com/privacy-policy/8253309/full-legal"
                                target="_blank"
                                rel="nofollow"
                                className="underline"
                            >Privacy Policy</a>.
                        </Trans>
                    </div>
                </div>
                <AssistantPlanBenefitList
                    list={proList}
                    className="py-6 md:py-12"
                />
                <p className="text-lg font-normal text-slate-950">
                    {t('Smarter investing starts here 🚀')}
                </p>
            </div>
        </AssistantPlanPromoCard>
    );
};
