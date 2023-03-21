import * as React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';

import ChatBar from '../../components/ChatBar'
import ChatFooter from '../../components/ChatFooter'
import ChatBody from '../../components/ChatBody'

import * as styles from './style';

interface HealthcheckerResponse {
    message: string;
}

export default function Chat() {
    const { data, error } = useSWR<HealthcheckerResponse>(
        'http://localhost:9000/api/beat',
        fetcher
    );

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    const { roomId } = useParams();

    return (
        <>
            <styles.chat>
                <ChatBar/>
                <styles.chat__main>
                    <ChatBody/>
                    <ChatFooter/>
                </styles.chat__main>
            </styles.chat>
        </>
    );
}