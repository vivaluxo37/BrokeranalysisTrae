import React, { FC } from 'react';
import { components, OptionProps } from 'react-select';
import { DropdownOption } from '../blocks/multiSelectDropdown/types/types';
import { CountryFlag } from './CountryFlag';

export const CountryFlagDropDownOption: FC<
    OptionProps<DropdownOption<number>>
> = ({ data, ...props }) => (
    <components.Option data={data} {...props}>
        <div className="flex flex-row items-center gap-2">
            <CountryFlag isoCode={data.iconId} className="size-4" />
            <div className="text-base">{data.translatedText || data.text}</div>
        </div>
    </components.Option>
);
