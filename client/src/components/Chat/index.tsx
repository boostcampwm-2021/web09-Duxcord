import React from 'react';
import ChatItem from './ChatItem';
import { ChatContainer } from './style';
import { ChatData } from "../../types/chats";
import ChatInput from './ChatInput';

function Chat ({chats}:{chats:ChatData[]}) {
    
    return (
        <ChatContainer>
           {chats.map(chat => <ChatItem key={chat.id} chatData={chat}/>)}
           <ChatInput/>
        </ChatContainer>
    );
};

export default Chat;