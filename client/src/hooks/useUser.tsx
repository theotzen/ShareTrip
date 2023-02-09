import useSWR from 'swr';
import { fetcher } from '../api/api';
import { UserResponse } from '../apiTypes';

export default function useUser() {
    const { data, error } = useSWR<UserResponse>('/api/users/me', fetcher, {
        refreshInterval: 0,
    });

    return {
        user: data,
        isLoading: !error && !data,
        error: error,
    };
}
