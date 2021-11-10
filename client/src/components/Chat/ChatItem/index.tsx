import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postLikeChat } from '../../../api/postLikeChat';
import { STATUS_CODES } from '../../../api/STATUS_CODES';
import { setSelectedChat } from '../../../redux/selectedChat/slice';
import { ChatData } from '../../../types/chats';
import AddChatReaction from '../AddChatReaction';
import ChatReaction from '../ChatReaction';
import ChatThread from '../ChatThread';
import { ChatWrapper, UserImage, ChatHeader } from './style';

function ChatItem({ chatData }: { chatData: ChatData }) {
  const {
    id,
    user: { username, thumbnail },
    createdAt,
    content,
    reactionsCount,
    threadCount,
    lastThreadUser,
    reactions,
  } = chatData;

  const dispatch = useDispatch();

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
        <div>
          {reactionsCount !== 0 && (
            <ChatReaction
              handleLike={handleLike}
              count={reactionsCount}
              isReactioned={isReactioned}
            />
          )}
          {lastThreadUser !== null && (
            <ChatThread
              count={threadCount}
              lastThreadUser={lastThreadUser}
              onClick={() => dispatch(setSelectedChat(chatData))}
            />
          )}
        </div>
        {isFocused && <AddChatReaction handleLike={handleLike} chatData={chatData} />}
      </div>
    </ChatWrapper>
  );
}

export default ChatItem;
