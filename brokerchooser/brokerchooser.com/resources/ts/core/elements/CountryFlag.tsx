import classNames from 'classnames';
import React, { FC } from 'react';
import { Image } from './Image';

export const CountryFlag: FC<{
    isoCode?: string;
    className?: string;
}> = ({ isoCode, className }) =>
    isoCode && (
        <Image
            imageSrc={`/uploads/images/country_flags/${isoCode}.svg`}
            alt={`country flag ${isoCode}`}
            className={classNames(className, 'overflow-hidden rounded-sm')}
            loading="lazy"
            hasPlaceholder
        />
    );
