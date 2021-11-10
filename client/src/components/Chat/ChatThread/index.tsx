import React from 'react';
import { User } from '../../../types/chats';
import { ChatThreadWrapper } from './style';

function ChatThread({
  count,
  lastThreadUser,
  onClick,
}: {
  count: number;
  lastThreadUser: User;
  onClick: () => {};
}) {
  return (
    <ChatThreadWrapper onClick={onClick}>
      {/* <img src={thumbnail ? thumbnail : '/images/default_profile.png'} alt="thumbnail" /> */}
      <p>{count}개의 댓글</p>
      <p>3분 전</p>
    </ChatThreadWrapper>
  );
}

export default ChatThread;
