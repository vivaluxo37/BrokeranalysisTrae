import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { Link } from '@design-system/components/navigation/link/Link';
import { Accordion } from '@design-system/components/surfaces/accordion/Accordion';
import { AccordionItemType } from '@design-system/components/surfaces/accordion/types';
import React, { FC, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const FaqSection: FC = () => {
    const { t } = useTranslation();
    const accordionItems = useMemo<AccordionItemType[]>(
        () => [
            {
                title: t('What is BrokerChooser?'),
                id: 'What is BrokerChooser?',
                content: (
                    <div>
                        {t(
                            'BrokerChooser is a dedicated platform that helps investors and traders find the most suitable brokers based on their unique preferences and needs. We provide in-depth, unbiased reviews and comparisons to empower your investment decisions.',
                        )}
                    </div>
                ),
            },
            {
                title: t('How does BrokerChooser select and review brokers?'),
                id: 'How does BrokerChooser select and review brokers?',
                content: (
                    <>
                        {/* prettier-ignore */}
                        <Trans i18nKey="We employ a <1> meticulous and unbiased methodology</1>. Our team conducts thorough research and tests each broker by opening and using live accounts, investing our own money to experience their services first-hand. This ensures our reviews are accurate and trustworthy.">
                            We employ a <Link href="https://brokerchooser.com/methodology"> meticulous and unbiased methodology</Link>. Our team conducts thorough research and tests each broker by opening and using live accounts, investing our own money to experience their services first-hand. This ensures our reviews are accurate and trustworthy.
                        </Trans>
                    </>
                ),
            },
            {
                title: t(
                    'How does BrokerChooser maintain its independence with broker partnerships?',
                ),
                id: 'How does BrokerChooser maintain its independence with broker partnerships?',
                content: (
                    <>
                        {/* prettier-ignore */}
                        <Trans i18nKey="While we have partnerships and may receive compensation, our recommendations remain unbiased and independent, guided by a rigorous, professional methodology. We're committed to transparency, offering our service free to users. For detailed information on our partnerships and remuneration, please see our <1>advertiser disclosure</1>.">
                            While we have partnerships and may receive compensation, our recommendations remain unbiased and independent, guided by a rigorous, professional methodology. We&apos;re committed to transparency, offering our service free to users. For detailed information on our partnerships and remuneration, please see our <Link href="https://brokerchooser.com/advertiser-disclosure">advertiser disclosure</Link>.
                        </Trans>
                    </>
                ),
            },
            {
                title: t(
                    'How can I use BrokerChooser to find the right broker?',
                ),
                id: 'How can I use BrokerChooser to find the right broker?',
                content: (
                    <>
                        {/* prettier-ignore */}
                        <Trans i18nKey="Simply visit our website and explore <1>our extensive reviews</1> and <3>comparisons</3>. You can filter brokers based on specific criteria that matter to you, such as fees, platform features, or investment options. For a more personalized recommendation, try our <5>matching tool</5> that aligns with your investment profile.">
                            Simply visit our website and explore <Link href="https://brokerchooser.com/broker-reviews">our extensive reviews</Link> and <Link href="https://brokerchooser.com/compare">comparisons</Link>. You can filter brokers based on specific criteria that matter to you, such as fees, platform features, or investment options. For a more personalized recommendation, try our <Link href="https://brokerchooser.com/find-my-broker">matching tool</Link> that aligns with your investment profile.
                        </Trans>
                    </>
                ),
            },
        ],
        [t],
    );

    return (
        <SectionWrapper
            outerClassName="bg-white py-20"
            innerClassName="flex flex-col md:flex-row justify-between gap-8 md:gap-[52px]"
        >
            <div className="title-3 p-0 font-medium text-slate-800 md:p-6">
                BrokerChooser FAQ
            </div>
            <div className="flex-1">
                <Accordion
                    accordionItems={accordionItems}
                    measurementListId="main page faq section accordion"
                    animationClassName="animate-fade-in-move-left rtl:animate-fade-in-move-right"
                />
            </div>
        </SectionWrapper>
    );
};
