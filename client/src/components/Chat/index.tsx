import React from 'react';
import ChatItem from './ChatItem';
import { ChatContainer } from './style';
import { ChatData } from "../../types/chats";

function Chat ({chats}:{chats:ChatData[]}) {
    
    return (
        <ChatContainer>
           {chats.map(chat => <ChatItem key={chat.id} chatData={chat}/>)}
        </ChatContainer>
    );
};

export default Chat;