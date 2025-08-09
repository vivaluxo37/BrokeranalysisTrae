import { MobileMenuItem } from '@design-system/components/navigation/mobilMenuItem/MobileMenuItem';
import { DropDown } from '@design-system/components/surfaces/dropDown/DropDown';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC } from 'react';
import { SelectableIconWrapper } from '../../../elements/SelectableIconWrapper';
import { NAV_BAR_MEASUREMENT_LIST_ID } from '../consts/events';
import { NavBarButtonProps, NavbarMenuItemProps } from '../types/types';
import { HamburgerIcon } from './HamburgerIcon';

export const NavBarMobile: FC<{
    mode: 'dark' | 'light';
    menuItems: NavbarMenuItemProps[];
    eventHandler: (label: string) => void;
    handleMobileMenuOpenStateChange?: (isOpen: boolean) => void;
    ctaButton: NavBarButtonProps;
}> = ({
    mode,
    menuItems,
    eventHandler,
    handleMobileMenuOpenStateChange,
    ctaButton,
}) => (
    <DropDown
        measurementListId={NAV_BAR_MEASUREMENT_LIST_ID}
        elementId="mobile menu"
        mainAxis={2}
        onOpenStateChange={handleMobileMenuOpenStateChange}
        boxClassName="w-full"
        ariaLabel="mobile menu"
        childClassName="xl:hidden"
        boxContent={
            <div
                className={classNames(
                    'z-1000 flex flex-col px-6 py-6 shadow-3xl',
                    mode === 'dark' ? 'bg-slate-800' : 'bg-white',
                )}
            >
                <a
                    href={ctaButton.url}
                    onClick={() => eventHandler(`button-${ctaButton}`)}
                    className={classNames(
                        'flex justify-between gap-2.5 border-b px-1 py-4 text-sm font-bold',
                        mode === 'dark'
                            ? 'border-slate-600 text-white'
                            : 'border-slate-200 text-slate-800',
                    )}
                >
                    {ctaButton.title}
                    <ArrowRightIcon
                        className="ms-1 h-4 w-4 rtl:rotate-180"
                        strokeWidth={3}
                    />
                </a>
                {menuItems.map((item) => (
                    <MobileMenuItem
                        key={item.id}
                        mode={mode}
                        measurementListId={NAV_BAR_MEASUREMENT_LIST_ID}
                        menuId={item.id}
                        menuTitle={item.menuTitle}
                        columns={item.columns}
                        eventHandler={eventHandler}
                    />
                ))}
            </div>
        }
    >
        {(isOpen) => (
            <SelectableIconWrapper isOpen={isOpen} mode={mode}>
                <HamburgerIcon mode={mode} open={isOpen} />
            </SelectableIconWrapper>
        )}
    </DropDown>
);
