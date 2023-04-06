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
    lastMessageRef: React.Ref<HTMLDivElement>;
}

export default function ChatBody(props: IChatBodyProps) {

    const { socket, user, room, messages, lastMessageRef } = props

    return (
        <>
            <styles.chat__mainHeader>
                <p>Chilling</p>
                <styles.leaveChat__btn>LEAVE</styles.leaveChat__btn>
            </styles.chat__mainHeader>

            <styles.message__container>
                {
                    messages.map( (message, i) => (
                        message.userId === user.id ?
                        <>
                            <styles.message__chats key={`${i}${message._id}`}>
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
                            <styles.message__chats key={`${i}${message._id}`}>
                                <styles.sender__name_for_recipient>{message.name}</styles.sender__name_for_recipient>
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
                <div ref={lastMessageRef} />
            </styles.message__container>
        </>
    );
}
