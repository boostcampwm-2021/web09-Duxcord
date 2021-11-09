import React, { useCallback, useEffect, useRef } from 'react';
import ChatItem from './ChatItem';
import { ChatContainer, Chats, ChatPart } from './style';
import { ChatData } from '../../types/chats';
import ChatInput from './ChatInput';
import useSWRInfinite from 'swr/infinite';
import Socket, { socket } from '../../util/socket';
import { getFetcher } from '../../util/fetcher';
import { useSelectedChannel } from '../../hooks/useSelectedChannel';
import UserConnection from './UserConnection/UserConnection';

const getKey = (channelID: number | null) => (index: number, prevData: any) => {
  if (prevData && !prevData.length) return null;
  return `/api/channel/${channelID}?page=${index + 1}`;
};

const PAGE_SIZE = 20;
const THRESHOLD = 300;

function Chat() {
  const { id } = useSelectedChannel();
  const { data: chats, mutate, setSize } = useSWRInfinite(getKey(id), getFetcher);
  const isEmpty = chats?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chats && chats[chats.length - 1]?.length < PAGE_SIZE);
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id === null) return;
    Socket.joinChannel({ channelType: 'chatting', id });

    return () => {
      Socket.leaveChannel({ channelType: 'chatting', id });
    };
  }, [id]);

  const onScroll = useCallback(() => {
    if (chatListRef?.current?.scrollTop === 0 && !isReachingEnd) setSize((size) => size + 1);
  }, [isReachingEnd, setSize]);

  useEffect(() => {
    const chatListEl = chatListRef.current;
    chatListEl?.addEventListener('scroll', onScroll);

    return () => chatListEl?.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const scrollToBottom = () => {
    if (chatListRef.current === null) return;
    chatListRef.current.scrollTop = chatListRef.current?.scrollHeight;
  };

  useEffect(scrollToBottom, []);

  const onChat = useCallback(
    async (chat: ChatData) => {
      await mutate((chats) => {
        chats?.unshift(chat);
        return chats;
      });
      if (chatListRef.current === null) return;
      const { scrollTop, clientHeight, scrollHeight } = chatListRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < THRESHOLD) scrollToBottom();
    },
    [mutate],
  );

  useEffect(() => {
    socket.on('chat', onChat);

    return () => {
      socket.off('chat', onChat);
    };
  }, [mutate, onChat]);

  return (
    <ChatPart>
      <ChatContainer>
        <Chats ref={chatListRef}>
          {chats
            ?.flat()
            .reverse()
            .map((chat) => (
              <ChatItem key={chat.id} chatData={chat} />
            ))}
        </Chats>
        <ChatInput scrollToBottom={scrollToBottom} />
      </ChatContainer>
      <UserConnection />
    </ChatPart>
  );
}

export default Chat;
