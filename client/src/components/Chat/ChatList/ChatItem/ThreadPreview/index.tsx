import React from 'react';

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
      <p>{count}κ°μ λκΈ</p>
      <p>({new Date(threadLastTime).toLocaleTimeString('ko-KR').slice(0, -3)})</p>
    </ThreadPreviewWrapper>
  );
}

export default ThreadPreview;
