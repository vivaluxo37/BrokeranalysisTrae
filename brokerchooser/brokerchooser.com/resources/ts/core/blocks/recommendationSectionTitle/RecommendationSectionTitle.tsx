import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoIcon } from '../../../components/tailwind/atom/icons/InfoIcon';
import { SectionTitle } from '../../../components/tailwind/atom/SectionTitle';
import { BCTooltip } from '../../elements/BCTooltip';

export const RecommendationSectionTitle: FC<{
    sectionTitle: string;
    countryInTheName?: string;
}> = ({ sectionTitle, countryInTheName }) => {
    const { t } = useTranslation();
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
        <SectionTitle center>
            {sectionTitle} <br />
            <span className="flex flex-row justify-center text-2xl text-gray-400">
                {countryInTheName
                    ? t('[countryTheName] in [year]', {
                          countryTheName: countryInTheName,
                          year: currentYear,
                      })
                    : t('in [year]', {
                          year: currentYear,
                      })}
                <BCTooltip
                    content={
                        countryInTheName
                            ? t(
                                  'Wrong country? Change it in the navigation bar to get accurate recommendations.',
                              )
                            : t(
                                  'Set your country in the navigation bar to get accurate recommendations.',
                              )
                    }
                    position="bottom"
                >
                    <InfoIcon className="mx-1 mb-3 inline h-4 w-4 text-secondary-500" />
                </BCTooltip>
            </span>
        </SectionTitle>
    );
};
