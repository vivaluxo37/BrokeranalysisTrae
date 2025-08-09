import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { isServer } from '../../../../util/isServer';
import { getGeneralElementClickEventData } from '../../../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../../../util/measurement/functions/sendGA4Event';
import { Breakpoints } from '../../../consts/Breakpoints';
import { setLocalStorageItem } from '../../../functions/localStorage';
import { runByConsent } from '../../../functions/runByConsent';
import { useIsRtl } from '../../../hooks/useIsRtl';
import { ConsentLevel } from '../../../types/ConsentLevel';
import { setLocalisation } from '../api/setLocalisation';
import {
    SHOW_NOTIFICATION_CHANGED_NOTI_KEY,
    SHOW_NOTIFICATION_CHANGED_NOTI_VALUE,
} from '../consts/notifications';
import {
    LocalisationSelectorOptionProps,
    NavBarLocalisationSelectorProps,
} from '../types/types';

export const useLocalisationDrawer = (args: {
    localisationSelector: NavBarLocalisationSelectorProps;
    initialLanguageOption: LocalisationSelectorOptionProps;
    initialCountryId?: number;
}) => {
    const { localisationSelector, initialLanguageOption, initialCountryId } =
        args;
    const rtl = useIsRtl();
    const [currentLanguageCode, setCurrentLanguageCode] = useState<string>(
        initialLanguageOption.isoCode,
    );
    const [currentCountryId, setCurrentCountryId] = useState<
        number | undefined
    >(initialCountryId);
    const [isLoading, setIsLoading] = useState(false);
    const isMobileLayout = useMemo(
        () => (isServer() ? false : window.innerWidth < Breakpoints.lg),
        [],
    );
    const languageOptions = useMemo(
        () =>
            localisationSelector.languageOptions.map((option) => ({
                id: option.isoCode,
                text: option.label,
            })),
        [localisationSelector.languageOptions],
    );

    const onConfirmButtonClick = useCallback(async () => {
        try {
            if (!currentLanguageCode || !currentCountryId) {
                return;
            }
            setIsLoading(true);
            const response = await setLocalisation({
                languageCode: currentLanguageCode,
                countryId: currentCountryId,
            });

            const currentCountry = localisationSelector.countries.find(
                (country) => country.id === currentCountryId,
            );

            const event = getGeneralElementClickEventData({
                measurementListId: 'navbar language selector confirm',
                context: JSON.stringify({
                    languageCode: currentLanguageCode,
                    countryName: currentCountry?.name,
                }),
            });

            sendGA4Event(event);

            const { redirectUrl } = response.data;

            if (initialCountryId !== currentCountryId) {
                runByConsent(
                    () =>
                        setLocalStorageItem({
                            key: SHOW_NOTIFICATION_CHANGED_NOTI_KEY,
                            value: SHOW_NOTIFICATION_CHANGED_NOTI_VALUE,
                        }),
                    ConsentLevel.Functionality,
                );
            }

            if (redirectUrl) {
                window.location.replace(redirectUrl);
            } else {
                window.location.reload();
            }
        } catch (err) {
            setIsLoading(false);
            toast("Ooops... We couldn't set the selected options");
        }
    }, [
        currentLanguageCode,
        currentCountryId,
        localisationSelector.countries,
        initialCountryId,
    ]);

    const handleLanguageCodeChange = useCallback(
        (code?: string) => code && setCurrentLanguageCode(code),
        [setCurrentLanguageCode],
    );

    return {
        rtl,
        isMobileLayout,
        isLoading,
        languageOptions,
        currentCountryId,
        currentLanguageCode,
        onConfirmButtonClick,
        handleLanguageCodeChange,
        setCurrentCountryId,
    };
};
