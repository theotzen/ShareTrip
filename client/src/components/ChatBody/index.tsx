import * as React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';
import * as io from 'socket.io-client'

import * as styles from '../../pages/Chat/style';
import { UserResponseSchema } from '../../apiTypes';
import { Message } from '../../apiTypes';

interface IChatBodyProps {
    socket: io.Socket;
    user: UserResponseSchema;
    room: string|undefined;
    messages: Message[];
}

export default function ChatBody(props: IChatBodyProps) {

    const { socket, user, room, messages } = props
    const messagesFake = [
        {name: "totz", key: "adsffr3", text: "Bonjour"},
        {name: "totz", key: "adsfwgr", text: "Bonjour comment ça va ? De mon côté tout va bien, pas à me plaindre. Je rentre actuellement de l'on-site à Chartres Zoo."},
        {name: "totz", key: "adsafgdf", text: "Bonjour"}
    ]

    return (
        <>
            <styles.chat__mainHeader>
                <p>Chilling</p>
                <styles.leaveChat__btn>LEAVE</styles.leaveChat__btn>
            </styles.chat__mainHeader>

            <styles.message__container>
                {
                    messages.map( (message) => (
                        message.userId === user.id ?
                        <>
                            <styles.message__chats key={message.id}>
                                <styles.sender__name>{message.name}</styles.sender__name>
                                <styles.message__sender>
                                    {message.text}
                                </styles.message__sender>
                            </styles.message__chats>
                            {/* <styles.message__status>
                                Sent
                            </styles.message__status> */}
                        </> 
                        :
                        <>
                            <styles.message__chats key={message.id}>
                                <styles.sender__name>{message.name}</styles.sender__name>
                                <styles.message__recipient>
                                    {message.text}
                                </styles.message__recipient>
                            </styles.message__chats>
                            {/* <styles.message__status>
                                Sent
                            </styles.message__status> */}
                        </>
                        )
                    )
                }
            </styles.message__container>
        </>
    );
}
