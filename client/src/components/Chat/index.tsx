import React, { useCallback, useRef } from 'react';

import { useChatInfinite, useChatSocket, useScroll, useSelectedChat } from '@hooks/index';

import ChatInput from './ChatInput';
import UserConnection from './UserConnection';
import Thread from './Thread';
import { ChatContainer, ChatPart, ChatInputWrapper } from './style';
import ChatList from './ChatList';

function Chat() {
  const chatListRef = useRef<HTMLDivElement>(null);
  const { scrollToBottom } = useScroll(chatListRef);
  const selectedChat = useSelectedChat();
  const { chats, observedTarget } = useChatInfinite(chatListRef);

  useChatSocket(chatListRef);

  const onInput = useCallback(() => scrollToBottom({ smooth: true }), [scrollToBottom]);

  return (
    <ChatPart>
      <ChatContainer isSelectedChat={!!selectedChat}>
        <ChatList
          chats={chats}
          chatListRef={chatListRef}
          observedTarget={observedTarget}
          onMount={scrollToBottom}
        />
        <ChatInputWrapper>
          <ChatInput onInput={onInput} />
        </ChatInputWrapper>
      </ChatContainer>
      {selectedChat ? <Thread selectedChat={selectedChat} /> : <UserConnection />}
    </ChatPart>
  );
}

export default Chat;
