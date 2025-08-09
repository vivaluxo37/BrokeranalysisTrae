/* eslint-disable react/jsx-no-useless-fragment */
import { FooterNavigationItem } from '@design-system/components/navigation/footerNavigationItem/FooterNavigationItem';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const DisclaimerTexts: FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            <div className="text-sm font-bold capitalize text-slate-400">
                {t('disclaimer')}:
            </div>
            <div className="text-xs text-slate-400">
                <>
                    {/* prettier-ignore */}
                    <Trans
                        i18nKey="Please note that by investing in and/or trading financial instruments, commodities and any other assets, you are taking a high degree of risk and you can lose all your deposited money. You should engage in any such activity only if you are fully aware of the relevant risks. BrokerChooser does not provide investment or any other advice, for further information please read our <1>General Terms and Conditions</1>.">
                        Please note that by investing in and/or trading financial instruments, commodities and
                        any other assets, you are taking a high degree of risk and you can lose all your
                        deposited money. You should engage in any such activity only if you are fully aware of
                        the relevant risks. BrokerChooser does not provide investment or any other advice, for
                        further information please read our <FooterNavigationItem
                        className="text-xs inline text-white font-bold" url="/general-terms-and-conditions"
                        measurementListId="footer-link">General Terms and Conditions</FooterNavigationItem>.
                    </Trans>
                </>
            </div>
            <div className="mt-4 text-sm font-bold capitalize text-slate-400">
                {t('advertiser disclosure')}:
            </div>
            <div className="text-xs text-slate-400">
                <>
                    {/* prettier-ignore */}
                    <Trans
                        i18nKey="At BrokerChooser, we consider clarity and transparency as core values. BrokerChooser is free to use for everyone, but earns a commission from some of its partners with no additional cost to you (please find the <1>list of such partners here</1>). However, please note that all the material and information made available by BrokerChooser or any of its affiliates is based on <3>our proprietary professional methodology</3>, which is unbiased, prepared in accordance with the best interest of our customers and most importantly independent from the remuneration structure we have in place with some of our partners.">
                        At BrokerChooser, we consider clarity and transparency as core values. BrokerChooser is free to
                        use for everyone, but earns a commission from some of its partners with no additional cost to
                        you (please find the <FooterNavigationItem
                        className="text-xs inline text-white font-bold" url="/advertiser-disclosure"
                        measurementListId="footer-link" newTab={false}>list of such partners here</FooterNavigationItem>).
                        However, please note that all the material and information made available by BrokerChooser or
                        any of its affiliates is based on <FooterNavigationItem
                        className="text-xs inline text-white font-bold" url="/methodology"
                        measurementListId="footer-link" newTab={false}>our proprietary professional
                        methodology</FooterNavigationItem>, which is unbiased, prepared in accordance with the best
                        interest of our customers and most importantly independent from the remuneration structure we
                        have in place with some of our partners.
                    </Trans>
                </>
            </div>
        </div>
    );
};
