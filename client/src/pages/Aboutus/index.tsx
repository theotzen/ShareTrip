import * as React from 'react';
import useSWR from 'swr';
import { fetcher } from '../../api/api';

interface HealthcheckerResponse {
    message: string;
}

export default function Aboutus() {
    const { data, error } = useSWR<HealthcheckerResponse>(
        '/api/healthchecker',
        fetcher
    );

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    return (
        <>
            <div>It's the Aboutus page !</div>
            <div>{data.message}</div>
        </>
    );
}
