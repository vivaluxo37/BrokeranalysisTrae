import { MenuColumn } from '@design-system/components/navigation/menuColumn/MenuColumn';
import { MenuItemProps } from '@design-system/components/navigation/menuItem/types';
import { DropDown } from '@design-system/components/surfaces/dropDown/DropDown';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC } from 'react';

export const MenuItem: FC<MenuItemProps> = ({
    mode,
    menuTitle,
    menuId,
    measurementListId,
    columns,
    mainAxis,
    eventHandler,
}) => (
    <DropDown
        measurementListId={measurementListId}
        elementId={menuId}
        crossAxis={-32}
        mainAxis={mainAxis}
        ariaLabel={menuTitle}
        boxContent={
            <div className="flex gap-12 rounded-lg bg-white px-4 py-8 shadow-3xl">
                {columns.map(({ columnTitle, items, readMoreLink }) => (
                    <MenuColumn
                        key={columnTitle}
                        columnTitle={columnTitle}
                        eventHandler={eventHandler}
                        items={items}
                        readMoreLink={readMoreLink}
                    />
                ))}
            </div>
        }
    >
        {(isOpen) => (
            <div
                className={classNames(
                    'mt-0.5 flex h-full items-center border-b-2 border-transparent pb-1 transition-colors duration-300 hover:border-primary-500',
                    {
                        '!border-primary-500': isOpen,
                    },
                )}
            >
                <div
                    className={classNames(
                        'flex items-center gap-2 text-[15px] font-bold leading-4',
                        mode === 'dark' ? 'text-white' : 'text-slate-800',
                    )}
                >
                    <div className="max-w-28 flex-1">{menuTitle}</div>
                    <ChevronDownIcon
                        className={classNames(
                            'inline-block h-4 w-4 transition-transform duration-300',
                            {
                                '-rotate-180': isOpen,
                            },
                        )}
                        strokeWidth={3}
                    />
                </div>
            </div>
        )}
    </DropDown>
);
