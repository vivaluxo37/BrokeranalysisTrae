import { GlobeAltIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC } from 'react';
import { CountryFlag } from '../../../elements/CountryFlag';
import { SelectableIconWrapper } from '../../../elements/SelectableIconWrapper';
import { useGlobalStore } from '../../../globalStore/globalStore';
import { Country } from '../../../types/commonTypes';
import { LocalisationSelectorOptionProps } from '../types/types';
import { LocalisationDrawer } from './LocalisationDrawer';

export const NavLocalisationSelector: FC<{
    mode: 'dark' | 'light';
    currentCountry: Country | null;
    currentLanguageOption: LocalisationSelectorOptionProps;
}> = ({ mode, currentCountry, currentLanguageOption }) => {
    const { isLocalizationDrawerOpen, setIsLocalizationDrawerOpen } =
        useGlobalStore((state) => state.localizationDrawer);

    return (
        <>
            <LocalisationDrawer
                currentCountry={currentCountry}
                currentLanguageOption={currentLanguageOption}
            />
            <button
                onClick={() =>
                    setIsLocalizationDrawerOpen(!isLocalizationDrawerOpen)
                }
                type="button"
                aria-label="language selector"
            >
                <SelectableIconWrapper
                    isOpen={isLocalizationDrawerOpen}
                    mode={mode}
                >
                    {currentCountry && (
                        <div className="flex items-center gap-1">
                            <CountryFlag
                                isoCode={currentCountry.isoCode}
                                className="size-4 rounded-lg"
                            />
                            <div className="text-xs font-normal uppercase sm:text-sm">
                                {currentLanguageOption.isoCode}
                            </div>
                        </div>
                    )}
                    {!currentCountry && (
                        <GlobeAltIcon
                            className={classNames(
                                'h-5 w-5',
                                mode === 'dark'
                                    ? 'stroke-white'
                                    : 'stroke-slate-800',
                            )}
                        />
                    )}
                </SelectableIconWrapper>
            </button>
        </>
    );
};
