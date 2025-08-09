import classNames from 'classnames';
import React from 'react';
import { BrokerLogoProps } from '../types/BrokerLogoProps';
import { Image } from './Image';

export const BrokerLogo: React.FC<BrokerLogoProps> = ({
    broker,
    logoSizeClassName,
    className,
}) => (
    <Image
        imageSrc={broker.logoPath}
        alt={broker.name}
        className={classNames(
            logoSizeClassName ?? 'h-10 w-10',
            'shrink-0 rounded-md drop-shadow-md',
            className,
        )}
    />
);
