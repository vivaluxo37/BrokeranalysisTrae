import { Badge } from '@design-system/components/miscellaneous/badge/Badge';
import { MenuColumn } from '@design-system/components/navigation/menuColumn/MenuColumn';
import { DropDown } from '@design-system/components/surfaces/dropDown/DropDown';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { STATIC_MENU_ITEM_TYPE_NAME } from '../../../consts/navbarMenuItemTypes';
import { LoadingOverlay } from '../../../elements/LoadingOverlay';
import { SelectableIconWrapper } from '../../../elements/SelectableIconWrapper';
import { NAV_BAR_MEASUREMENT_LIST_ID } from '../consts/events';
import { useUserHandling } from '../hooks/useUserHandling';
import { NavBarColumnProps, NavBarItemProps } from '../types/types';

export const NavBarUser: FC<{
    mode: 'dark' | 'light';
    eventHandler: (label: string) => void;
    userMenu: NavBarColumnProps;
}> = ({ mode, eventHandler, userMenu }) => {
    const { t } = useTranslation();
    const {
        isLoading,
        numberOfUnreadNotifications,
        user,
        notificationsMenuItemLabel,
        onLogout,
    } = useUserHandling();

    const userMenuElements = useMemo(() => {
        if (!user) {
            return userMenu;
        }
        const notificationsMenu: NavBarItemProps = {
            type: STATIC_MENU_ITEM_TYPE_NAME,
            itemTitle: notificationsMenuItemLabel,
            url: '/personal-page/notifications',
            withBadge: numberOfUnreadNotifications > 0,
            withNewBadge: false,
            withHotBadge: false,
        };
        return {
            ...userMenu,
            items: [notificationsMenu, ...userMenu.items],
        };
    }, [
        notificationsMenuItemLabel,
        numberOfUnreadNotifications,
        user,
        userMenu,
    ]);

    return (
        <>
            {isLoading && (
                <div className="fixed left-0 top-0 z-50 h-full w-full">
                    <LoadingOverlay />
                </div>
            )}
            <DropDown
                measurementListId={NAV_BAR_MEASUREMENT_LIST_ID}
                elementId="user"
                crossAxis={-32}
                mainAxis={10}
                ariaLabel={userMenu.columnTitle}
                boxContent={
                    <div className="flex flex-col rounded-lg bg-white px-4 py-8 shadow-3xl">
                        <MenuColumn
                            columnTitle={userMenuElements.columnTitle}
                            eventHandler={eventHandler}
                            items={userMenuElements.items}
                        />
                        {user && (
                            <button
                                aria-label="Log out"
                                type="button"
                                className="flex min-h-11 items-center gap-2.5 rounded-lg px-4 py-1 text-[15px] text-slate-800 outline outline-transparent transition-colors duration-300 hover:bg-slate-100 hover:text-blue-500 focus:outline-blue-500"
                                onClick={() => {
                                    onLogout('/logout');
                                }}
                            >
                                {t('Log out')}
                            </button>
                        )}
                    </div>
                }
            >
                {(isOpen) => (
                    <SelectableIconWrapper
                        isOpen={isOpen}
                        mode={mode}
                        className="relative"
                    >
                        <UserCircleIcon className="h-5 w-5" />
                        {numberOfUnreadNotifications > 0 && (
                            <Badge className="absolute end-3 top-3" />
                        )}
                    </SelectableIconWrapper>
                )}
            </DropDown>
        </>
    );
};
