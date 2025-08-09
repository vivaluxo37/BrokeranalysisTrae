import { debounce } from 'lodash-es';
import { useCallback, useContext, useMemo } from 'react';
import {
    getCheckboxSelectEventData,
    getSearchEventData,
} from '../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../util/measurement/functions/sendGA4Event';
import { fetchBrokers } from '../api/api';
import { BrokerReviewListContext } from '../context/BrokerReviewListContext';
import { CheckboxProps } from '../elements/FilterGroup';
import { FilterOption } from '../types/BrokerReviewListData';

export const useFilterActions = () => {
    const {
        state: { filterOptions, searchInput },
        setState,
    } = useContext(BrokerReviewListContext);

    const setIsLoading = useCallback(
        (state: boolean) => {
            setState((prevState) => ({
                ...prevState,
                isLoading: state,
            }));
        },
        [setState],
    );

    const getFilterOptionsForApi = useCallback(
        (options: FilterOption[]) =>
            options
                .filter((option) => option.isSelected)
                .map((option) => option.slug),
        [],
    );

    const debouncedSearch = useMemo(
        () =>
            debounce(async (searchString: string) => {
                setIsLoading(true);
                const response = await fetchBrokers({
                    search: searchString,
                    filterOptions: getFilterOptionsForApi(filterOptions),
                });

                setState((prevState) => ({
                    ...prevState,
                    providers: response.providers,
                }));

                setIsLoading(false);

                const event = getSearchEventData({
                    searchTerm: searchString,
                    measurementListId: 'review list search',
                });

                await sendGA4Event(event);
            }, 500),

        [setState, getFilterOptionsForApi, filterOptions, setIsLoading],
    );

    const onSearchChange = useCallback(
        async (searchString: string) => {
            setState((prevState) => ({
                ...prevState,
                searchInput: searchString,
            }));

            debouncedSearch(searchString);
        },
        [debouncedSearch, setState],
    );

    const onFilterChange = useCallback(
        async (checkBox: CheckboxProps) => {
            setIsLoading(true);

            let isFilterSelected = false;

            const newFilters = filterOptions.map((filter) => {
                if (filter.slug === checkBox.id) {
                    isFilterSelected = !filter.isSelected;
                    return { ...filter, isSelected: !filter.isSelected };
                }
                return filter;
            });

            const response = await fetchBrokers({
                search: searchInput,
                filterOptions: getFilterOptionsForApi(newFilters),
            });

            setState((prevState) => ({
                ...prevState,
                filterOptions: newFilters,
                providers: response.providers,
            }));

            setIsLoading(false);

            const event = getCheckboxSelectEventData({
                isSelected: isFilterSelected,
                measurementListId: 'review list filter',
                elementId: checkBox.id,
            });

            await sendGA4Event(event);
        },
        [
            filterOptions,
            setIsLoading,
            setState,
            searchInput,
            getFilterOptionsForApi,
        ],
    );

    return {
        onSearchChange,
        onFilterChange,
    };
};
