import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BCCountrySelector } from '../../../../components/tailwind/molecules/BCCountrySelector';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { CountryDropDownControlWithSearchIcon } from '../../../elements/CountryDropDownControlWithSearchIcon';
import { HalfPageDialogue } from '../../../elements/HalfPageDialogue';
import { Spinner } from '../../../elements/Spinner';
import { sendHotJarEvent } from '../../../functions/sendHotJarEvent';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { Country } from '../../../types/commonTypes';
import { Dropdown } from '../../dropdown/Dropdown';
import { getLocalizationSelectorData } from '../api/getLocalizationSelectorData';
import { useLocalisationDrawer } from '../hooks/useLocalisationDrawer';
import { useLocalizationChanged } from '../hooks/useLocalizationChanged';
import {
    LocalisationSelectorOptionProps,
    NavBarLocalisationSelectorProps,
} from '../types/types';

export const LocalisationDrawer: FC<{
    currentCountry: Country | null;
    currentLanguageOption: LocalisationSelectorOptionProps;
}> = ({ currentCountry, currentLanguageOption }) => {
    const { t } = useTranslation();

    const { isLocalizationDrawerOpen, setIsLocalizationDrawerOpen } =
        useGlobalStore((state) => state.localizationDrawer);

    const [localisationSelector, setLocalisationSelector] =
        useState<NavBarLocalisationSelectorProps>({
            languageOptions: [],
            countries: [],
        });

    const [isDataLoading, setIsDataLoading] = useState(false);

    const {
        rtl,
        isMobileLayout,
        isLoading,
        languageOptions,
        currentCountryId,
        currentLanguageCode,
        onConfirmButtonClick,
        handleLanguageCodeChange,
        setCurrentCountryId,
    } = useLocalisationDrawer({
        localisationSelector,
        initialCountryId: currentCountry?.id,
        initialLanguageOption: currentLanguageOption,
    });

    useEffect(() => {
        if (isLocalizationDrawerOpen) {
            const event = getGeneralElementClickEventData({
                measurementListId: 'localisation selector open',
            });
            sendGA4Event(event);
            sendHotJarEvent('localisation drawer opened');
        }
    }, [isLocalizationDrawerOpen]);

    useEffect(() => {
        if (
            isLocalizationDrawerOpen &&
            localisationSelector.countries.length === 0 &&
            localisationSelector.languageOptions.length === 0
        ) {
            setIsDataLoading(true);
            getLocalizationSelectorData()
                .then((result) => {
                    setLocalisationSelector(result);
                })
                .catch(() => {
                    setIsLocalizationDrawerOpen(false);
                    toast(t('Oops..., something went wrong'));
                })
                .finally(() => {
                    setIsDataLoading(false);
                });
        }
    }, [
        currentCountry,
        currentLanguageOption,
        handleLanguageCodeChange,
        isLocalizationDrawerOpen,
        localisationSelector,
        setCurrentCountryId,
        setIsLocalizationDrawerOpen,
        t,
    ]);

    const handleToggleDrawer = useCallback(
        (isOpening: boolean) => {
            setIsLocalizationDrawerOpen(isOpening);

            if (!isOpening) {
                const event = getGeneralElementClickEventData({
                    measurementListId: 'localisation selector close',
                });
                sendGA4Event(event);

                handleLanguageCodeChange(currentLanguageOption.isoCode);
                setCurrentCountryId(currentCountry?.id);
            }
        },
        [
            currentCountry,
            currentLanguageOption,
            handleLanguageCodeChange,
            setCurrentCountryId,
            setIsLocalizationDrawerOpen,
        ],
    );

    useLocalizationChanged();

    return (
        <HalfPageDialogue
            isOpen={isLocalizationDrawerOpen}
            setIsOpen={handleToggleDrawer}
            isMobile={isMobileLayout}
            type={rtl ? 'left' : 'right'}
            containerClassName={classNames(
                'w-full max-w-xl overflow-y-auto sm:rounded-es-lg sm:rounded-ss-lg',
                'contents sm:block', // because of the "contents" class the mobile bottom float-in animation is not working
            )}
        >
            <div className="m-4 mt-12 flex h-min w-auto flex-col gap-8 rounded-lg bg-white p-4 py-8 sm:m-0 sm:min-h-full sm:w-full sm:gap-14 sm:rounded-none sm:p-14 sm:py-14">
                <div className="flex justify-between text-2xl font-semibold">
                    <div className="max-w-64 sm:max-w-none">
                        {t('Select language & location')}
                    </div>
                    <ButtonOrLink
                        size="xs"
                        text="close"
                        variant="tertiary"
                        className="h-10 w-10"
                        onClick={() => handleToggleDrawer(false)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </ButtonOrLink>
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold">
                        {t('Select your language')}
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                        {t(
                            'The website is in English by default. Other languages are available with AI translation.',
                        )}
                    </div>
                    <Dropdown
                        options={languageOptions}
                        disableDeselect
                        className="mt-4"
                        selectedId={currentLanguageCode}
                        onChange={handleLanguageCodeChange}
                        disabled={isLoading || isDataLoading}
                        customControlComponent={
                            CountryDropDownControlWithSearchIcon
                        }
                        customIndicatorSeparatorComponent={() => null}
                        hideSelectedValueIfMenuIsOpen
                    />
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold">
                        {t('Select your country')}
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                        {t(
                            'Select your country of residence to see available brokers and get personalized recommendations.',
                        )}
                    </div>
                    <BCCountrySelector
                        countryId={currentCountryId || -1}
                        countries={localisationSelector.countries}
                        onSelect={setCurrentCountryId}
                        disabled={isLoading || isDataLoading}
                        disableTitle
                        className="mt-4"
                    />
                </div>
                <ButtonOrLink
                    text={t('Confirm changes')}
                    variant="primary"
                    className="sm:w-max"
                    onClick={onConfirmButtonClick}
                    disabled={isLoading || !currentCountryId}
                    IconRight={isLoading ? Spinner : undefined}
                    iconClassName="h-5 w-5"
                />
                {isDataLoading && (
                    <div className="flex justify-center">
                        <Spinner size="medium" />
                    </div>
                )}
            </div>
        </HalfPageDialogue>
    );
};
