import React, { useState } from 'react';
import { ChatData } from '../../../types/chats';
import AddChatReaction from '../AddChatReaction';
import { ChatWrapper, UserImage, ChatHeader } from './style';

function ChatItem({ chatData }: { chatData: ChatData }) {
  const {
    user: { username, thumbnail },
    createdAt,
    content,
  } = chatData;

  const [isFocused, setIsFocused] = useState(false);

  return (
    <ChatWrapper onMouseEnter={() => setIsFocused(true)} onMouseLeave={() => setIsFocused(false)}>
      <UserImage src={thumbnail ?? '/images/default_profile.png'} alt="user profile" />
      <div>
        <ChatHeader>
          <div>{username}</div>
          <div>{new Date(createdAt).toLocaleTimeString('ko-KR')}</div>
        </ChatHeader>
        <div>{content}</div>
      </div>
      {isFocused && <AddChatReaction />}
    </ChatWrapper>
  );
}

export default ChatItem;
