import * as React from 'react';
import useSWR from 'swr';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';

import * as styles from '../../pages/Chat/style';

interface HealthcheckerResponse {
    message: string;
}

export default function ChatFooter() {

    const [message, setMessage] = useState<string>("")

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(message.trim()) {
            console.log(message)
        }
        setMessage("")
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
                        />
                        <styles.sendBtn>SEND</styles.sendBtn>
                    </styles.chat__form>
            </styles.chat__footer>
        </>
    );
}
