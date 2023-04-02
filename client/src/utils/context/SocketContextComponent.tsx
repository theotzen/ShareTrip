import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from './SocketContext';
import { UserContext } from './UserContext';

export interface ISocketContextComponentProps extends PropsWithChildren {};

const SocketContextComponent: React.FC<ISocketContextComponentProps> = (props) => { 
    const { children } = props;

    const user = React.useContext(UserContext).user!;

    const socket = useSocket('http://localhost:9000', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false
        }
    );

    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        socket.connect();
        SocketDispatch({ type: 'update_socket', payload: socket });
        StartListeners();
        SendHandshake();
    }, []);

    const StartListeners = () => {
        /** Messages */
        socket.on('user_connected', (users: string[]) => {
            console.info('User connected message received');
            SocketDispatch({ type: 'update_users', payload: users });
        });

        /** Messages */
        socket.on('user_disconnected', (userId: string) => {
            console.info('User disconnected message received');
            SocketDispatch({ type: 'remove_user', payload: userId });
        });

        /** Connection / reconnection listeners */
        socket.io.on('reconnect', (attempt) => {
            console.info('Reconnected on attempt: ' + attempt);
            SendHandshake();
        });

        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnection Attempt: ' + attempt);
        });

        socket.io.on('reconnect_error', (error) => {
            console.info('Reconnection error: ' + error);
        });

        socket.io.on('reconnect_failed', () => {
            console.info('Reconnection failure.');
            alert('We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later.');
        });
    }

    const SendHandshake = async () => {
        console.info('Sending handshake to server ...');

        socket.emit('handshake', user.id, async (userId: string, users: string[]) => {
            console.info('User handshake callback message received from user : ' + userId);
            console.info('users received after handshake : ' + users)
            SocketDispatch({ type: 'update_users', payload: users });
        });

        setLoading(false);
    };

    if (loading) return <p>... loading Socket IO ....</p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>
}

export default SocketContextComponent;