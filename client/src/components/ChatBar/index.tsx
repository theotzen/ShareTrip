import * as React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';
import * as io from "socket.io-client";
import * as styles from '../../pages/Chat/style';

interface IChatBarProps {
    socket: io.Socket;
    users: string[];
}

export default function ChatBar(props: IChatBarProps) {

    const { socket, users } = props;

    console.info('from chat bar socket ', socket.id);
    console.info('from chat bar user ', users);

    return (
        <>
            <styles.chat__sidebar>
                <h2>Open Chat</h2>
                <div>
                    <styles.chat__header>
                        Active users
                    </styles.chat__header>
                    <styles.chat__users>
                        {users
                        ?
                            users.map((userId, i) => {
                                return <p key={i}>{userId}</p>
                            })
                        :
                        <p>No user connected</p>}
                    </styles.chat__users>
                </div>
            </styles.chat__sidebar>
        </>
    );
}
