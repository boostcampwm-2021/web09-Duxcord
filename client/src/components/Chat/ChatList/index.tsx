import React, { RefObject, useEffect } from 'react';
import { makeChatSection } from '@utils/makeChatSection';
import ChatItem from '../ChatItem';
import { Chats, Section, StickyWrapper } from '../style';

interface Props {
  chats: ChatData[] | undefined;
  chatListRef: RefObject<HTMLDivElement>;
  observedTarget: RefObject<HTMLDivElement>;
  onMount: () => void;
}

function ChatList({ chats, chatListRef, observedTarget, onMount }: Props) {
  useEffect(() => {
    onMount();
  }, []);

  return (
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
  );
}

export default ChatList;
