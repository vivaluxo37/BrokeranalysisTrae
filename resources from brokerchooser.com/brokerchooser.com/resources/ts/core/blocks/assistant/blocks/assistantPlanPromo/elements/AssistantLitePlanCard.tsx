import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AssistantPlanBenefitList } from './AssistantPlanBenefitList';
import { AssistantPlanPromoCard } from './AssistantPlanPromoCard';

export const AssistantLitePlanCard: FC<{ className?: string }> = ({
    className,
}) => {
    const { t } = useTranslation();

    const liteList = useMemo<string[]>(
        () => [
            t('Unlimited AI chats'),
            t('AI-Powered broker match'),
            t('Broker comparison'),
        ],
        [t],
    );

    return (
        <AssistantPlanPromoCard
            className={classNames('my-8 border border-slate-300', className)}
        >
            <div className="h-6" />
            <div>
                <div className="text-xl font-semibold text-slate-950 md:text-2xl">
                    Nuri AI Lite{' '}
                    <span className="text-lg font-normal text-slate-500">
                        - {t('Your current plan')}
                    </span>
                </div>
                <div className="mt-4 flex gap-2 text-base font-medium text-slate-950 md:mt-9 md:text-xl">
                    <span>$0</span>
                    <span>{t('Free for lifetime')}</span>
                </div>
                <div className="mt-4 text-lg font-normal text-slate-950">
                    {t(
                        'Get free, unlimited access to Nuri AI for fast and reliable financial guidance',
                    )}
                </div>
                <div className="flex flex-col gap-2 py-6 md:py-12">
                    <AssistantPlanBenefitList
                        list={liteList}
                        className="py-6 md:py-12"
                    />
                </div>
            </div>
        </AssistantPlanPromoCard>
    );
};
