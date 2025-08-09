import { createContext, Dispatch, SetStateAction } from 'react';
import { BrokerReviewListData } from '../types/BrokerReviewListData';

export const BrokerReviewListContext = createContext<{
    state: BrokerReviewListData;
    setState: Dispatch<SetStateAction<BrokerReviewListData>>;
}>({
    state: {
        providers: [],
        filterOptions: [],
        searchInput: '',
        isLoading: false,
        currentCountry: undefined,
    },
    setState: () => {},
});
