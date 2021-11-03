import React from 'react';
import { ChatData } from '../../../types/chats';
import { ChatWrapper, UserImage, ChatHeader } from './style';

function ChatItem ({chatData}:{chatData:ChatData}) {
    const {imgSrc, username, createdAt, content} = chatData
    return (
        <ChatWrapper>
            <UserImage src={imgSrc} alt="user profile" />
            <div>
                <ChatHeader>
                    <div>{username}</div>
                    <div>{createdAt}</div>
                </ChatHeader>
                <div>{content}</div>
            </div>
        </ChatWrapper>
    );
};

export default ChatItem;