import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { FC, useContext, useMemo } from 'react';
import { ControlProps, components } from 'react-select';
import { MultiSelectDropdownContext } from '../blocks/multiSelectDropdown/contexts/MultiSelectDropdownContext';
import { DropdownOption } from '../blocks/multiSelectDropdown/types/types';
import { CountryFlag } from './CountryFlag';

export const CountryDropDownControlWithSearchIcon: FC<
    ControlProps<DropdownOption<number>>
> = ({ children, ...props }) => {
    const { isMenuOpen, selectedOptions } = useContext(
        MultiSelectDropdownContext,
    );

    const iconId = useMemo(() => selectedOptions[0]?.iconId, [selectedOptions]);

    return (
        <components.Control {...props}>
            <div className="flex w-full flex-row items-center">
                {isMenuOpen || selectedOptions.length === 0 ? (
                    <MagnifyingGlassIcon className="text-red ms-2 w-4" />
                ) : (
                    <CountryFlag isoCode={iconId} className="ms-2 size-4" />
                )}
                {children}
            </div>
        </components.Control>
    );
};
