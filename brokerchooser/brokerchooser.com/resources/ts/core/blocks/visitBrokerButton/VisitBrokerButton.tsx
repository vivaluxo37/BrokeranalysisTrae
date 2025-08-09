import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImpressionHandler } from '../../../components/tailwind/molecules/ImpressionHandler';
import { Image } from '../../elements/Image';
import { useCtaElementArgs } from '../../hooks/useCtaElementArgs';
import { VISIT_BROKER_BUTTON_TEST_ID } from './__tests__/consts/testIds';
import { VisitBrokerButtonProps } from './types/VisitBrokerButtonProps';

export const VisitBrokerButton: React.FunctionComponent<VisitBrokerButtonProps> =
    React.memo((props) => {
        const { t } = useTranslation();
        const {
            rootClassName,
            containerClassName,
            buttonText = t('Visit broker'),
            className,
            withLeftLogo = false,
            hideIconOnMobile,
            size = 'md',
            variant = 'secondary',
            ...ctaArgs
        } = props;

        const args = useCtaElementArgs(ctaArgs);
        const { broker } = ctaArgs;

        const IconLeft = useMemo(
            () =>
                withLeftLogo
                    ? () => (
                          <Image
                              alt={broker.name}
                              imageSrc={broker.logoPath}
                              className="size-4"
                          />
                      )
                    : undefined,
            [broker, withLeftLogo],
        );

        return (
            <ImpressionHandler
                className={containerClassName}
                ga4ImpressionEventData={args.ga4ImpressionEventData}
            >
                <ButtonOrLink
                    text={buttonText}
                    className={classNames(
                        'bc-link-no-decor uppercase',
                        className,
                    )}
                    wrapperClassName={rootClassName}
                    variant={variant}
                    withRightArrow
                    iconClassName={classNames({
                        'hidden md:block': hideIconOnMobile,
                    })}
                    IconLeft={IconLeft}
                    size={size}
                    rel={args.rel}
                    href={args.href}
                    onClick={args.onClick}
                    subText={broker.cfdWarning}
                    target="_blank"
                    data-testid={VISIT_BROKER_BUTTON_TEST_ID}
                />
            </ImpressionHandler>
        );
    });

VisitBrokerButton.displayName = 'VisitBrokerButton';
