import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from '../../../elements/Image';
import NuriSquareIcon from '../../assistant/assets/nuri-square-icon.svg';

export const OverviewByNuri = () => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-x-4">
            <Image
                loading="eager"
                imageSrc={NuriSquareIcon}
                alt="nuri"
                className="size-8 overflow-clip rounded-lg"
            />
            <span className="text-xl font-semibold">
                {t('AI overview by Nuri')}
            </span>
        </div>
    );
};
