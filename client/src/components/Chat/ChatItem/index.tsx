import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setSelectedChat } from '@redux/selectedChat/slice';
import { setSelectedUser } from '@redux/selectedUser/slice';
import { useUserdata } from '@hooks/index';
import { ChatData } from '@customTypes/chats';
import { postLikeChat } from '@api/postLikeChat';
import { STATUS_CODES } from '@api/STATUS_CODES';
import ThreadPreview from '../ThreadPreview';
import AddChatReaction from '../AddChatReaction';
import ChatReaction from '../ChatReaction';
import { ChatWrapper, UserImage, FileWrapper, ChatHeader, ChatContent } from './style';

function ChatItem({ chatData }: { chatData: ChatData }) {
  const {
    id: chatID,
    user,
    createdAt,
    content,
    reactionsCount,
    threadsCount,
    threadWriter,
    threadLastTime,
    reactions,
    files,
  } = chatData;

  const dispatch = useDispatch();

  const { userdata } = useUserdata();

  const [isReactioned, setIsReactioned] = useState(reactions?.length !== 0);

  const handleLike = async () => {
    const handleLikeResponse = await postLikeChat({ chatID });
    switch (handleLikeResponse.status) {
      case STATUS_CODES.NO_CONTENTS:
        setIsReactioned(false);
        break;
      case STATUS_CODES.CREATE:
        setIsReactioned(true);
        break;
    }
  };

  const onUserSelected = () => {
    if (user.id === userdata.id) {
      dispatch(setSelectedUser({ ...userdata, isOnline: true, isEditable: true }));
    } else {
      dispatch(setSelectedUser({ ...user, isOnline: null, isEditable: false }));
    }
  };

  const [isFocused, setIsFocused] = useState(false);

  const selectChat = () => dispatch(setSelectedChat(chatData));

  return (
    <ChatWrapper
      className="ChatItem"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <UserImage
        src={user.thumbnail ?? '/images/default_profile.png'}
        alt="user profile"
        onClick={() => onUserSelected()}
      />
      <div>
        <ChatHeader>
          <div>{user.username}</div>
          <div>{new Date(createdAt).toLocaleTimeString('ko-KR').slice(0, -3)}</div>
        </ChatHeader>
        <ChatContent>{content}</ChatContent>
        <FileWrapper>
          {files &&
            files.map((file) => (
              <div key={file.src}>
                <img src={file.src} alt="chat file" />
              </div>
            ))}
        </FileWrapper>
        <div>
          {reactionsCount !== 0 && (
            <ChatReaction
              handleLike={handleLike}
              count={reactionsCount}
              isReactioned={isReactioned}
            />
          )}
          {threadWriter && threadLastTime && (
            <ThreadPreview
              count={threadsCount}
              lastThreadUser={threadWriter}
              threadLastTime={threadLastTime}
              selectChat={() => selectChat()}
            />
          )}
        </div>
        {isFocused && <AddChatReaction handleLike={handleLike} selectChat={selectChat} />}
      </div>
    </ChatWrapper>
  );
}

export default ChatItem;
