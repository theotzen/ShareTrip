import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from '../../pages/Chat/style';
import { Message, RoomWithLastMessage } from '../../apiTypes';

interface IChatBarRoomProps {
    room: RoomWithLastMessage;
}

export default function ChatBarRoom(props: IChatBarRoomProps) {

    const { room } = props;
    const navigate = useNavigate();

    function getTimeToDisplay(dateUpdated: Date): string {
        const now = Date.now()
        const updated = new Date(dateUpdated);
        const diffInMinutes = (now.valueOf() - updated.valueOf()) / 60000;

        if (diffInMinutes < 2) {
            return 'active just now'
        }
        else if (diffInMinutes < 60) {
            return diffInMinutes.toFixed(0) + 'min ago'
        }
        else if (diffInMinutes > 60 && diffInMinutes < 1440) {
            return (diffInMinutes / 60).toFixed(0) + 'hr ago'
        }
        else {
            return 'inactive'
        }
    }

    return (
        <styles.room_chat_bar key={room._id} onClick={() => navigate(`/chat/${room._id}`)}>
            <styles.room_upper_div_chat_bar>
                <styles.room_title_chat_bar>
                    {room.name}
                </styles.room_title_chat_bar>
                <styles.room_time_chat_bar>
                    {getTimeToDisplay(room.lastMessageDate)}
                </styles.room_time_chat_bar>
            </styles.room_upper_div_chat_bar>
            <styles.room_active_users_chat_bar>
                {room.users.length + ' active users'}
            </styles.room_active_users_chat_bar>
        </styles.room_chat_bar>
    )
}