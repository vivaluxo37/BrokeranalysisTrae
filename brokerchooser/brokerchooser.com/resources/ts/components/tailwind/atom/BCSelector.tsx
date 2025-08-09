import React, { FC, useCallback, useMemo } from 'react';
import {
    ControlProps,
    IndicatorSeparatorProps,
    OptionProps,
} from 'react-select';
import { MultiSelectDropdown } from '../../../core/blocks/multiSelectDropdown/MultiSelectDropdown';
import {
    DropdownOption,
    MultiSelectDropdownOnSelectedChangeAction,
} from '../../../core/blocks/multiSelectDropdown/types/types';

export type Option = {
    id: number;
    name: string;
    translatedName?: string;
    iconId?: string;
};

const DESELECT_VALUE = 0;

// todo: this and Dropdown.tsx should be the same
export const BCSelector: React.FunctionComponent<{
    value: number;
    options: Option[];
    onSelect: (value: number) => void;
    placeholder?: string;
    customOptionComponent?: FC<OptionProps<DropdownOption<number>>>;
    customControlComponent?: FC<ControlProps<DropdownOption<number>>>;
    customIndicatorSeparatorComponent?: FC<
        IndicatorSeparatorProps<DropdownOption<any>>
    >;
    hideSelectedValueIfMenuIsOpen?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
}> = ({
    options,
    onSelect,
    placeholder,
    value,
    customOptionComponent,
    customControlComponent,
    customIndicatorSeparatorComponent,
    hideSelectedValueIfMenuIsOpen = false,
    disabled = false,
    ariaLabel,
}) => {
    const multiSelectDropdownOptions = useMemo<DropdownOption<number>[]>(
        () =>
            options.map((v) => ({
                id: v.id,
                text: v.name,
                translatedText: v.translatedName,
                iconId: v.iconId,
            })),
        [options],
    );

    const selected = useMemo(() => [value], [value]);

    const onSelectChanged: MultiSelectDropdownOnSelectedChangeAction<number> =
        useCallback(
            ({ ids }) => {
                const newSelected = ids.length > 0 ? ids[0] : DESELECT_VALUE;
                onSelect(newSelected);
            },
            [onSelect],
        );

    return (
        <MultiSelectDropdown
            options={multiSelectDropdownOptions}
            selected={selected}
            onSelectedChanged={onSelectChanged}
            placeholder={placeholder}
            customOptionComponent={customOptionComponent}
            customControlComponent={customControlComponent}
            customIndicatorSeparatorComponent={
                customIndicatorSeparatorComponent
            }
            hideSelectedValueIfMenuIsOpen={hideSelectedValueIfMenuIsOpen}
            disabled={disabled}
            ariaLabel={ariaLabel}
        />
    );
};
