import React from 'react';

import { Wrapper } from './style';

function ChatReaction({
  count,
  handleLike,
  isReactioned,
}: {
  count: number;
  handleLike: () => void;
  isReactioned: boolean;
}) {
  return (
    <Wrapper onClick={handleLike} isActive={isReactioned}>
      👍 {count}
    </Wrapper>
  );
}

export default ChatReaction;
