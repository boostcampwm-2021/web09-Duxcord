import React, { useCallback, useEffect, useRef } from 'react';
import ChatItem from './ChatItem';
import { ChatContainer, Chats, ChatPart } from './style';
import { ChatData } from '../../types/chats';
import ChatInput from './ChatInput';
import useSWRInfinite from 'swr/infinite';
import Socket, { socket } from '../../util/socket';
import { getFetcher } from '../../util/fetcher';
import { useSelectedChannel } from '../../hooks/useSelectedChannel';
import UserConnection from './UserConnection';
import Thread from './Thread';
import { useSelectedChat } from '../../hooks/useSelectedChat';
import { API_URL } from '../../api/API_URL';
import LikeEvent from '../../types/socket/LikeEvent';
import ThreadEvent from '../../types/socket/ThreadEvent';
import ChatEvent from '../../types/socket/ChatEvent';

const PAGE_SIZE = 20;
const THRESHOLD = 300;

function Chat() {
  const { id } = useSelectedChannel();
  const selectedChat = useSelectedChat();
  const { data: chats, mutate, setSize } = useSWRInfinite(API_URL.channel.getKey(id), getFetcher);
  const isEmpty = chats?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chats && chats[chats.length - 1]?.length < PAGE_SIZE);
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id === null) return;
    Socket.joinChannel({ channelType: ChatEvent.chatting, id });

    return () => {
      Socket.leaveChannel({ channelType: ChatEvent.chatting, id });
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
        if (!chats) return [chat];
        return [chat, ...chats];
      }, false);
      if (chatListRef.current === null) return;
      const { scrollTop, clientHeight, scrollHeight } = chatListRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < THRESHOLD) scrollToBottom();
    },
    [mutate],
  );

  const onLike = useCallback(
    (info: any) => {
      mutate((chats) => {
        if (!chats) return chats;
        return chats
          .flat()
          .map((chat: any) =>
            chat.id === info.chatID ? { ...chat, reactionsCount: info.reactionsCount } : chat,
          );
      }, false);
    },
    [mutate],
  );

  const onThread = useCallback(
    (info: any) => {
      mutate((chats) => {
        if (!chats) return chats;
        return chats.flat().map((chat: ChatData) =>
          chat.id === info.chatID
            ? {
                ...chat,
                threadsCount: info.threadsCount,
                threadWriter: info.threadWriter,
                threadLastTime: info.threadLastTime,
              }
            : chat,
        );
      }, false);
    },
    [mutate],
  );

  useEffect(() => {
    socket.on(ChatEvent.chat, onChat);
    socket.on(LikeEvent.like, onLike);
    socket.on(ThreadEvent.thread, onThread);
    return () => {
      socket.off(ChatEvent.chat);
      socket.off(LikeEvent.like);
      socket.off(ThreadEvent.thread);
    };
  }, [onChat, onLike, onThread]);

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
      {selectedChat ? <Thread selectedChat={selectedChat} /> : <UserConnection />}
    </ChatPart>
  );
}

export default Chat;
