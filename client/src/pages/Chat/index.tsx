import * as React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import * as io from "socket.io-client";
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

    console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥')

    const { roomId } = useParams();
    const socket = io.connect('http://localhost:9000');


    return (
        <>
            <styles.chat>
                <ChatBar socket={socket}/>
                <styles.chat__main>
                    <ChatBody socket={socket}/>
                    <ChatFooter socket={socket}/>
                </styles.chat__main>
            </styles.chat>
        </>
    );
}