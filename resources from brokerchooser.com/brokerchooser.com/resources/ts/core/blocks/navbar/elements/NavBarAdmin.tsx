import { MenuColumn } from '@design-system/components/navigation/menuColumn/MenuColumn';
import { DropDown } from '@design-system/components/surfaces/dropDown/DropDown';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import React, { FC } from 'react';
import { SelectableIconWrapper } from '../../../elements/SelectableIconWrapper';
import { NAV_BAR_MEASUREMENT_LIST_ID } from '../consts/events';
import { NavBarColumnProps } from '../types/types';

export const NavBarAdmin: FC<{
    mode: 'dark' | 'light';
    adminMenu: NavBarColumnProps;
}> = ({ mode, adminMenu }) => (
    <DropDown
        measurementListId={NAV_BAR_MEASUREMENT_LIST_ID}
        elementId="admin_dropdown"
        crossAxis={-32}
        mainAxis={10}
        ariaLabel={adminMenu.columnTitle}
        boxContent={
            <div className="flex flex-col rounded-lg bg-white px-4 py-8 shadow-3xl">
                <MenuColumn
                    columnTitle={adminMenu.columnTitle}
                    eventHandler={() => {}}
                    items={adminMenu.items}
                />
            </div>
        }
    >
        {(isOpen) => (
            <SelectableIconWrapper
                isOpen={isOpen}
                mode={mode}
                className="relative"
            >
                <WrenchScrewdriverIcon className="h-5 w-5" />
            </SelectableIconWrapper>
        )}
    </DropDown>
);
