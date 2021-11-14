import React from 'react';
import { User } from '@customTypes/chats';
import { ThreadPreviewWrapper } from './style';

function ThreadPreview({
  count,
  lastThreadUser: { thumbnail },
  threadLastTime,
  onClick,
}: {
  count: number;
  lastThreadUser: User;
  threadLastTime: Date;
  onClick: () => {};
}) {
  return (
    <ThreadPreviewWrapper onClick={onClick}>
      <img src={thumbnail ? thumbnail : '/images/default_profile.png'} alt="thumbnail" />
      <p>{count}개의 댓글</p>
      <p>({new Date(threadLastTime).toLocaleTimeString('ko-KR')})</p>
    </ThreadPreviewWrapper>
  );
}

export default ThreadPreview;
