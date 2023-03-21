import * as React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';

import * as styles from '../../pages/Chat/style';

interface HealthcheckerResponse {
    message: string;
}

export default function ChatBar() {

    return (
        <>
            <styles.chat__sidebar>
                <h2>Open Chat</h2>
                <div>
                    <styles.chat__header>
                        Active users
                    </styles.chat__header>
                    <styles.chat__users>
                        <p>USER 1</p>
                        <p>USER 2</p>
                        <p>USER 3</p>
                    </styles.chat__users>
                </div>
            </styles.chat__sidebar>
        </>
    );
}
