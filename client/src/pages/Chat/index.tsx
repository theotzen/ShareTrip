import * as React from 'react';
import { useParams } from 'react-router-dom';

import ChatBar from '../../components/ChatBar'
import ChatFooter from '../../components/ChatFooter'
import ChatBody from '../../components/ChatBody'
import { UserContext } from '../../utils/context/UserContext';
import SocketContext from '../../utils/context/SocketContext';

import * as styles from './style';
import Error from '../Error';
import { Message, Room } from '../../apiTypes';
import Spinner from '../../components/Spinner';
import axios from 'axios';


interface IChatProps {}

export default function Chat(props: IChatProps) {
    
    const user = React.useContext(UserContext);
    const { socket, users } = React.useContext(SocketContext).SocketState

    const { roomId } = useParams();

    if (socket === undefined ){
        return <Spinner />
    }

    console.log('⚡', socket.id)

    const [messages, setMessages] = React.useState<Message[]>([]);
    const [loading, setLoading] = React.useState<Boolean>(false);


    React.useEffect(() => {
        socket.emit('join', {
            roomId: roomId,
            userId: user.user!.id
        }, async (message: string) => {
            console.info(message)
        });
    }, []);


    React.useEffect(() => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const response = await axios.get(`http://localhost:9000/api/message/getMessagesByRoomId/${roomId}`);
            console.info(`Messages gotten from chat for room ${roomId}`, response.data.result);
            setMessages((prev) => [...prev, ...response.data.result]);
          } catch (err: any) {
            console.error(err.message);
          }
          setLoading(false);
        }
        fetchData();
      }, [roomId]);


    React.useEffect(() => {
        socket.on('message', (data) => {
            console.log('From the user page : ', data)
            setMessages([...messages, data])});
    }, [socket, messages]);

    console.info('from the chat page ', messages)

    if (user.user === undefined) {
        return (
            <Error />
        )
    }
    
    return (
        <>
            <styles.chat>
                <ChatBar socket={socket} roomId={roomId!} user={user.user}/>
                <styles.chat__main>
                    <ChatBody socket={socket} user={user.user} room={roomId} messages={messages}/>
                    <ChatFooter socket={socket} user={user.user} room={roomId}/>
                </styles.chat__main>
            </styles.chat>
        </>
    );
}