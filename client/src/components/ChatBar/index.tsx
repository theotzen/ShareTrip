import * as React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { fetcher } from '../../api/api';
import * as io from "socket.io-client";
import * as styles from '../../pages/Chat/style';
import { Room, UserResponseSchema } from '../../apiTypes';
import axios from 'axios';

interface IChatBarProps {
    socket: io.Socket;
    roomId: string;
    user: UserResponseSchema;
}

export default function ChatBar(props: IChatBarProps) {

    const { socket, roomId, user } = props;

    const [rooms, setRooms] = React.useState<Room[]>([]);
    const [loading, setLoading] = React.useState<Boolean>(false);

    console.info('from chat bar socket ', socket.id);

    React.useEffect(() => {
        const fetchData = async () =>{
          setLoading(true);
          try {
            const response = await axios.get(`http://localhost:9000/api/room/getRoomsForUser/${user.id}`);
            console.info(response);
            setRooms(response.data.result);
          } catch (err: any) {
            console.error(err.message);
          }
          setLoading(false);
        }
    
        fetchData();
      }, [roomId]);

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
                        rooms.map((rooms, i) => {
                                return <p key={i}>{rooms.name}</p>
                            })
                        :
                        <p>No channel yet !</p>}
                    </styles.chat__users>
                </div>
            </styles.chat__sidebar>
        </>
    );
}
