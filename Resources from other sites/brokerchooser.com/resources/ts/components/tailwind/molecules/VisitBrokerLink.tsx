import classNames from 'classnames';
import React from 'react';
import { UseCtaArgs } from '../../../core/contexts/visitBrokerContext/types/visitBrokerContextTypes';
import { useCtaElementArgs } from '../../../core/hooks/useCtaElementArgs';
import { ImpressionHandler } from './ImpressionHandler';

type VisitBrokerLinkProps = {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
} & UseCtaArgs;

export const VisitBrokerLink: React.FC<VisitBrokerLinkProps> = (props) => {
    const { children, className, containerClassName, ...ctaArgs } = props;

    const args = useCtaElementArgs(ctaArgs);

    return (
        <ImpressionHandler
            ga4ImpressionEventData={args.ga4ImpressionEventData}
            className={containerClassName}
            inline
        >
            <a
                className={classNames(className, 'bc-link-no-decor')}
                href={args.href}
                rel={args.rel}
                target="_blank"
                onClick={args.onClick}
                onAuxClick={args.onClick}
            >
                {children}
            </a>
        </ImpressionHandler>
    );
};
