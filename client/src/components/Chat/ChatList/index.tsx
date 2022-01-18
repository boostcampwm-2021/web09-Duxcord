import React, { RefObject, useEffect, useMemo } from 'react';
import { makeChatSection } from '@utils/index';
import ChatItem from './ChatItem';
import { Chats, Section, StickyWrapper } from './style';

interface Props {
  chats: ChatData[][] | undefined;
  chatListRef: RefObject<HTMLDivElement>;
  observedTarget: RefObject<HTMLDivElement>;
  onMount: () => void;
}

function ChatList({ chats, chatListRef, observedTarget, onMount }: Props) {
  const isNewFetched = useMemo(() => {
    const IDMap: { [key: number]: boolean } = {};
    chats?.[chats.length - 1].forEach((chat) => (IDMap[chat.id] = true));

    return IDMap;
  }, [chats]);

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
            <ChatItem key={chat.id} chatData={chat} newFetched={isNewFetched?.[chat.id] ?? false} />
          ))}
        </Section>
      ))}
    </Chats>
  );
}

export default ChatList;
