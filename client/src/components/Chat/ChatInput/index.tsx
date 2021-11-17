import React, { FormEvent, useRef } from 'react';
import { postChat } from '../../../api/postChat';
import { useSelectedChannel } from '@hooks/index';
import { FileSelectIcon } from '../../common/Icons';
import { ButtonWrapper, InputWrapper, Wrapper } from './style';

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
      <InputWrapper>
        <input ref={chatInputRef} placeholder="Message to channel" />
        <div></div>
      </InputWrapper>
    </Wrapper>
  );
}

export default ChatInput;
