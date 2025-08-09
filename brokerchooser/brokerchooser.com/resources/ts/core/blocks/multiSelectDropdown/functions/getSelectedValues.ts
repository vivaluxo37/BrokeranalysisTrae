import { DropdownOption, GroupedDropDownOption } from '../types/types';

export const getSelectedValues = <ID extends number | string>(args: {
    selectedIds: ID[];
    optionsArray: (DropdownOption<ID> | GroupedDropDownOption<ID>)[];
}) => {
    const { selectedIds, optionsArray } = args;

    const selection: DropdownOption<ID>[] = [];
    selectedIds.forEach((id) => {
        let options: DropdownOption<ID>[] = [];

        optionsArray.forEach((option) => {
            if ((option as GroupedDropDownOption<ID>).options) {
                options = options.concat(
                    (option as GroupedDropDownOption<ID>).options,
                );
            } else {
                options.push(option as DropdownOption<ID>);
            }
        });

        const selectedOption = options.find((option) => option.id === id);
        if (selectedOption) {
            selection.push(selectedOption);
        }
    });

    return selection;
};
