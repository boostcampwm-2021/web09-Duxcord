import React from 'react';

import { User } from '@customTypes/chats';
import { ThreadPreviewWrapper } from './style';

function ThreadPreview({
  count,
  lastThreadUser: { thumbnail },
  threadLastTime,
  selectChat,
}: {
  count: number;
  lastThreadUser: User;
  threadLastTime: Date;
  selectChat: () => void;
}) {
  return (
    <ThreadPreviewWrapper onClick={selectChat}>
      <img src={thumbnail ? thumbnail : '/images/default_profile.png'} alt="thumbnail" />
      <p>{count}개의 댓글</p>
      <p>({new Date(threadLastTime).toLocaleTimeString('ko-KR').slice(0, -3)})</p>
    </ThreadPreviewWrapper>
  );
}

export default ThreadPreview;
