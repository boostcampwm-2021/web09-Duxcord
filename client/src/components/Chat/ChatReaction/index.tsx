import React from 'react';
import { Wrapper } from './style';

function ChatReaction({ count }: { count: number }) {
  return <Wrapper>👍 {count}</Wrapper>;
}

export default ChatReaction;
