import * as React from 'react';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ControlProps,
    IndicatorSeparatorProps,
    OptionProps,
} from 'react-select';
import { isNotNil } from '../../../logic/util/functions/isNotNil';
import { MultiSelectDropdown } from '../multiSelectDropdown/MultiSelectDropdown';
import {
    DropdownOption,
    GroupedDropDownOption,
    MultiSelectDropdownOnSelectedChangeAction,
} from '../multiSelectDropdown/types/types';

export type DropDownChangeAction = (id: string | undefined) => void;

type DropdownProps = {
    id?: string;
    disabled?: boolean;
    className?: string;
    options: (GroupedDropDownOption<string> | DropdownOption<string>)[];
    selectedId?: string;
    onChange?: DropDownChangeAction;
    deselectLabel?: string;
    disableDeselect?: boolean;
    disableSearch?: boolean;
    onLogSearchEvent?: (value: string) => void;
    customOptionComponent?: FC<OptionProps<DropdownOption<number>>>;
    customControlComponent?: FC<ControlProps<DropdownOption<number>>>;
    customIndicatorSeparatorComponent?: FC<
        IndicatorSeparatorProps<DropdownOption<any>>
    >;
    hideSelectedValueIfMenuIsOpen?: boolean;
    ariaLabel?: string;
};

// Empty id stayed from MUI
const EMPTY_ID = '';

// todo: this and BCSelector should be merged
export const Dropdown: React.FunctionComponent<DropdownProps> = ({
    disabled,
    disableSearch,
    deselectLabel,
    disableDeselect,
    hideSelectedValueIfMenuIsOpen,
    id,
    options,
    onLogSearchEvent,
    className,
    customControlComponent,
    customOptionComponent,
    customIndicatorSeparatorComponent,
    onChange,
    selectedId,
    ariaLabel,
}) => {
    const { t } = useTranslation();

    const processedOptions = useMemo(() => {
        if (disableDeselect) {
            return options;
        }

        return [
            {
                id: EMPTY_ID,
                text:
                    deselectLabel === undefined
                        ? t('Please select')
                        : deselectLabel,
            },
            ...options,
        ];
    }, [deselectLabel, disableDeselect, options, t]);

    const selected = useMemo(() => [selectedId].filter(isNotNil), [selectedId]);

    const onSelectChanged: MultiSelectDropdownOnSelectedChangeAction<string> =
        useCallback(
            (args) => {
                let currentId = args.ids.length > 0 ? args.ids[0] : undefined;
                if (currentId === EMPTY_ID) {
                    currentId = undefined;
                }

                onChange?.(currentId);
            },
            [onChange],
        );

    return (
        <MultiSelectDropdown
            id={id}
            onSelectedChanged={onSelectChanged}
            className={className}
            options={processedOptions}
            selected={selected}
            disabled={disabled}
            onLogSearchEvent={onLogSearchEvent}
            disableSearch={disableSearch}
            customOptionComponent={customOptionComponent}
            customControlComponent={customControlComponent}
            customIndicatorSeparatorComponent={
                customIndicatorSeparatorComponent
            }
            hideSelectedValueIfMenuIsOpen={hideSelectedValueIfMenuIsOpen}
            ariaLabel={ariaLabel}
        />
    );
};
