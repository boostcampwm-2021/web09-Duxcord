import React from 'react';
import { Wrapper } from './style';

function AddChatReaction({ handleLike }: { handleLike: () => {} }) {
  return (
    <Wrapper>
      <img src="/icons/btn-like.svg" alt="btn like" onClick={handleLike} />
      <img src="/icons/btn-thread.svg" alt="btn thread" />
    </Wrapper>
  );
}

export default AddChatReaction;
