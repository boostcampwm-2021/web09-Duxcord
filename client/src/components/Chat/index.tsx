import React, { useCallback, useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';

import { useSelectedChannel, useSelectedChat } from '@hooks/index';
import { ChatData } from '@customTypes/chats';
import Socket, { socket } from '@utils/socket';
import { getFetcher } from '@utils/fetcher';
import { makeChatSection } from '@utils/makeChatSection';
import { getChatsHeight } from '@utils/getChatsHeight';
import { API_URL } from '@utils/constants/API_URL';
import { SOCKET } from '@utils/constants/SOCKET_EVENT';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';
import UserConnection from './UserConnection';
import Thread from './Thread';
import { ChatContainer, Chats, ChatPart, ChatInputWrapper, StickyWrapper, Section } from './style';

const PAGE_SIZE = 20;
const THRESHOLD = 300;
const OBSERVER_ROOT_MARGIN = '300px 0px 0px 0px';

function Chat() {
  const { id } = useSelectedChannel();
  const selectedChat = useSelectedChat();
  const {
    data: chats,
    mutate,
    setSize,
    isValidating,
  } = useSWRInfinite(API_URL.CHANNEL.GET_BY_PAGE(id), getFetcher, { suspense: true });
  const isValidatingRef = useRef(false);
  isValidatingRef.current = isValidating;
  const isEmpty = !chats?.length;
  const isReachingEnd = useRef(false);
  isReachingEnd.current = isEmpty || (chats && chats[chats.length - 1]?.length < PAGE_SIZE);
  const observedTarget = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id === null) return;
    Socket.joinChannel({ channelType: 'chatting', id });

    return () => {
      Socket.leaveChannel({ channelType: 'chatting', id });
    };
  }, [id]);

  useEffect(() => {
    if (isValidating) return;
    if (chatListRef?.current?.scrollTop && chatListRef?.current?.scrollTop > 0) return;
    (async () => {
      if (chats) {
        const height = await getChatsHeight(chatListRef, chats[chats.length - 1]?.length);
        chatListRef.current?.scrollTo({ top: height });
      }
    })();
  }, [isValidating]);

  const onIntersect = useCallback(
    ([entry]) => {
      if (isValidatingRef.current) return;
      if (entry.isIntersecting && !isReachingEnd.current) {
        setSize((size) => size + 1);
      }
    },
    [setSize],
  );

  useEffect(() => {
    if (!observedTarget.current) return;
    if (!chatListRef.current) return;
    const chatListEl = chatListRef.current;
    const observer = new IntersectionObserver(onIntersect, {
      root: chatListEl,
      rootMargin: OBSERVER_ROOT_MARGIN,
    });
    observer.observe(observedTarget.current);

    return () => observer.disconnect();
  }, []);

  const scrollToBottom = (smooth: boolean = true) => {
    chatListRef.current?.scrollTo({
      top: chatListRef.current?.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, []);

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
    socket.on(SOCKET.CHAT_EVENT.CHAT, onChat);
    socket.on(SOCKET.CHAT_EVENT.LIKE, onLike);
    socket.on(SOCKET.CHAT_EVENT.THREAD, onThread);
    return () => {
      socket.off(SOCKET.CHAT_EVENT.CHAT);
      socket.off(SOCKET.CHAT_EVENT.LIKE);
      socket.off(SOCKET.CHAT_EVENT.THREAD);
    };
  }, [onChat, onLike, onThread]);

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
