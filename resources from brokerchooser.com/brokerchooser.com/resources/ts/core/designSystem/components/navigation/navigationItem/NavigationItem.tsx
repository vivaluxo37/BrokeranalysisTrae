import { Badge } from '@design-system/components/miscellaneous/badge/Badge';
import { NavigationItemProps } from '@design-system/components/navigation/navigationItem/types';
import React, { FC } from 'react';
import { ImageAsBackground } from '../../../../../components/tailwind/atom/ImageAsBackground';
import { Image } from '../../../../elements/Image';

export const NavigationItem: FC<NavigationItemProps> = ({
    url,
    itemTitle,
    logoPath,
    withBackgroundIcon,
    withBadge,
    withNewBadge,
    withHotBadge,
    eventHandler,
}) => (
    <a
        href={url}
        onClick={() => eventHandler(url)}
        className="flex min-h-11 items-center gap-2.5 rounded-lg px-4 py-1 text-[15px] text-slate-800 outline outline-transparent transition-colors duration-300 hover:bg-slate-100 hover:text-blue-500 focus:outline-1 focus:outline-blue-500"
    >
        {logoPath &&
            (withBackgroundIcon ? (
                <ImageAsBackground imageSrc={logoPath} className="h-7 w-7" />
            ) : (
                <Image
                    alt={itemTitle}
                    imageSrc={logoPath}
                    className="h-7 w-7"
                />
            ))}
        {withBadge && <Badge />}
        {itemTitle}
        {withNewBadge && <Badge text="NEW" />}
        {withHotBadge && <Badge text="HOT" />}
    </a>
);
