import { TrackedButtonOrLink } from '@design-system/components/inputs/buttonOrLink/TrackedButtonOrLink';
import React, { FC, MouseEventHandler, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from '../../../elements/Image';
import {
    facebookLogoDarkMode,
    instagramLogoDarkMode,
    linkedinLogoDarkMode,
    xLogoDarkMode,
} from '../assets';

export const FooterBottomLinks: FC = () => {
    const { t } = useTranslation();

    const handleOpenCookiePreferences = useCallback<
        MouseEventHandler<HTMLAnchorElement>
    >((e) => {
        e.preventDefault();
        window._iub?.cs.api.openPreferences();
    }, []);

    return (
        <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="pt-1">
                <TrackedButtonOrLink
                    text="LinkedIn"
                    size="sm"
                    mode="dark"
                    variant="tertiary"
                    className="!px-0 !py-0"
                    bodyClassName="!px-0"
                    target="_blank"
                    href="https://www.linkedin.com/company/10527960/"
                    measurementListId="footer"
                    elementId="linkedin"
                >
                    <Image
                        loading="lazy"
                        imageSrc={linkedinLogoDarkMode}
                        alt="x"
                        className="h-12 w-12 max-w-12"
                    />
                </TrackedButtonOrLink>
                <TrackedButtonOrLink
                    text="Twitter"
                    size="sm"
                    mode="dark"
                    variant="tertiary"
                    className="!px-0 !py-0"
                    bodyClassName="!px-0"
                    target="_blank"
                    href="https://twitter.com/brokerchooser"
                    measurementListId="footer"
                    elementId="twitter"
                >
                    <Image
                        loading="lazy"
                        imageSrc={xLogoDarkMode}
                        alt="x"
                        className="h-12 w-12 max-w-12"
                    />
                </TrackedButtonOrLink>
                <TrackedButtonOrLink
                    text="Facebook"
                    variant="tertiary"
                    size="sm"
                    mode="dark"
                    className="!px-0 !py-0"
                    bodyClassName="!px-0"
                    target="_blank"
                    href="https://www.facebook.com/brokerchooser"
                    measurementListId="footer"
                    elementId="facebook"
                >
                    <Image
                        loading="lazy"
                        imageSrc={facebookLogoDarkMode}
                        alt="facebook"
                        className="h-12 w-12 max-w-12"
                    />
                </TrackedButtonOrLink>
                <TrackedButtonOrLink
                    text="LinkedIn"
                    size="sm"
                    mode="dark"
                    variant="tertiary"
                    className="!px-0 !py-0"
                    bodyClassName="!px-0"
                    target="_blank"
                    href="https://www.instagram.com/brokerchooser/"
                    measurementListId="footer"
                    elementId="instagram"
                >
                    <Image
                        loading="lazy"
                        imageSrc={instagramLogoDarkMode}
                        alt="linkedin"
                        className="h-12 w-12 max-w-12"
                    />
                </TrackedButtonOrLink>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
                <div>Copyright</div>
                <Image
                    alt="BrokerChooser logo"
                    loading="lazy"
                    imageSrc="/images/logo.svg"
                    className="mt-1.5 h-6 w-36"
                />
                <div>Ltd. {new Date().getFullYear()}.</div>
            </div>
            <div className="text-white">Company reg#: C86950</div>
            <div className="flex flex-col text-start text-sm text-primary-500 md:text-end">
                <a
                    className="hover:underline"
                    href="https://www.iubenda.com/privacy-policy/8253309/full-legal"
                    target="_blank"
                    rel="nofollow"
                >
                    {t('Privacy Policy')}
                </a>
                <a
                    className="hover:underline"
                    href="https://www.iubenda.com/privacy-policy/8253309/cookie-policy"
                    target="_blank"
                    rel="nofollow"
                >
                    {t('Cookie Policy')}
                </a>
                <a
                    className="hover:underline"
                    href="/general-terms-and-conditions"
                    rel="nofollow"
                >
                    {t('General Terms and Conditions')}
                </a>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                    className="iubenda-cs-preferences-link hover:underline"
                    href="#"
                    rel="nofollow"
                    onClick={handleOpenCookiePreferences}
                >
                    {t('Cookie Preferences')}
                </a>
            </div>
        </div>
    );
};
