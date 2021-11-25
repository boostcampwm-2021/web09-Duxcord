import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import { useSelectedChannel, useSelectedChat } from '@hooks/index';
import LikeEvent from '@customTypes/socket/LikeEvent';
import ThreadEvent from '@customTypes/socket/ThreadEvent';
import ChatEvent from '@customTypes/socket/ChatEvent';
import { ChatData } from '@customTypes/chats';
import { API_URL } from '@api/API_URL';
import Socket, { socket } from '@utils/socket';
import { getFetcher } from '@utils/fetcher';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';
import UserConnection from './UserConnection';
import Thread from './Thread';
import { ChatContainer, Chats, ChatPart, ChatInputWrapper, StickyWrapper, Section } from './style';
import { makeChatSection } from '@utils/makeChatSection';
import { getChatsHeight } from '@utils/getChatsHeight';

const PAGE_SIZE = 20;
const THRESHOLD = 300;

function Chat() {
  const { id } = useSelectedChannel();
  const [isInitialized, setIsInitialized] = useState(true);
  const selectedChat = useSelectedChat();
  const {
    data: chats,
    mutate,
    setSize,
    isValidating,
  } = useSWRInfinite(API_URL.channel.getKey(id), getFetcher);
  const isEmpty = !chats?.length;
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
    if (isValidating) return;
    if (chatListRef?.current?.scrollTop === 0 && !isReachingEnd) {
      setSize((size) => size + 1);
    }
  }, [isReachingEnd, setSize, isValidating]);

  useEffect(() => {
    if (chatListRef?.current?.scrollTop && chatListRef?.current?.scrollTop > 0) return;
    (async () => {
      if (chats) {
        const height = await getChatsHeight(chatListRef, chats[chats.length - 1]?.length);
        chatListRef.current?.scrollTo({ top: height });
        if (isInitialized) {
          chatListRef.current?.scrollTo({ top: chatListRef.current?.scrollHeight });
          setIsInitialized(false);
        }
      }
    })();
  }, [isValidating, isInitialized]);

  useEffect(() => {
    const chatListEl = chatListRef.current;
    chatListEl?.addEventListener('scroll', onScroll);

    return () => chatListEl?.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const scrollToBottom = () => {
    if (chatListRef.current === null) return;
    chatListRef.current.scrollTo({ top: chatListRef.current?.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    chatListRef.current?.scrollTo({ top: chatListRef.current?.scrollHeight, behavior: 'smooth' });
  }, [isEmpty]);

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
      <ChatContainer isSelectedChat={!!selectedChat}>
        <Chats ref={chatListRef}>
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
