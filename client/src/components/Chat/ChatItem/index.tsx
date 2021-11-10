import React, { useState } from 'react';
import { postLikeChat } from '../../../api/postLikeChat';
import { STATUS_CODES } from '../../../api/STATUS_CODES';
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
    reactions,
  } = chatData;

  const [isReactioned, setIsReactioned] = useState(reactions.length !== 0);

  const handleLike = async () => {
    const handleLikeResponse = await postLikeChat({ chatID: id });
    switch (handleLikeResponse.status) {
      case STATUS_CODES.NO_CONTENTS:
        setIsReactioned(false);
        break;
      case STATUS_CODES.CREATE:
        setIsReactioned(true);
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
        {reactionsCount !== 0 && (
          <ChatReaction
            handleLike={handleLike}
            count={reactionsCount}
            isReactioned={isReactioned}
          />
        )}
      </div>
      {isFocused && <AddChatReaction handleLike={handleLike} />}
    </ChatWrapper>
  );
}

export default ChatItem;
