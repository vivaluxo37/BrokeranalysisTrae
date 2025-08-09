import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CountryDropDownControlWithSearchIcon } from '../../../core/elements/CountryDropDownControlWithSearchIcon';
import { CountryFlagDropDownOption } from '../../../core/elements/CountryFlagDropDownOption';
import { Country } from '../../../core/types/commonTypes';
import { CountryId } from '../../../findMyBrokerPage/types/types';
import { BCSelector } from '../atom/BCSelector';

export const BCCountrySelector: FC<{
    countryId: CountryId;
    countries: Country[];
    onSelect: (id: CountryId) => void;
    className?: string;
    placeholder?: string;
    disableTitle?: boolean;
    disabled?: boolean;
}> = ({
    disableTitle,
    className,
    countryId,
    countries,
    onSelect,
    placeholder,
    disabled = false,
}) => {
    const { t } = useTranslation();

    const options = useMemo(
        () =>
            countries.map((country) => ({
                id: country.id,
                name: country.name,
                translatedName: country.translatedName || country.name,
                iconId: country.isoCode,
            })),
        [countries],
    );

    return (
        <div className={className}>
            {!disableTitle && (
                <p className="mb-2 ms-2 mt-4 text-sm">
                    {t('Please select your country')}
                </p>
            )}
            <BCSelector
                value={countryId}
                options={options}
                onSelect={onSelect}
                placeholder={placeholder || t('Select...')}
                customOptionComponent={CountryFlagDropDownOption}
                customControlComponent={CountryDropDownControlWithSearchIcon}
                customIndicatorSeparatorComponent={() => null}
                hideSelectedValueIfMenuIsOpen
                disabled={disabled}
                ariaLabel={t('Countries')}
            />
        </div>
    );
};
