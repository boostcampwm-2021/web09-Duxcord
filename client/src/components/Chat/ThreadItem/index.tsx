import React from 'react';

import { Wrapper } from './style';

function ThreadItem({ threadData }: { threadData: ThreadData }) {
  const {
    content,
    createdAt,
    user: { thumbnail, username },
  } = threadData;

  return (
    <Wrapper>
      <img src={thumbnail ? thumbnail : '/images/default_profile.png'} alt="thumbnail" />
      <div>
        <div>
          <h2>{username}</h2>
          <p>{new Date(createdAt).toLocaleTimeString('ko-KR').slice(0, -3)}</p>
        </div>
        <div>{content}</div>
      </div>
    </Wrapper>
  );
}

export default ThreadItem;
