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
    console.log('⚡⚡⚡⚡', roomId)

    const [messages, setMessages] = React.useState<Message[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    // const [typingStatus, setTypingStatus] = React.useState<string>('');
    const lastMessageRef = React.useRef<null | HTMLDivElement>(null);


    React.useEffect(() => {
        socket.emit('join', {
            roomId: roomId,
            userId: user.user!.id
        }, async (message: string) => {
            console.info(message)
        });
    }, [roomId]);


    React.useEffect(() => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const response = await axios.get(
                    `http://localhost:9000/api/message/getMessagesByRoomId/${roomId}`,
                    { withCredentials: true }
                );
            console.info(`Messages gotten from chat for room ${roomId}`, response.data.result);
            setMessages((prev) => [...response.data.result]);
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


/*     React.useEffect(() => {
        socket.on('typingResponse', (data) => {
            console.log(data);
            setTypingStatus(data + ' is typing');
        });
      }, [socket]);
 */

    React.useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth'})
        }
    }, [messages])

    if (user.user === undefined) {
        return (
            <Error />
        )
    }

    if (loading) {
        return (
            <Spinner />
        )
    }
    
    return (
        <>
            <styles.chat>
                <ChatBar socket={socket} roomId={roomId!} user={user.user}/>
                <styles.chat__main>
                    <ChatBody 
                        socket={socket} 
                        user={user.user} 
                        room={roomId} 
                        messages={messages} 
                        lastMessageRef={lastMessageRef}
                        // typingStatus={typingStatus}
                    />
                    <ChatFooter socket={socket} user={user.user} room={roomId}/>
                </styles.chat__main>
            </styles.chat>
        </>
    );
}