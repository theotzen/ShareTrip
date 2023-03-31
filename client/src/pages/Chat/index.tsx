import * as React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import io, { Socket } from "socket.io-client";
import { fetcher } from '../../api/api';

import ChatBar from '../../components/ChatBar'
import ChatFooter from '../../components/ChatFooter'
import ChatBody from '../../components/ChatBody'
import { UserContext } from '../../utils/context';

import * as styles from './style';
import Error from '../Error';
import { Message } from '../../apiTypes';


interface IChatProps {
    socket: Socket;
}

export default function Chat(props: IChatProps) {

    const { socket } = props
    
    const user = React.useContext(UserContext)

    const { roomId } = useParams();

    console.log('⚡', socket.id)

    const [messages, setMessages] = React.useState<Message[]>([]);

    React.useEffect(() => {
        socket.on('messageResponse', (data) => setMessages((prev) => [...prev, data]));
    }, [messages]);

    if (user.user === undefined) {
        return (
            <Error />
        )
    }
    
    return (
        <>
            <styles.chat>
                <ChatBar socket={socket}/>
                <styles.chat__main>
                    <ChatBody socket={socket} user={user.user} room={roomId} messages={messages}/>
                    <ChatFooter socket={socket} user={user.user} room={roomId}/>
                </styles.chat__main>
            </styles.chat>
        </>
    );
}