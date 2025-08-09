import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { MenuColumn } from '@design-system/components/navigation/menuColumn/MenuColumn';
import { MobileMenuItemProps } from '@design-system/components/navigation/mobilMenuItem/types';
import { DropDown } from '@design-system/components/surfaces/dropDown/DropDown';
import { DropDownRefType } from '@design-system/components/surfaces/dropDown/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../../../globalStore/globalStore';

export const MobileMenuItem: FC<MobileMenuItemProps> = ({
    mode,
    menuTitle,
    measurementListId,
    menuId,
    columns,
    eventHandler,
}) => {
    const { t } = useTranslation();
    const ref = useRef<DropDownRefType>(null);
    const showBrokerOfTheMonthPromoBar = useGlobalStore(
        (state) => state.brokerOfTheMonth.showBrokerOfTheMonthPromoBar,
    );

    return (
        <DropDown
            ref={ref}
            measurementListId={measurementListId}
            elementId={menuId}
            anchoredToOpener={false}
            boxClassName="w-full"
            ariaLabel={menuTitle}
            childClassName={classNames(
                'flex w-full items-center justify-between gap-2.5 border-b px-1 py-4 text-sm font-bold',
                mode === 'dark'
                    ? 'border-slate-600 text-white'
                    : 'border-slate-200 text-slate-800',
            )}
            boxContent={
                <div
                    className={classNames(
                        'absolute w-full bg-white p-6 shadow-3xl',
                        showBrokerOfTheMonthPromoBar ? 'top-24' : 'top-14',
                    )}
                >
                    <ButtonOrLink
                        text={t('Back')}
                        variant="underlined-secondary"
                        wrapperClassName="mb-4"
                        withLeftArrow
                        size="sm"
                        onClick={() => ref.current?.openChange()}
                    />
                    <div className="flex flex-col gap-5">
                        {columns.map(({ columnTitle, items, readMoreLink }) => (
                            <MenuColumn
                                key={columnTitle}
                                columnTitle={columnTitle}
                                eventHandler={eventHandler}
                                items={items}
                                readMoreLink={readMoreLink}
                                className="w-full"
                            />
                        ))}
                    </div>
                </div>
            }
        >
            {(isOpen) => (
                <>
                    <span className="flex-1 text-start">{menuTitle}</span>
                    <ChevronDownIcon
                        className={classNames('h-4 w-4 transition-transform', {
                            '-rotate-180': isOpen,
                        })}
                        strokeWidth={3}
                    />
                </>
            )}
        </DropDown>
    );
};
