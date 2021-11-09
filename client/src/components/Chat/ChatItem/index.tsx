import React, { useState } from 'react';
import { postLikeChat } from '../../../api/postLikeChat';
import { ChatData } from '../../../types/chats';
import AddChatReaction from '../AddChatReaction';
import ChatReaction from '../ChatReaction';
import { ChatWrapper, UserImage, ChatHeader } from './style';

function ChatItem({ chatData }: { chatData: ChatData }) {
  const {
    id,
    user: { username, thumbnail },
    createdAt,
    content,
    reactionsCount,
  } = chatData;

  const [displayReaction, setDisplayReaction] = useState(reactionsCount);

  const handleLike = async () => {
    const handleLikeResponse = await postLikeChat({ chatID: id });
    switch (handleLikeResponse.status) {
      case 200:
        setDisplayReaction(displayReaction - 1);
        break;
      case 201:
        setDisplayReaction(displayReaction + 1);
        break;
    }
  };

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
        {displayReaction !== 0 && <ChatReaction handleLike={handleLike} count={displayReaction} />}
      </div>
      {isFocused && <AddChatReaction handleLike={handleLike} />}
    </ChatWrapper>
  );
}

export default ChatItem;
