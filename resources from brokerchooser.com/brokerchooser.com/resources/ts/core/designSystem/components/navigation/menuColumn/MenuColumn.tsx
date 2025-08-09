import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { MenuColumnProps } from '@design-system/components/navigation/menuColumn/types';
import { NavigationItem } from '@design-system/components/navigation/navigationItem/NavigationItem';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC } from 'react';
import { DYNAMIC_MENU_ITEM_TYPE_NAME } from '../../../../consts/navbarMenuItemTypes';
import { getNavBarDynamicMenuItem } from '../../../../functions/getNavBarDynamicMenuItem';

export const MenuColumn: FC<MenuColumnProps> = ({
    columnTitle,
    items,
    readMoreLink,
    eventHandler,
    className,
}) => (
    <div
        className={classNames(
            'min-w-72 border-slate-200 pb-5 xl:border-none xl:pb-0 [&:not(:last-child)]:border-b',
            className,
        )}
    >
        {columnTitle && (
            <div className="mb-6 px-4 text-base font-bold text-slate-800">
                {columnTitle}
            </div>
        )}
        <div className="grid w-full">
            {items.map((props) => {
                if (props.type === DYNAMIC_MENU_ITEM_TYPE_NAME) {
                    return (
                        <div key={props.id}>
                            {getNavBarDynamicMenuItem({
                                componentName: props.componentName,
                                eventHandler,
                            })}
                        </div>
                    );
                }

                const {
                    itemTitle,
                    url,
                    withBadge: itemBadge,
                    withNewBadge,
                    withHotBadge,
                    logoPath,
                } = props;
                return (
                    <NavigationItem
                        key={url}
                        itemTitle={itemTitle}
                        url={url}
                        withBadge={itemBadge}
                        withNewBadge={withNewBadge}
                        withHotBadge={withHotBadge}
                        logoPath={logoPath}
                        eventHandler={eventHandler}
                    />
                );
            })}
        </div>
        {readMoreLink && (
            <ButtonOrLink
                href={readMoreLink.url}
                variant="underlined-secondary"
                size="sm"
                text={readMoreLink.title}
                wrapperClassName="relative mt-5 start-1"
                IconRight={ChevronRightIcon}
                iconClassName="h-4 w-4 stroke-[3]"
            />
        )}
    </div>
);
