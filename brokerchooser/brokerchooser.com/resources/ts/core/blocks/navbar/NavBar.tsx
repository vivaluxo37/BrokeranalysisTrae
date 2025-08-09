import { ButtonOrLink } from '@design-system/components/inputs/buttonOrLink/ButtonOrLink';
import { SectionWrapper } from '@design-system/components/layout/sectionWrapper/SectionWrapper';
import { MenuItem } from '@design-system/components/navigation/menuItem/MenuItem';
import classNames from 'classnames';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { isServer } from '../../../util/isServer';
import { getGeneralElementClickEventData } from '../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../util/measurement/functions/sendGA4Event';
import { Breakpoints } from '../../consts/Breakpoints';
import { NAV_BAR_MEASUREMENT_LIST_ID } from './consts/events';
import { NAVBAR_HEIGHT } from './consts/uiConstants';
import { NavBarAdmin } from './elements/NavBarAdmin';
import { NavBarLogo } from './elements/NavBarLogo';
import { NavBarMobile } from './elements/NavBarMobile';
import { NavBarSearch } from './elements/NavBarSearch';
import { NavBarUser } from './elements/NavBarUser';
import { NavLocalisationSelector } from './elements/NavLocalisationSelector';
import { NavbarProps } from './types/types';

export const NavBar: FC<NavbarProps> = ({
    internalNotification,
    userMenu,
    adminMenu,
    menuItems,
    isSearchEnabled,
    mode,
    isTransparent: isTransparentOnInit,
    ctaButton,
    currentCountry,
    currentLanguageOption,
}) => {
    const eventHandler = useCallback((label: string) => {
        const event = getGeneralElementClickEventData({
            measurementListId: NAV_BAR_MEASUREMENT_LIST_ID,
            elementId: label,
        });
        sendGA4Event(event);
    }, []);

    const [transparent, setTransparent] = useState(isTransparentOnInit);
    const handleTransparentModeSetting = useCallback(() => {
        setTransparent(window.scrollY <= NAVBAR_HEIGHT);
    }, []);

    const handleMenuOpenStateChange = useCallback((isOpen: boolean) => {
        if (
            window.scrollY > NAVBAR_HEIGHT ||
            window.innerWidth > Breakpoints.xl
        ) {
            return;
        }
        setTransparent(isOpen);
    }, []);

    useEffect(() => {
        if (isServer() || !isTransparentOnInit) {
            return () => {};
        }
        handleTransparentModeSetting();
        window.addEventListener('scroll', handleTransparentModeSetting, {
            passive: true,
        });
        return () => {
            window.removeEventListener('scroll', handleTransparentModeSetting);
        };
    }, [handleTransparentModeSetting, isTransparentOnInit, mode]);

    return (
        <header
            className={classNames({
                'h-14': !isTransparentOnInit,
                'bg-white': mode === 'light' && !transparent,
                'bg-slate-800': mode === 'dark' && !transparent,
            })}
        >
            <nav
                className={classNames(
                    'fixed flex h-14 w-full flex-col justify-center transition-colors duration-150',
                    {
                        'bg-white': mode === 'light' && !transparent,
                        'bg-slate-800': mode === 'dark' && !transparent,
                    },
                )}
            >
                <SectionWrapper
                    innerClassName="flex items-center justify-between gap-6"
                    outerClassName="overflow-visible"
                >
                    <NavBarLogo
                        mode={mode}
                        eventHandler={eventHandler}
                        internalNotification={internalNotification}
                        className="!ms-0"
                    />
                    <div className="hidden items-stretch gap-6 xl:flex">
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.id}
                                mode={mode}
                                measurementListId={NAV_BAR_MEASUREMENT_LIST_ID}
                                menuTitle={item.menuTitle}
                                menuId={item.id}
                                columns={item.columns}
                                eventHandler={eventHandler}
                                mainAxis={15}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex">
                            {isSearchEnabled && <NavBarSearch mode={mode} />}
                            <NavBarUser
                                mode={mode}
                                eventHandler={eventHandler}
                                userMenu={userMenu}
                            />
                            {adminMenu && (
                                <NavBarAdmin
                                    mode={mode}
                                    adminMenu={adminMenu}
                                />
                            )}
                            <NavLocalisationSelector
                                mode={mode}
                                currentCountry={currentCountry}
                                currentLanguageOption={currentLanguageOption}
                            />
                            <NavBarMobile
                                mode={mode}
                                eventHandler={eventHandler}
                                menuItems={menuItems}
                                ctaButton={ctaButton}
                                handleMobileMenuOpenStateChange={
                                    isTransparentOnInit
                                        ? handleMenuOpenStateChange
                                        : undefined
                                }
                            />
                        </div>
                        <ButtonOrLink
                            size="sm"
                            className="hidden leading-4 xl:block"
                            href={ctaButton.url}
                            onClick={() =>
                                eventHandler(`button-${ctaButton.url}`)
                            }
                            text={ctaButton.title}
                        />
                    </div>
                </SectionWrapper>
            </nav>
        </header>
    );
};
