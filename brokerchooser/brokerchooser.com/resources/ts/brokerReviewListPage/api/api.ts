import axios from 'axios';
import { ApiResponseProps } from '../types/ApiResponseProps';

export const fetchBrokers = async (params: {
    search: string;
    filterOptions: string[];
}): Promise<ApiResponseProps> =>
    axios
        .get<ApiResponseProps>('/api/review_list', {
            params,
        })
        .then((response) => response.data);
