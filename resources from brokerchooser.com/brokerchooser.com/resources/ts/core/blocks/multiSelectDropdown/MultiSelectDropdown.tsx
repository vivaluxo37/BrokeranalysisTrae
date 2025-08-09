import classNames from 'classnames';
import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import Select, { OnChangeValue, StylesConfig, components } from 'react-select';
import { asArrayNotNil } from '../../../logic/util/functions/asArrayNotNil';
import { isServer } from '../../../util/isServer';
import { MultiSelectDropdownContext } from './contexts/MultiSelectDropdownContext';
import { getSelectedValues } from './functions/getSelectedValues';
import { useDebouncedFunction } from './hooks/useDebouncedFunction';
import { useOverridableState } from './hooks/useOverridableState';
import { useUniqueIdPerPageShow } from './hooks/useUniqueIdPerPageLoad';
import { DropdownOption, MultiSelectDropdownProps } from './types/types';

const getOptionLabel = (option: DropdownOption<any>) =>
    option.translatedText || option.text;
const getOptionValue = (option: DropdownOption<any>) => option.id;

// https://react-select.com/styles#provided-styles-and-state
const selectStyles: StylesConfig<DropdownOption<any>> = {
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
    input: (base) => ({ ...base, 'input:focus': { boxShadow: 'none' } }),
};

export function MultiSelectDropdown<ID extends number | string>(
    props: MultiSelectDropdownProps<ID>,
): ReactElement<any, any> | null {
    const {
        onSelectedChanged,
        options,
        selected,
        styles,
        controlled,
        customControlComponent,
        customOptionComponent,
        customIndicatorSeparatorComponent,
        maxSelectCount,
        name,
        onLogSearchEvent,
        controlShouldRenderValue,
        placeholder,
        hideSelectedValueIfMenuIsOpen,
        disabled,
        disableSearch,
        id,
        className,
        ariaLabel,
    } = props;
    const onSelectedValueChangedCallback = useCallback(
        (newOptions: DropdownOption<ID>[]) => {
            const ids = newOptions.map((v) => v.id);
            onSelectedChanged?.({ options: newOptions, ids });
        },
        [onSelectedChanged],
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuOpen = useCallback(() => {
        setIsMenuOpen(true);
    }, []);
    const handleMenuClose = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const selectedOptionIds = useMemo<DropdownOption<ID>[]>(() => {
        if (!selected) {
            return [];
        }
        return getSelectedValues({
            selectedIds: selected,
            optionsArray: options,
        });
    }, [options, selected]);

    const [selectedOptions, setSelectedOptions] = useOverridableState<
        DropdownOption<ID>[]
    >({
        value: selectedOptionIds || [],
        onSetValueDebounced: onSelectedValueChangedCallback,
        deps: [selectedOptionIds],
    });

    const multiSelectDropDownContextValue = useMemo(
        () => ({ isMenuOpen, selectedOptions }),
        [isMenuOpen, selectedOptions],
    );

    const canSelectMultiple =
        typeof maxSelectCount !== 'undefined' && maxSelectCount > 1;

    const isOptionDisabled = useCallback(() => {
        if (!canSelectMultiple) {
            return false;
        }

        return (
            typeof maxSelectCount !== 'undefined' &&
            selectedOptions.length >= maxSelectCount
        );
    }, [selectedOptions, canSelectMultiple, maxSelectCount]);

    const onSelectChange = useCallback(
        (optionsRaw: OnChangeValue<DropdownOption<ID>, boolean>) => {
            const newSelected = asArrayNotNil(optionsRaw);
            if (controlled) {
                const ids = newSelected.map((v) => v.id);
                onSelectedChanged?.({ options: newSelected, ids });
                return;
            }
            setSelectedOptions(newSelected);
        },
        [setSelectedOptions, controlled, onSelectedChanged],
    );

    const defaultSelected = useMemo(() => {
        if (!selected) {
            return [];
        }

        return getSelectedValues({
            selectedIds: selected,
            optionsArray: options,
        });
    }, [options, selected]);

    /**
     * Why needed?
     * Because the <select/> is not reset but restored when navigated back to the page.
     *
     * Issue with it is that the user cannot navigate forward by selecting the already selected element, because it would
     * not register as changed. The key problem here is that the value from React does not match with what is shown in the select.
     *
     * Solution is that there is a different element rendered under a different id, it will be obvious to the browser
     * that the value should be reset. (It is also important that this solution does not trigger a set event further up
     * the React tree)
     */
    const customUniqueId = useUniqueIdPerPageShow();
    const uniqueId = id || customUniqueId;

    const onInputChange = useDebouncedFunction(
        (value: string) => {
            if (typeof value !== 'string' || value.length === 0) {
                return;
            }
            onLogSearchEvent?.(value);
        },
        200,
        [onLogSearchEvent],
    );

    return (
        <div className={classNames(className)}>
            <MultiSelectDropdownContext.Provider
                value={multiSelectDropDownContextValue}
            >
                <Select
                    onInputChange={(v) => {
                        onInputChange(v);
                        return undefined;
                    }}
                    onMenuOpen={handleMenuOpen}
                    onMenuClose={handleMenuClose}
                    name={name}
                    id={uniqueId}
                    value={
                        hideSelectedValueIfMenuIsOpen && isMenuOpen
                            ? []
                            : selectedOptions
                    }
                    controlShouldRenderValue={controlShouldRenderValue}
                    defaultValue={defaultSelected}
                    isOptionDisabled={isOptionDisabled}
                    getOptionValue={getOptionValue}
                    getOptionLabel={getOptionLabel}
                    isMulti={canSelectMultiple}
                    options={options}
                    onChange={onSelectChange}
                    menuPortalTarget={isServer() ? null : document.body}
                    styles={
                        styles ? { ...selectStyles, ...styles } : selectStyles
                    }
                    placeholder={placeholder}
                    isSearchable={!disableSearch}
                    isDisabled={disabled ?? false}
                    components={{
                        Option: customOptionComponent || components.Option,
                        Control: customControlComponent || components.Control,
                        IndicatorSeparator:
                            customIndicatorSeparatorComponent ||
                            components.IndicatorSeparator,
                    }}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    aria-label={ariaLabel}
                />
            </MultiSelectDropdownContext.Provider>
        </div>
    );
}
