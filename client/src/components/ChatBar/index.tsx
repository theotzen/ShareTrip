import * as React from 'react';
import useSWR from 'swr';
import { useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';
import * as io from "socket.io-client";
import * as styles from '../../pages/Chat/style';
import { Message, Room, RoomWithLastMessage, UserResponseSchema } from '../../apiTypes';
import axios from 'axios';
import ChatBarRoom from '../ChatBarRoom';

interface IChatBarProps {
    socket: io.Socket;
    roomId: string;
    user: UserResponseSchema;
    message: Message;
}

export default function ChatBar(props: IChatBarProps) {

    const { socket, roomId, user, message } = props;
    const navigate = useNavigate();

    console.info(message)

    const [rooms, setRooms] = React.useState<RoomWithLastMessage[]>([]);
    const [loading, setLoading] = React.useState<Boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:9000/api/room/getRoomsForUserWithLastMessageTime/${user.id}`,
                    { withCredentials: true }
                );
                setRooms(response.data.result);
            } catch (err: any) {
                console.error(err.message);
            }
            setLoading(false);
        }
        fetchData();
    }, [roomId, message]);

    return (
        <>
            <styles.chat__sidebar>
                <h2>Open Chat</h2>
                <div>
                    <styles.chat__header>
                        Channels
                    </styles.chat__header>
                    <styles.chat__users>
                        {rooms
                            ?
                            rooms.map((room, i) => {
                                return <ChatBarRoom room={room} />
                            })
                            :
                            <p>No channel yet !</p>}
                    </styles.chat__users>
                </div>
            </styles.chat__sidebar>
        </>
    );
}
