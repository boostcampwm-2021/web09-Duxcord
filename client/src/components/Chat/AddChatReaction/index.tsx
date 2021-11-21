import React from 'react';

import { LikeIcon, ThreadOpenIcon } from '../../common/Icons';
import { Wrapper } from './style';

function AddChatReaction({
  handleLike,
  selectChat,
}: {
  handleLike: () => void;
  selectChat: () => void;
}) {
  return (
    <Wrapper>
      <LikeIcon onClick={handleLike} />
      <ThreadOpenIcon onClick={selectChat} />
    </Wrapper>
  );
}

export default AddChatReaction;
