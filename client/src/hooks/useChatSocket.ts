import { useCallback, useEffect } from 'react';
import { SOCKET } from '@constants/index';
import { Socket, socket } from '@utils/index';
import { useScroll, useSelectedChannel, useChats } from '.';

const THRESHOLD = 300;

export const useChatSocket = (chatListRef: React.RefObject<HTMLDivElement>) => {
  const { scrollToBottom } = useScroll(chatListRef);
  const { id } = useSelectedChannel();
  const { mutate } = useChats(id);
  const onChat = useCallback(
    async (chat: ChatData) => {
      await mutate((chats) => {
        if (!chats) return [[chat]];
        chats[0].unshift(chat);
        return [...chats];
      }, false);
      if (chatListRef.current === null) return;
      const { scrollTop, clientHeight, scrollHeight } = chatListRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < THRESHOLD) scrollToBottom({ smooth: true });
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
    if (id === null) return;
    Socket.joinChannel({ channelType: 'chatting', id });

    return () => {
      Socket.leaveChannel({ channelType: 'chatting', id });
    };
  }, [id]);

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
};
