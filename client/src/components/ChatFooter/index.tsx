import * as React from 'react';
import useSWR from 'swr';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';
import * as io from 'socket.io-client'

import * as styles from '../../pages/Chat/style';
import { UserResponseSchema } from '../../apiTypes';


interface IChaFooterProps {
    socket: io.Socket;
    user: UserResponseSchema;
    room: string|undefined;
}

export default function ChatFooter(props: IChaFooterProps) {

    const { socket, user, room } = props
    const [message, setMessage] = useState<string>("")

    const handleTyping = () => {
        socket.emit('typing', { userId: user.id, roomId: room });
    }

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.trim()) {
        socket.emit('message', {
            text: message,
            name: user.name,
            userId: user.id,
            roomId: room
        });
        }
        setMessage('');
    }

    return (
        <>
            <styles.chat__footer>
                    <styles.chat__form onSubmit={handleSendMessage}>
                        <styles.message 
                            type="text" 
                            placeholder='Write message' 
                            className='message' 
                            value={message} 
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={handleTyping}
                        />
                        <styles.sendBtn>SEND</styles.sendBtn>
                    </styles.chat__form>
            </styles.chat__footer>
        </>
    );
}
