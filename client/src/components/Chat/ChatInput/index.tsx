import React, { FormEvent, useRef } from 'react';
import { postChat } from '../../../api/postChat';
import { useSelectedChannel } from '@hooks/useSelectedChannel';
import { FileSelectIcon } from '../../common/Icon';
import { ButtonWrapper, Input, Wrapper } from './style';

function ChatInput({ scrollToBottom }: { scrollToBottom: () => void }) {
  const { id } = useSelectedChannel();
  const chatInputRef = useRef<HTMLInputElement>(null);

  const onSubmitChat = async (e: FormEvent) => {
    e.preventDefault();
    if (chatInputRef.current === null) return;
    const content = chatInputRef.current.value.trim();
    if (content === '' || id === null) return;
    postChat({ channelID: id, content: content });
    chatInputRef.current.value = '';
    scrollToBottom();
  };

  return (
    <Wrapper onSubmit={onSubmitChat}>
      <ButtonWrapper>
        <FileSelectIcon />
      </ButtonWrapper>
      <Input ref={chatInputRef} placeholder="Message to channel" />
    </Wrapper>
  );
}

export default ChatInput;
