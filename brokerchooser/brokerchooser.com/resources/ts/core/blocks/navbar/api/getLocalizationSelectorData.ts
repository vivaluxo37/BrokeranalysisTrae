import axios from 'axios';
import { reportError } from '../../../../logic/util/error/reportError';
import { NavBarLocalisationSelectorProps } from '../types/types';

export const getLocalizationSelectorData =
    async (): Promise<NavBarLocalisationSelectorProps> => {
        try {
            const result = await axios.get<NavBarLocalisationSelectorProps>(
                '/api/navbar/localization-selector-data',
            );

            return result.data;
        } catch (error: any) {
            reportError('localization selector data fetch error', error);
            throw new Error(error);
        }
    };
