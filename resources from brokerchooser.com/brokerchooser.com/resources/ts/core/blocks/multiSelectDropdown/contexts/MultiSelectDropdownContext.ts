import { createContext } from 'react';
import { DropdownOption } from '../types/types';

export const MultiSelectDropdownContext = createContext<{
    isMenuOpen: boolean;
    selectedOptions: DropdownOption<number | string>[];
}>({
    isMenuOpen: false,
    selectedOptions: [],
});
