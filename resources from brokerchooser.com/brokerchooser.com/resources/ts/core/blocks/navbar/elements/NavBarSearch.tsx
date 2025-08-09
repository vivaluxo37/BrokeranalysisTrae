import { DropDown } from '@design-system/components/surfaces/dropDown/DropDown';
import { DropDownRefType } from '@design-system/components/surfaces/dropDown/types';
import React, { FC, useRef } from 'react';
import { SelectableIconWrapper } from '../../../elements/SelectableIconWrapper';
import { useAssistantInteractions } from '../../assistant/hooks/useAssistantInteractions';
import { AssistantSearchBar } from '../../assistantSearchBar/AssistantSearchBar';
import { ASSISTANT_SEARCH_BAR_MEASUREMENT_LIST_ID } from '../../assistantSearchBar/consts/measurementIds';
import { AssistantSearchIcon } from './AssistantSearchIcon';

export const NavBarSearch: FC<{ mode: 'dark' | 'light' }> = ({ mode }) => {
    const { onSearchOpen, onSearchClose } = useAssistantInteractions();

    const dropdownRef = useRef<DropDownRefType>(null);
    const toggleFloatingOverlay = () => dropdownRef?.current?.openChange();

    const onOpenStateChange = async (isOpen: boolean) => {
        if (!isOpen) {
            await onSearchOpen();

            return;
        }

        await onSearchClose();
    };

    return (
        <DropDown
            ref={dropdownRef}
            lockScroll
            mainAxis={6}
            crossAxis={-32}
            measurementListId={ASSISTANT_SEARCH_BAR_MEASUREMENT_LIST_ID}
            onOpenStateChange={onOpenStateChange}
            boxContent={<AssistantSearchBar onClose={toggleFloatingOverlay} />}
            ariaLabel="search"
        >
            {(isOpen) => (
                <SelectableIconWrapper isOpen={isOpen} mode={mode}>
                    <AssistantSearchIcon />
                </SelectableIconWrapper>
            )}
        </DropDown>
    );
};
