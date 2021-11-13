import React from 'react';
import { Wrapper } from './style';

function AddChatReaction({
  handleLike,
  selectChat,
}: {
  handleLike: Function;
  selectChat: Function;
}) {
  return (
    <Wrapper>
      <img src="/icons/btn-like.svg" alt="btn like" onClick={() => handleLike()} />
      <img src="/icons/btn-thread.svg" alt="btn thread" onClick={() => selectChat()} />
    </Wrapper>
  );
}

export default AddChatReaction;
