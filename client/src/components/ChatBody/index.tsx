import * as React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';

import * as styles from '../../pages/Chat/style';

interface HealthcheckerResponse {
    message: string;
}

export default function ChatBody() {

    const messages = [
        {name: "totz", id: "adsffr3", text: "Bonjour"},
        {name: "totz", id: "adsfwgr", text: "Bonjour"},
        {name: "totz", id: "adsafgdf", text: "Bonjour"}
    ]

    return (
        <>
            <styles.chat__mainHeader>
                <p>Chilling</p>
                <styles.leaveChat__btn>LEAVE CHAT</styles.leaveChat__btn>
            </styles.chat__mainHeader>

            <styles.message__container>
                {
                    messages.map( (message) => (
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
                        )
                    )
                }
            </styles.message__container>
        </>
    );
}
