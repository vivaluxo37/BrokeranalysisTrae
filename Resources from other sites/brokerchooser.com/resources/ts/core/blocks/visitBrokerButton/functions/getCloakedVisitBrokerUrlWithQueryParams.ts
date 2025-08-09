// Attention! This constant is also defined in the backend, with the same variable name. Edit both in case of change
// See: AffiliateUrlConstants.php
const CLOAKED_URL_MEASUREMENT_CATEGORY_ID_QUERY_PARAMETER =
    'measurementCategory';
// Attention! This constant is also defined in the backend, with the same variable name. Edit both in case of change
// See: AffiliateUrlConstants.php
const CLOAKED_URL_MEASUREMENT_LIST_ID_QUERY_PARAMETER = 'measurementList';

type args = {
    baseUrl: string;
    measurementListId: string;
    measurementCategoryId: string;
};

export const getCloakedVisitBrokerUrlWithQueryParams = (
    params: args,
): string => {
    const url = new URL(params.baseUrl);
    url.searchParams.set(
        CLOAKED_URL_MEASUREMENT_CATEGORY_ID_QUERY_PARAMETER,
        params.measurementCategoryId,
    );
    url.searchParams.set(
        CLOAKED_URL_MEASUREMENT_LIST_ID_QUERY_PARAMETER,
        params.measurementListId,
    );
    return url.toString();
};
