import React from 'react';
import ChatItem from './ChatItem';
import { ChatContainer, Chats } from './style';
import { ChatData } from "../../types/chats";
import ChatInput from './ChatInput';

function Chat ({chats}:{chats:ChatData[]}) {
    
    return (
        <ChatContainer>
            <Chats>
                {chats.map(chat => <ChatItem key={chat.id} chatData={chat}/>)}
           </Chats>
           <ChatInput/>
        </ChatContainer>
    );
};

export default Chat;