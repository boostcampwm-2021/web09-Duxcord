import React from 'react';
import { Wrapper } from './style';

function ChatReaction({ count, handleLike }: { count: number; handleLike: () => {} }) {
  return <Wrapper onClick={handleLike}>👍 {count}</Wrapper>;
}

export default ChatReaction;
