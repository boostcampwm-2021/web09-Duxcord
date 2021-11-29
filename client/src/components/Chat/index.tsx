import React, { useEffect } from 'react';

import { useChatInfinite, useChatSocket, useScroll, useSelectedChat } from '@hooks/index';
import { ChatData } from '@customTypes/chats';

import { makeChatSection } from '@utils/makeChatSection';

import ChatInput from './ChatInput';
import ChatItem from './ChatItem';
import UserConnection from './UserConnection';
import Thread from './Thread';
import { ChatContainer, Chats, ChatPart, ChatInputWrapper, StickyWrapper, Section } from './style';

function Chat() {
  const { chats, chatListRef, observedTarget } = useChatInfinite();
  const { scrollToBottom } = useScroll<'div'>(chatListRef);
  const selectedChat = useSelectedChat();

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useChatSocket(chatListRef);

  return (
    <ChatPart>
      <ChatContainer isSelectedChat={!!selectedChat}>
        <Chats ref={chatListRef}>
          <div ref={observedTarget}></div>
          {Object.entries(makeChatSection(chats)).map(([day, dayChats]) => (
            <Section key={day}>
              <StickyWrapper>
                <button>{day}</button>
              </StickyWrapper>
              {dayChats.map((chat: ChatData) => (
                <ChatItem key={chat.id} chatData={chat} />
              ))}
            </Section>
          ))}
        </Chats>
        <ChatInputWrapper>
          <ChatInput scrollToBottom={scrollToBottom} />
        </ChatInputWrapper>
      </ChatContainer>
      {selectedChat ? <Thread selectedChat={selectedChat} /> : <UserConnection />}
    </ChatPart>
  );
}

export default Chat;
