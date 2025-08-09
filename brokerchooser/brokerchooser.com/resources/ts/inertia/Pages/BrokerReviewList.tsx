import React, { FC, useMemo, useState } from 'react';
import { BrokerReviewListPageContainer } from '../../brokerReviewListPage/BrokerReviewListPageContainer';
import { BrokerReviewListContext } from '../../brokerReviewListPage/context/BrokerReviewListContext';
import { BrokerReviewListData } from '../../brokerReviewListPage/types/BrokerReviewListData';

const BrokerReviewListPageWrapped: FC<BrokerReviewListData> = (
    props: BrokerReviewListData,
) => {
    const { filterOptions } = props;

    const [state, setState] = useState<BrokerReviewListData>({
        ...props,
        filterOptions: filterOptions.map((option) => ({
            ...option,
            isSelected: false,
        })),
        searchInput: '',
    });

    const contextValue = useMemo(() => ({ state, setState }), [state]);

    return (
        <BrokerReviewListContext.Provider value={contextValue}>
            <BrokerReviewListPageContainer />
        </BrokerReviewListContext.Provider>
    );
};

export default function BrokerReviewList(
    props: BrokerReviewListData,
): React.ReactNode {
    return <BrokerReviewListPageWrapped {...props} />;
}
